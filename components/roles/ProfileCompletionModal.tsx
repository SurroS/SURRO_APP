import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  calculateProfileProgress,
  getMissingFields,
} from "@/utils/profileHelpers";

interface ProfileCompletionModalProps<TProfile = any> {
  visible: boolean;
  onClose: () => void;
  profile: TProfile | null;
  redirectPath?: string;
  profileTypeName?: string;
}

export default function ProfileCompletionModal<TProfile>({
  visible,
  onClose,
  profile,
  redirectPath = "/profile",
  profileTypeName = "Profile",
}: ProfileCompletionModalProps<TProfile>) {
  const insets = useSafeAreaInsets();
  const progress = calculateProfileProgress(profile as any);
  const hasProfile = !!profile;
  const missingGroups = hasProfile ? getMissingFields(profile as any) : [];

  const firstMissingRoute = missingGroups[0]?.route || redirectPath;

  const title = hasProfile
    ? `Complete Your Profile`
    : `Create Your Profile`;

  const message = hasProfile
    ? `Your profile is ${progress}% complete.`
    : `You haven't created a profile yet.`;

  const handleComplete = () => {
    onClose();
    router.navigate(firstMissingRoute as any);
  };

  const handleRowPress = (route: string) => {
    onClose();
    router.navigate(route as any);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { paddingBottom: 24 + insets.bottom }]}>
          <Ionicons name="person-circle" size={56} color="#0E0E55" />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {missingGroups.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.missingHeader}>Missing items — tap to fix</Text>
              <ScrollView style={styles.missingList} nestedScrollEnabled>
                {missingGroups.map((group, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.missingRow}
                    onPress={() => group.route && handleRowPress(group.route)}
                    activeOpacity={group.route ? 0.7 : 1}
                  >
                    <Text style={styles.bullet}>{"\u2022"}</Text>
                    <View style={styles.missingContent}>
                      <Text style={styles.categoryLabel}>{group.category}:</Text>
                      <Text style={styles.fieldLabel}>{group.fields.join(", ")}</Text>
                    </View>
                    {group.route && (
                      <Ionicons name="chevron-forward" size={16} color="#999" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <TouchableOpacity style={styles.primaryBtn} onPress={handleComplete}>
            <Text style={styles.primaryBtnText}>
              {hasProfile ? "Complete" : "Create"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={onClose}>
            <Text style={styles.secondaryBtnText}>Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0E0E55",
    marginTop: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 16,
  },
  missingHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0E0E55",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  missingList: {
    width: "100%",
    maxHeight: 160,
    marginBottom: 16,
  },
  missingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingRight: 4,
  },
  bullet: {
    fontSize: 14,
    color: "#ce9505ff",
    marginRight: 8,
    lineHeight: 20,
  },
  missingContent: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  fieldLabel: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  primaryBtn: {
    width: "100%",
    backgroundColor: "#0E0E55",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  secondaryBtnText: {
    color: "#555",
    fontSize: 15,
    fontWeight: "500",
  },
});
