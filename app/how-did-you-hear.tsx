// app/onboarding/how-did-you-hear.tsx
import React, { useState } from "react";
import { Pressable } from "react-native";
import { YStack, Text, Button, XStack, Input, Card } from "tamagui";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Ordered list from Figma + PRD
const SOURCE_ITEMS = [
  { key: "Friend", label: "From a friend/family", bg: "#F2F2F2", fg: "#0E0E55", iconText: "person-icon" },
  { key: "X", label: "X", bg: "#000000", fg: "#ffffff", iconText: "x-logo" },
  { key: "Facebook", label: "Facebook", bg: "#1877F2", fg: "#ffffff", iconText: "facebook-logo" },
  { key: "Instagram", label: "Instagram", bg: "#E1306C", fg: "#ffffff", iconText: "instagram-logo" },
  { key: "TikTok", label: "TikTok", bg: "#000000", fg: "#ffffff", iconText: "tiktok-logo" },
  { key: "YouTube", label: "YouTube", bg: "#FF0000", fg: "#ffffff", iconText: "youtube-logo" },
  { key: "Referral", label: "Referral", bg: "#EAEAF6", fg: "#0E0E55", iconText: "R" },
];

export default function HowDidYouHear() {
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState<string | undefined>(undefined);
  const [referralCode, setReferralCode] = useState<string>("");

  const completeOnboarding = () => {
    if (selectedSource === "Referral" && referralCode) {
      console.log("Referral code:", referralCode);
    }
    router.replace("/(tabs)/home");
  };

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4">
      {/* Header */}
      <YStack alignItems="center" marginBottom="$4" marginTop="$6">
        <Text
          fontSize={23}
          lineHeight={32}
          fontWeight="600"
          textAlign="center"
          color="$text"
        >
          How did you hear about us?
        </Text>
      </YStack>

      {/* Options List */}
      <Card
        width="100%"
        maxWidth={500}
        alignSelf="center"
        padding="$3"
        borderRadius={12}
        backgroundColor="$background"
        marginVertical="$2"
        marginTop="$4"
      >
        <YStack width="100%">
          {SOURCE_ITEMS.map((item, index) => {
            const isSelected = selectedSource === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setSelectedSource(item.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                style={{ marginBottom: index === SOURCE_ITEMS.length - 1 ? 0 : 20 }}
              >
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  height={50}
                  paddingVertical={14}
                  paddingHorizontal={14}
                  borderRadius={8}
                  borderWidth={1}
                  borderColor={isSelected ? "$primary" : "#E6E6E6"}
                  backgroundColor={isSelected ? "#F4F7FF" : "$background"}
                >
                  <XStack alignItems="center" space={12}>
                    {/* Left icon */}
                    <YStack
                      width={40}
                      height={40}
                      borderRadius={8}
                      justifyContent="center"
                      alignItems="center"
                      backgroundColor={item.bg}
                    >
                      {item.iconText === "person-icon" ? (
                        <Ionicons name="person" size={24} color="#0E0E55" />
                      ) : item.iconText === "x-logo" ? (
                        <Ionicons name="logo-xbox" size={24} color="#ffffff" />
                      ) : item.iconText === "facebook-logo" ? (
                        <Ionicons name="logo-facebook" size={24} color="#ffffff" />
                      ) : item.iconText === "instagram-logo" ? (
                        <Ionicons name="logo-instagram" size={24} color="#ffffff" />
                      ) : item.iconText === "tiktok-logo" ? (
                        <Ionicons name="logo-tiktok" size={24} color="#ffffff" />
                      ) : item.iconText === "youtube-logo" ? (
                        <Ionicons name="logo-youtube" size={24} color="#ffffff" />
                      ) : item.iconText === "no-icon" ? null : (
                        <Text color={item.fg} fontWeight="700">
                          {item.iconText}
                        </Text>
                      )}
                    </YStack>

                    {/* Label */}
                    <Text fontSize={16} color="#212121">
                      {item.label}
                    </Text>
                  </XStack>

                  {/* Radio circle */}
                  <YStack
                    width={20}
                    height={20}
                    borderRadius={10}
                    borderWidth={2}
                    borderColor={isSelected ? "$primary" : "#CFCFCF"}
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={isSelected ? "$primary" : "$background"}
                  >
                    {isSelected && (
                      <YStack
                        width={10}
                        height={10}
                        borderRadius={5}
                        backgroundColor="$background"
                      />
                    )}
                  </YStack>
                </XStack>
              </Pressable>
            );
          })}

          {/* === Conditional Referral Input === */}
          {selectedSource === "Referral" && (
            <YStack
  space="$2"
  marginTop="$3"
>

              <Text fontSize={16} fontWeight="500" color="$gray11">
                Referral Code
              </Text>
              <Input
  placeholder="Enter your code"
  value={referralCode}
  onChangeText={setReferralCode}
  style={{
    height: 48,             // number (px)
    paddingHorizontal: 12,  // number (px)
    fontSize: 16,           // number (px)
    borderRadius: 8,        // number (px)
    borderWidth: 1,
    borderColor: "#CFCFCF", // hex color instead of "$gray8"
  }}
/>

            </YStack>
          )}
        </YStack>
      </Card>

      {/* Next + Skip Buttons */}
      <YStack
        space="$3"
        width="100%"
        maxWidth={355}
        alignSelf="center"
        marginTop="$4"
      >
        <Button
          width="100%"
          height={55}
          borderRadius={8}
          backgroundColor="$primary"
          onPress={completeOnboarding}
          disabled={!selectedSource}
          opacity={selectedSource ? 1 : 0.6}
        >
          <Text color="$background" fontWeight="600">
            Next
          </Text>
        </Button>

        <Button
          width="100%"
          height={55}
          borderRadius={8}
          backgroundColor="$secondary"
          onPress={() => router.replace("/(tabs)/home") as any}
        >
          <Text color="$color12" fontWeight="600">
            Skip
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
}
