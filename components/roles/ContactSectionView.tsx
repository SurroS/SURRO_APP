import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
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
}

interface Props {
  data: ContactData;
  containerStyle?: object;
}

export default function ContactSection({ data, containerStyle }: Props) {
  const renderSocialLink = (label: string, url?: string) => {
    if (!url) return null;
    return (
      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <Text style={styles.socialText}>
          {label}: {url}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleCopyContact = async () => {
    const phones = [data.phone1, data.phone2, data.emergency]
      .filter(Boolean)
      .join(", ");
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
    const numbers = [data.phone1, data.phone2, data.emergency].filter(Boolean);
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

    // Multiple numbers → use Alert for user interaction
    Alert.alert(
      "Select Number to Call",
      "Choose which number to dial",
      numbers.map((num) => ({
        text: num,
        onPress: () => Linking.openURL(`tel:${num}`),
      }))
    );
  };

  return (
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

      {data.social && (
        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Social Links</Text>
          {renderSocialLink("Facebook", data.social.Facebook)}
          {renderSocialLink("X / Twitter", data.social.X)}
          {renderSocialLink("Instagram", data.social.Instagram)}
          {renderSocialLink("TikTok", data.social.TikTok)}
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCopyContact}
        >
          <Text style={styles.buttonText}>Copy Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleQuickDial}>
          <Ionicons name="call" size={16} color={"white"} />
          <Text style={styles.buttonText}>Call Now</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    backgroundColor: "#0A2A66",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft:15
  },
});
