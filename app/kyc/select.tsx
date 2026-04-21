import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { router } from "expo-router";
import colors from "@/hooks/colors";
import { ScreenHeader } from "@/components/auth";

const idOptions = [
  { label: "National ID card", value: "national_id" },
  { label: "Driver’s license", value: "drivers_license" },
  { label: "Passport", value: "passport" },
];

export default function KYCSelectIDScreen() {
  const [selected, setSelected] = useState<string>("");

  const handleContinue = () => {
    if (!selected) return;
    router.push({
      pathname: "/kyc/uploads",
      params: { idType: selected },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack marginLeft={28}>
        <ScreenHeader title="KYC" onBackPress={() => router.back()} />
      </YStack>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Which type of ID would you like to provide?</Text>

        <YStack gap="$3" marginTop="$4">
          {idOptions.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.option,
                selected === item.value && styles.optionSelected,
              ]}
              onPress={() => setSelected(item.value)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionText}>{item.label}</Text>
              <XStack
                width={22}
                height={22}
                borderWidth={2}
                borderColor={selected === item.value ? colors.primary : "#C6C6C6"}
                borderRadius={20}
                alignItems="center"
                justifyContent="center"
              >
                {selected === item.value && (
                  <XStack
                    width={10}
                    height={10}
                    borderRadius={10}
                    backgroundColor={colors.primary}
                  />
                )}
              </XStack>
            </TouchableOpacity>
          ))}
        </YStack>

        <Button
          style={styles.button}
          disabled={!selected}
          backgroundColor={selected ? colors.primary : "#E6E6E6"}
          onPress={handleContinue}
        >
          <Text
            style={[styles.buttonText, { color: selected ? "#fff" : "#999" }]}
          >
            Continue
          </Text>
        </Button>

        <XStack marginTop={18} alignItems="center" justifyContent="center" gap="$2">
          <Text style={styles.footerText}>
            We prioritise your safety — we encrypt and securely store your information, using it only for identity verification.
          </Text>
        </XStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 18, paddingTop: 28 },
  scroll: { padding: 20 },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F8FA",
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: "#EEF0FF",
  },
  optionText: { fontSize: 15, color: "#0E0E55", fontWeight: "500" },
  button: {
    marginTop: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    flex: 1,
  },
});
