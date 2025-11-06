import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCircle } from "@tamagui/lucide-icons";
import colors from "@/hooks/colors";

export default function KYCUploadScreen() {
  const { idType } = useLocalSearchParams<{ idType: string }>();

  const handleTakePicture = () => {
    // TODO: integrate with camera or document picker
    console.log(`Taking picture for ID type: ${idType}`);
    router.push("/settings/kyc/preview"); // or handle verification
  };

  const readableId =
    idType === "national_id"
      ? "National ID card"
      : idType === "drivers_license"
      ? "Driver’s License"
      : "Passport";

  return (
    <SafeAreaView style={styles.container}>
      <YStack paddingHorizontal={20} paddingTop={20} flex={1}>
        {/* Header */}
        <Text style={styles.title}>Take a picture of your ID</Text>
        <Text style={styles.subtitle}>
          Ensure your {readableId} is clear and all details are visible.
        </Text>

        {/* Illustration */}
        <YStack
          backgroundColor="#F8F8FA"
          borderRadius={16}
          alignItems="center"
          justifyContent="center"
          marginTop={30}
          paddingVertical={40}
        >
          <Image
            source={require("@/assets/images/id_sample.png")}
            style={{ width: 180, height: 120, resizeMode: "contain" }}
          />
        </YStack>

        {/* Checklist */}
        <YStack gap="$3" marginTop={30}>
          <ChecklistItem text="Your ID has not expired" />
          <ChecklistItem text="It is clear and easy to read" />
          <ChecklistItem text="All your details are in frame" />
        </YStack>

        {/* Take picture button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleTakePicture}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Take picture</Text>
        </TouchableOpacity>
      </YStack>
    </SafeAreaView>
  );
}

const ChecklistItem = ({ text }: { text: string }) => (
  <XStack alignItems="center" gap="$3">
    <CheckCircle color="#09d814ff" size={20} />
    <Text style={styles.checkText}>{text}</Text>
  </XStack>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },
  button: {
    marginTop: "auto",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  checkText: {
    fontSize: 14,
    color: "#333",
  },
});
