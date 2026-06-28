import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "@/hooks/colors";
import { getUnlocks, UnlockListItem } from "@/services/unlockApi";
import { resolveProfilePicture } from "@/utils/resolveMediaUrl";
import { reportUnresponsiveUser } from "@/services/reportApi";
import { useAuth } from "@/hooks/useAuth";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { getSurrogateById, getAgentById, getUserById } from "@/services/profileApi";
import AdBanner from "@/components/ads/AdBanner";
import BoostCarousel from "@/components/boost/BoostCarousel";
import HelpServiceButton from "@/components/HelpServiceButton";

function formatTimeRemaining(expiresAt: string): string {
  const remaining = new Date(expiresAt).getTime() - Date.now();
  if (remaining <= 0) return "Expired";

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  if (days > 30) {
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? "s" : ""} remaining`;
  }
  if (days > 0) return `${days}d ${hours}h remaining`;
  return `${hours}h remaining`;
}

function getRoleBadgeColor(role: string): string {
  switch (role) {
    case "SURROGATE":
      return "#F59E0B";
    case "AGENT":
      return "#2196F3";
    case "INTENDED_PARENT":
      return "#4CAF50";
    default:
      return "#9E9E9E";
  }
}

function getProfilePath(targetUser: UnlockListItem["targetUser"]): string {
  switch (targetUser.role) {
    case "SURROGATE":
      return "/surrogate/surrogateProfileScreen";
    case "AGENT":
      return "/agent/agentProfileScreen";
    default:
      return "/";
  }
}

const REPORT_REASONS = [
  { key: "not_responding", label: "Not responding to messages or calls" },
  { key: "not_available", label: "No longer available / inactive" },
  { key: "inappropriate", label: "Inappropriate behavior" },
  { key: "incorrect_info", label: "Profile information seems incorrect" },
  { key: "other", label: "Other" },
];

export default function NetworkScreen() {
  const { user } = useAuth();
  const role = user?.role;
  const isSurrogate = role === "SURROGATE";

  const [unlocks, setUnlocks] = useState<UnlockListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());

  // Report modal state
  const [reportTarget, setReportTarget] = useState<UnlockListItem | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [reasonDetail, setReasonDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callNumbers, setCallNumbers] = useState<string[]>([]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const fetchUnlocks = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const data = await getUnlocks();
      setUnlocks(data.unlocks || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load unlocked profiles");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUnlocks();
  }, [fetchUnlocks]);

  const onRefresh = () => fetchUnlocks(true);

  const handleProfilePress = (item: UnlockListItem) => {
    const path = getProfilePath(item.targetUser);
    if (path === "/") return;
    router.push({
      pathname: path as any,
      params: { id: item.targetUserId, fromNetwork: "1" },
    });
  };

  const handleChat = (item: UnlockListItem) => {
    const userId = item.targetUser.id || item.targetUserId;
    router.push({
      pathname: "/(tabs)/chat/conversation",
      params: { otherUserId: userId },
    });
  };

  const handleCall = async (item: UnlockListItem) => {
    try {
      let phone1: string | null | undefined;
      let phone2: string | null | undefined;
      let emergency: string | null | undefined;

      if (item.targetUser.role === "SURROGATE") {
        const res = await getSurrogateById(item.targetUserId);
        phone1 = res.phone1;
        phone2 = res.phone2;
        emergency = res.emergencyContactPhone;
      } else if (item.targetUser.role === "AGENT") {
        const res = await getAgentById(item.targetUserId);
        phone1 = res.data?.phone1;
        phone2 = res.data?.phone2;
      } else {
        const res = await getUserById(item.targetUserId);
        phone1 = res.phone1;
        phone2 = res.phone2;
      }

      const numbers = [phone1, phone2, emergency].filter(Boolean) as string[];

      if (numbers.length === 0) {
        Toast.show({
          text1: "No phone number available",
          type: "customWarning" as ToastType,
        });
        return;
      }

      if (numbers.length === 1) {
        Linking.openURL(`tel:${numbers[0]}`);
        return;
      }

      setCallNumbers(numbers);
      setShowCallModal(true);
    } catch {
      Toast.show({
        text1: "Failed to load contact",
        type: "customError" as ToastType,
      });
    }
  };

  const openReportModal = (item: UnlockListItem) => {
    setReportTarget(item);
    setSelectedReason(null);
    setReasonDetail("");
  };

  const closeReportModal = () => {
    setReportTarget(null);
    setSelectedReason(null);
    setReasonDetail("");
  };

  const handleSubmitReport = async () => {
    if (!reportTarget || !selectedReason) return;
    setSubmitting(true);
    try {
      const needsDetail = selectedReason === "other" || selectedReason === "inappropriate";
      await reportUnresponsiveUser({
        targetUserId: reportTarget.targetUserId,
        reason: selectedReason,
        reasonDetail: needsDetail ? reasonDetail : undefined,
      });
      setReportedIds((prev) => new Set(prev).add(reportTarget.targetUserId));
      Toast.show({
        text1: "Report submitted",
        type: "customSuccess" as ToastType,
        text2: "We'll investigate within 24 hours.",
      });
    } catch {
      Toast.show({
        text1: "Report failed",
        type: "customError" as ToastType,
        text2: "Please try again later.",
      });
    } finally {
      setSubmitting(false);
      closeReportModal();
    }
  };

  const renderItem = ({ item }: { item: UnlockListItem }) => {
    const avatarUrl = resolveProfilePicture(item.targetUser.profilePicture);
    const displayName = item.targetUser.userName || "unknown";
    const isReported = reportedIds.has(item.targetUserId);

    return (
      <View style={[styles.card, isReported && styles.cardReported]}>
        <TouchableOpacity
          style={styles.cardMain}
          onPress={() => handleProfilePress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={[styles.avatar, isReported && styles.avatarReported]}
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  styles.avatarPlaceholder,
                  isReported && styles.avatarReported,
                ]}
              >
                <Text style={styles.avatarLetter}>
                  {(displayName[0] || "?").toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <Text style={[styles.name, isReported && styles.textReported]} numberOfLines={1}>
              @{displayName}
            </Text>

            <View
              style={[
                styles.roleBadge,
                { backgroundColor: getRoleBadgeColor(item.targetUser.role) },
                isReported && styles.badgeReported,
              ]}
            >
              <Text style={styles.roleText}>
                {item.targetUser.role.replace(/_/g, " ")}
              </Text>
            </View>

            {item.expiresAt && (
              <Text style={[styles.expiryText, isReported && styles.textReported]}>
                {formatTimeRemaining(item.expiresAt)}
              </Text>
            )}

            {isReported && (
              <View style={styles.reportedLabel}>
                <Entypo name="flag" size={12} color="#D32F2F" />
                <Text style={styles.reportedLabelText}>Reported</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleChat(item)}
            activeOpacity={0.7}
          >
            <Entypo name="chat" size={16} color={colors.primary} />
            <Text style={styles.actionBtnText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleCall(item)}
            activeOpacity={0.7}
          >
            <Entypo name="phone" size={16} color={colors.primary} />
            <Text style={styles.actionBtnText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.reportBtn, isReported && styles.reportBtnDone]}
            onPress={() => !isReported && openReportModal(item)}
            activeOpacity={0.7}
            disabled={isReported}
          >
            <Entypo
              name="flag"
              size={16}
              color={isReported ? "#999" : "#fff"}
            />
            <Text style={[styles.reportBtnText, isReported && styles.reportBtnTextDone]}>
              {isReported ? "Reported" : "Report"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchUnlocks()}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Network</Text>
      </View>

      <FlatList
        data={unlocks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          isSurrogate ? <AdBanner /> : <BoostCarousel />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No connections yet
            </Text>
            <Text style={styles.emptySubtext}>
              Start unlocking profiles to build your network
            </Text>
          </View>
        }
      />

      {/* Report confirmation modal */}
      <Modal
        visible={!!reportTarget}
        transparent
        animationType="slide"
        onRequestClose={closeReportModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { marginBottom: Math.max(keyboardHeight - 20, 0) }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Unresponsive User</Text>
              <TouchableOpacity onPress={closeReportModal}>
                <Entypo name="cross" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalDescription}>
                Let us know why you're reporting this user. We'll investigate
                within 24 hours and provide a free replacement.
              </Text>

              <View style={styles.reasonsList}>
                {REPORT_REASONS.map((reason) => {
                  const isSelected = selectedReason === reason.key;
                  return (
                    <TouchableOpacity
                      key={reason.key}
                      style={[
                        styles.reasonItem,
                        isSelected && styles.reasonItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedReason(reason.key);
                        if (reason.key !== "other") setReasonDetail("");
                      }}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.radio,
                          isSelected && styles.radioSelected,
                        ]}
                      >
                        {isSelected && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.reasonLabel,
                          isSelected && styles.reasonLabelSelected,
                        ]}
                      >
                        {reason.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {(selectedReason === "other" || selectedReason === "inappropriate") && (
                  <TextInput
                    style={styles.reasonInput}
                    placeholder={
                      selectedReason === "inappropriate"
                        ? "Please provide more details about the behavior..."
                        : "Please describe the issue..."
                    }
                    placeholderTextColor="#999"
                    value={reasonDetail}
                    onChangeText={setReasonDetail}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    autoFocus
                  />
                )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={closeReportModal}
                disabled={submitting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  (!selectedReason || ((selectedReason === "other" || selectedReason === "inappropriate") && !reasonDetail.trim())) &&
                    styles.submitBtnDisabled,
                ]}
                onPress={handleSubmitReport}
                disabled={
                  !selectedReason ||
                  ((selectedReason === "other" || selectedReason === "inappropriate") && !reasonDetail.trim()) ||
                  submitting
                }
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit Report</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Call number selection modal */}
      <Modal
        visible={showCallModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCallModal(false)}
      >
        <Pressable style={styles.callModalOverlay} onPress={() => setShowCallModal(false)}>
          <Pressable style={styles.callModalContent}>
            <Text style={styles.callModalTitle}>Select Number to Call</Text>
            {callNumbers.map((num, idx) => (
              <TouchableOpacity
                key={`call-${idx}`}
                style={styles.callModalOption}
                onPress={() => {
                  setShowCallModal(false);
                  Linking.openURL(`tel:${num}`);
                }}
              >
                <Ionicons name="call-outline" size={18} color="#0A2A66" />
                <Text style={styles.callModalOptionText}>{num}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.callModalCancel}
              onPress={() => setShowCallModal(false)}
            >
              <Text style={styles.callModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
      <HelpServiceButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  header: {
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardReported: {
    opacity: 0.65,
  },
  cardMain: {
    flexDirection: "row",
    padding: 14,
    paddingBottom: 0,
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarReported: {
    opacity: 0.7,
  },
  avatarPlaceholder: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: "700",
    color: "#666",
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  badgeReported: {
    opacity: 0.6,
  },
  roleText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  expiryText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  textReported: {
    color: "#999",
  },
  reportedLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  reportedLabelText: {
    fontSize: 12,
    color: "#D32F2F",
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    paddingTop: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  reportBtn: {
    backgroundColor: "#D32F2F",
    borderColor: "#D32F2F",
  },
  reportBtnDone: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ddd",
  },
  reportBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  reportBtnTextDone: {
    color: "#999",
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Report modal
  modalScroll: {
    maxHeight: 320,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  modalDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  reasonsList: {
    gap: 8,
    marginBottom: 12,
  },
  reasonItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#eee",
  },
  reasonItemSelected: {
    backgroundColor: "#FFF0F0",
    borderColor: "#D32F2F",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: "#D32F2F",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D32F2F",
  },
  reasonLabel: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  reasonLabelSelected: {
    fontWeight: "600",
    color: "#D32F2F",
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#333",
    minHeight: 80,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  submitBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#D32F2F",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },

  // Call number selection modal
  callModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  callModalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  callModalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
    textAlign: "center",
  },
  callModalOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  callModalOptionText: {
    fontSize: 15,
    color: "#0A2A66",
    fontWeight: "500",
  },
  callModalCancel: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  callModalCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
});
