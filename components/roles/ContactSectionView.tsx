import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons, Entypo } from "@expo/vector-icons";
import colors from "@/hooks/colors";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

interface SocialLink {
  Facebook?: string;
  X?: string;
  Instagram?: string;
  TikTok?: string;
}

interface ContactData {
  country?: string;
  state?: string;
  street?: string;
  zip?: string;
  phone1?: string;
  phone2?: string;
  emergency?: string;
  lGA?: string;
  relationship?: string;
  social?: SocialLink;
  email?: string; // public contact email
}

interface Props {
  data: ContactData;
  containerStyle?: object;
  isUnlocked?: boolean;
  onChat?: () => void;
  hideActions?: boolean;
}

export default function ContactSection({ data, containerStyle, isUnlocked, onChat, hideActions }: Props) {
  const [showCallModal, setShowCallModal] = useState(false);

  const numbers = [data.phone1, data.phone2, data.emergency].filter(Boolean);

  const renderSocialLink = (label: string, url?: string) => {
    if (!url) return null;
    const normalizedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
    return (
      <TouchableOpacity onPress={async () => {
        try {
          const supported = await Linking.canOpenURL(normalizedUrl);
          if (supported) {
            await Linking.openURL(normalizedUrl);
          }
        } catch {}
      }}>
        <Text style={styles.socialText}>
          {label}: {url}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmail = (email?: string) => {
    if (!email) return null;
    return (
      <TouchableOpacity onPress={async () => {
        try {
          await Linking.openURL(`mailto:${email}`);
        } catch {}
      }}>
        <Text style={[styles.value, { textDecorationLine: "underline", color: "#0A2A66" }]}>{email}</Text>
      </TouchableOpacity>
    );
  };

  const handleCopyContact = async () => {
    const phones = numbers.join(", ");
    if (!phones) {
      Toast.show({
        text1: "No contact info",
        type: "customWarning" as ToastType,
      });
      return;
    }
    await Clipboard.setStringAsync(phones);
    Toast.show({
      text1: "Contact copied",
      type: "customSuccess" as ToastType,
    });
  };

  const handleQuickDial = () => {
    if (numbers.length === 0) {
      Toast.show({
        text1: "No phone number",
        type: "customWarning" as ToastType,
      });
      return;
    }

    if (numbers.length === 1) {
      Linking.openURL(`tel:${numbers[0]}`);
      return;
    }

    setShowCallModal(true);
  };

  return (
    <>
      <Modal
        visible={showCallModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCallModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowCallModal(false)}>
          <Pressable style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Number to Call</Text>
            {numbers.map((num, idx) => (
              <TouchableOpacity
                key={`call-${idx}`}
                style={styles.modalOption}
                onPress={() => {
                  setShowCallModal(false);
                  Linking.openURL(`tel:${num}`);
                }}
              >
                <Ionicons name="call-outline" size={18} color="#0A2A66" />
                <Text style={styles.modalOptionText}>{num}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowCallModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
      <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>Contact Information</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Country:</Text>
        <Text style={styles.value}>{data.country || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>State:</Text>
        <Text style={styles.value}>{data.state || "-"}</Text>
      </View>

      {data.lGA && (
        <View style={styles.row}>
          <Text style={styles.label}>LGA:</Text>
          <Text style={styles.value}>{data.lGA}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.label}>Street:</Text>
        <Text style={styles.value}>{data.street || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>ZIP/Postal Code:</Text>
        <Text style={styles.value}>{data.zip || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Phone 1:</Text>
        <Text style={styles.value}>{data.phone1 || "-"}</Text>
      </View>

      {data.phone2 && (
        <View style={styles.row}>
          <Text style={styles.label}>Phone 2:</Text>
          <Text style={styles.value}>{data.phone2}</Text>
        </View>
      )}

      {data.emergency && (
        <View style={styles.row}>
          <Text style={styles.label}>Emergency Contact:</Text>
          <Text style={styles.value}>
            {data.emergency} {data.relationship ? `(${data.relationship})` : ""}
          </Text>
        </View>
      )}

      {data.email && (
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          {renderEmail(data.email)}
        </View>
      )}

      {data.social && (
        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Social Links</Text>
          {renderSocialLink("Facebook", data.social.Facebook)}
          {renderSocialLink("X / Twitter", data.social.X)}
          {renderSocialLink("Instagram", data.social.Instagram)}
          {renderSocialLink("TikTok", data.social.TikTok)}
        </View>
      )}

      {!hideActions && (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCopyContact}
          >
            <Ionicons name="copy-outline" size={16} color={colors.primary} />
            <Text style={styles.buttonText}>Copy</Text>
          </TouchableOpacity>

          {onChat && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onChat}
            >
              <Entypo name="chat" size={16} color={colors.primary} />
              <Text style={styles.buttonText}>Chat</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={handleQuickDial}>
            <Ionicons name="call" size={16} color={colors.primary} />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222222",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: "#444444",
  },
  value: {
    color: "#555555",
    flexShrink: 1,
    textAlign: "right",
  },
  socialContainer: {
    marginTop: 12,
  },
  socialTitle: {
    fontWeight: "700",
    color: "#222222",
    marginBottom: 6,
  },
  socialText: {
    color: "#0A2A66",
    marginBottom: 4,
    textDecorationLine: "underline",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionText: {
    fontSize: 15,
    color: "#0A2A66",
    fontWeight: "500",
  },
  modalCancel: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
});
