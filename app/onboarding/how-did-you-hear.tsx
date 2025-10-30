import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import { Platform, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Input, Text, XStack, YStack } from "tamagui";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SourceOption = ({ item, isSelected, onPress }: any) => (
  <Pressable
    onPress={onPress}
    style={{ marginBottom: 16 }}
    accessibilityRole="radio"
    accessibilityState={{ selected: isSelected }}
  >
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingVertical={14}
      paddingHorizontal={14}
      borderRadius={8}
      borderWidth={1}
      borderColor={isSelected ? "#0E0E55" : "#E6E6E6"}
      backgroundColor={isSelected ? "#F4F7FF" : "white"}
    >
      <XStack alignItems="center" gap={12}>
        <YStack
          width={40}
          height={40}
          borderRadius={8}
          justifyContent="center"
          alignItems="center"
          backgroundColor={item.bg}
        >
          {item.icon ? (
            <Ionicons name={item.icon as any} size={24} color={item.fg} />
          ) : (
            <Text color={item.fg} fontWeight="700">
              R
            </Text>
          )}
        </YStack>
        <Text fontSize={16} color="#212121">
          {item.label}
        </Text>
      </XStack>

      <YStack
        width={20}
        height={20}
        borderRadius={10}
        borderWidth={2}
        borderColor={isSelected ? "#0E0E55" : "#CFCFCF"}
        justifyContent="center"
        alignItems="center"
        backgroundColor={isSelected ? "#0E0E55" : "white"}
      >
        {isSelected && (
          <YStack width={10} height={10} borderRadius={5} backgroundColor="white" />
        )}
      </YStack>
    </XStack>
  </Pressable>
);

export default function HowDidYouHear() {
  const router = useRouter();
  const { setReferralInfo } = useAuth();
  const [selectedSource, setSelectedSource] = useState<string>();
  const [referralCode, setReferralCode] = useState<string>("");

  const referralInputRef = useRef<TextInput>(null);

  const completeOnboarding = () => {
    if (selectedSource) {
      if (selectedSource === "Referral" && referralCode) {
        setReferralInfo(selectedSource, referralCode);
      } else {
        setReferralInfo(selectedSource);
      }
    }
    router.push("/(auth)/signup");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "$white" }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, paddingHorizontal: 16 }}
        enableOnAndroid
        extraScrollHeight={Platform.OS === "ios" ? 80 : 60}
        keyboardShouldPersistTaps="handled"
      >
        <YStack flex={1}>
          <Text
            fontSize={23}
            lineHeight={32}
            fontWeight="600"
            textAlign="center"
            marginBottom="$4"
            color="$text"
          >
            How did you hear about us?
          </Text>

          <Card width="100%" maxWidth={500} alignSelf="center" padding="$3" borderRadius={12}>
            {[  /* Source options */  
              { key: "Friend", label: "From a friend/family", bg: "#0E0E55", fg: "#F2F2F2", icon: "person" },
              { key: "X", label: "X", bg: "#000000", fg: "#ffffff", icon: "logo-xbox" },
              { key: "Facebook", label: "Facebook", bg: "#1877F2", fg: "#ffffff", icon: "logo-facebook" },
              { key: "Instagram", label: "Instagram", bg: "#E1306C", fg: "#ffffff", icon: "logo-instagram" },
              { key: "TikTok", label: "TikTok", bg: "#000000", fg: "#ffffff", icon: "logo-tiktok" },
              { key: "YouTube", label: "YouTube", bg: "#FF0000", fg: "#ffffff", icon: "logo-youtube" },
              { key: "Referral", label: "Referral", bg: "#0E0E55", fg: "#EAEAF6", icon: null },
            ].map((item) => (
              <SourceOption
                key={item.key}
                item={item}
                isSelected={selectedSource === item.key}
                onPress={() => setSelectedSource(item.key)}
              />
            ))}

            <YStack gap="$3" width="100%" maxWidth={355} alignSelf="center" marginTop="$4">
              <Button
                height={55}
                borderRadius={8}
                backgroundColor="$primary"
                onPress={completeOnboarding}
                disabled={!selectedSource}
                opacity={selectedSource ? 1 : 0.6}
              >
                <Text color="white" fontWeight="600">
                  Next
                </Text>
              </Button>
              <Button
                height={55}
                borderRadius={8}
                backgroundColor="$secondary"
                onPress={() => router.push("/(auth)/signup")}
              >
                <Text color="$color12" fontWeight="600">
                  Skip
                </Text>
              </Button>
            </YStack>
          </Card>
        </YStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
