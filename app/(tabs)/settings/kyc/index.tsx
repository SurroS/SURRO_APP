import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text, Card } from "tamagui";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { FileText, Camera } from "@tamagui/lucide-icons";
import colors from "@/hooks/colors";
import { ScreenHeader } from "@/components/auth";

export default function KYCStartScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="KYC" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Verify your ID document</Text>
        <Text style={styles.subtitle}>
          This information helps us confirm your identity and comply with legal
          requirements.
        </Text>

        <YStack gap="$3" marginTop="$4">
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push("/settings/kyc/select")}
          >
            <XStack alignItems="center" gap="$3">
              <FileText color={colors.primary} size={20} />
              <YStack>
                <Text style={styles.optionTitle}>A photo of your ID</Text>
                <Text style={styles.optionSub}>
                  We accept National ID card, Driver’s license, {"\n"}or International
                  passport.
                </Text>
              </YStack>
            </XStack>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => router.push("/settings/kyc/face-scan-rules")}
          >
            <XStack alignItems="center" gap="$3" >
              <Camera color={colors.primary} size={20} />
              <YStack>
                <Text style={styles.optionTitle}>
                  A quick scan of your face
                </Text>
                <Text style={styles.optionSub}>
                  This is to confirm that you are the one on{"\n"}your ID card.
                </Text>
              </YStack>
            </XStack>
          </TouchableOpacity>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop:20, justifyContent:"center"},
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 6,
    
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: "#F8F8FA",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  optionTitle: { fontWeight: "600", color: "#0E0E55", fontSize: 15 },
  optionSub: { color: "#666", fontSize: 13, marginTop: 4 },
});
