// app/onboarding/how-did-you-hear.tsx
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { Button, Card, Input, ScrollView, Text, XStack, YStack } from "tamagui";



// Ordered list from Figma + PRD
const SOURCE_ITEMS = [
  {
    key: "Friend",
    label: "From a friend/family",
    bg: "#0E0E55",
    fg: "#0E0E55",
    iconText: "person-icon",
  },
  { key: "X", label: "X", bg: "#000000", fg: "#ffffff", iconText: "x-logo" },
  {
    key: "Facebook",
    label: "Facebook",
    bg: "#1877F2",
    fg: "#ffffff",
    iconText: "facebook-logo",
  },
  {
    key: "Instagram",
    label: "Instagram",
    bg: "#E1306C",
    fg: "#ffffff",
    iconText: "instagram-logo",
  },
  {
    key: "TikTok",
    label: "TikTok",
    bg: "#000000",
    fg: "#ffffff",
    iconText: "tiktok-logo",
  },
  {
    key: "YouTube",
    label: "YouTube",
    bg: "#FF0000",
    fg: "#ffffff",
    iconText: "youtube-logo",
  },
  {
    key: "Referral",
    label: "Referral",
    bg: "#0E0E55",
    fg: "#0E0E55",
    iconText: "referal-logo",
  },
];

export default function HowDidYouHear() {
  const router = useRouter();
  const { setReferralInfo } = useAuth();
  const [selectedSource, setSelectedSource] = useState<string | undefined>(
    undefined
  );
  const [referralCode, setReferralCode] = useState<string>("");

  const completeOnboarding = () => {
    // Store referral information in auth store
    if (selectedSource) {
      if (selectedSource === "Referral" && referralCode) {
        setReferralInfo(selectedSource, referralCode);
      } else {
        setReferralInfo(selectedSource);
      }
    }
    // Navigate to signup page after completing "how did you hear"
    router.replace("/(auth)/signup");
  };

  return (
    <ScrollView flex={1} >
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 1} >
        <YStack gap={"$3"} padding="$3" justifyContent="center"alignItems="center">
          {/* Header */}
          <YStack  marginTop="$6">
            <Text
              fontSize={23} 
              lineHeight={32}
              fontWeight="600"
              textAlign="center"
              marginTop={"$3"}
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
            marginTop="$2"
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
                    style={{
                      marginBottom: index === SOURCE_ITEMS.length - 1 ? 0 : 20,
                    }}
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
                      <XStack alignItems="center" gap={12}>
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
                            <Ionicons name="people" size={24} color="#ffffff"/>
                          ) : item.iconText === "x-logo" ? (
                            <Ionicons
                              name="logo-xbox"
                              size={24}
                              color="#ffffff"
                            />
                          ) : item.iconText === "facebook-logo" ? (
                            <Ionicons
                              name="logo-facebook"
                              size={24}
                              color="#ffffff"
                            />
                          ) : item.iconText === "instagram-logo" ? (
                            <Ionicons
                              name="logo-instagram"
                              size={24}
                              color="#ffffff"
                            />
                          ) : item.iconText === "tiktok-logo" ? (
                            <Ionicons
                              name="logo-tiktok"
                              size={24}
                              color="#ffffff"
                            />
                          ) : item.iconText === "youtube-logo" ? (
                            <Ionicons
                              name="logo-youtube"
                              size={24}
                              color="#ffffff"
                            />
                          ) : item.iconText === "referal" ? null : (
                                    <Ionicons
                              name="person-add"
                              size={24}
                              color="#ffffff"
                            />
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
                <YStack gap="$2" marginTop="$3">
                  <Text fontSize={16} fontWeight="500" color="$gray11">
                    Referral Code
                  </Text>
                  <Input
                    placeholder="Enter your code"
                    value={referralCode}
                    onChangeText={setReferralCode}
                    style={{
                      height: 48, // number (px)
                      paddingHorizontal: 12, // number (px)
                      fontSize: 16, // number (px)
                      borderRadius: 8, // number (px)
                      borderWidth: 1,
                      borderColor: "#CFCFCF", // hex color instead of "$gray8"
                    }}
                  />
                </YStack>
              )}
            </YStack>
          </Card>

          {/* Next + Skip Buttons */}
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
              onPress={() => router.replace("/(auth)/signup") as any}
            >
              <Text color="#9E9E9E" fontWeight="600">
                Skip
              </Text>
            </Button>

        </YStack>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
