import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import { TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, Input, Text, XStack, YStack, ScrollView } from "tamagui";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

const SourceOption = ({ item, isSelected, onPress }: any) => (
  <Pressable
    onPress={onPress}
    style={{ marginBottom: 8 }}
    accessibilityRole="radio"
    accessibilityState={{ selected: isSelected }}
  >
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingVertical={10}
      paddingHorizontal={10}
      borderRadius={8}
      borderWidth={1}
      borderColor={isSelected ? "#0E0E55" : "#E6E6E6"}
      backgroundColor={isSelected ? "#F4F7FF" : "white"}
    >
      <XStack alignItems="center" gap={8}>
        <YStack
          width={25}
          height={25}
          borderRadius={6}
          justifyContent="center"
          alignItems="center"
          backgroundColor={item.bg}
        >
          {item.icon ? (
            <Ionicons name={item.icon as any} size={14} color={item.fg} />
          ) : (
            <Text color={item.fg} fontWeight="700" fontSize={12}>
              R
            </Text>
          )}
        </YStack>
        <Text fontSize={14} color="#212121">
          {item.label}
        </Text>
      </XStack>

      <YStack
        width={18}
        height={18}
        borderRadius={9}
        borderWidth={2}
        borderColor={isSelected ? "#0E0E55" : "#CFCFCF"}
        justifyContent="center"
        alignItems="center"
        backgroundColor={isSelected ? "#0E0E55" : "white"}
      >
        {isSelected && (
          <YStack
            width={8}
            height={8}
            borderRadius={4}
            backgroundColor="white"
          />
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
    router.push("/onboarding/role-selection");
  };

  const sources = [
    {
      key: "Friend",
      label: "Friend/family",
      bg: "#0E0E55",
      fg: "#F2F2F2",
      icon: "person",
    },
    {
      key: "X",
      label: "X",
      bg: "#000000",
      fg: "#ffffff",
      icon: "logo-xbox",
    },
    {
      key: "Facebook",
      label: "Facebook",
      bg: "#1877F2",
      fg: "#ffffff",
      icon: "logo-facebook",
    },
    {
      key: "Instagram",
      label: "Instagram",
      bg: "#E1306C",
      fg: "#ffffff",
      icon: "logo-instagram",
    },
    {
      key: "TikTok",
      label: "TikTok",
      bg: "#000000",
      fg: "#ffffff",
      icon: "logo-tiktok",
    },
    {
      key: "YouTube",
      label: "YouTube",
      bg: "#FF0000",
      fg: "#ffffff",
      icon: "logo-youtube",
    },
    {
      key: "Referral",
      label: "Referral",
      bg: "#0E0E55",
      fg: "#EAEAF6",
      icon: null,
    },
  ];

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9F9FB" }}>
        <ScrollView>
          <YStack flex={1} padding={16}>
            <Text
              fontSize={23}
              lineHeight={32}
              fontWeight="600"
              textAlign="center"
              marginBottom={16}
              color="#0E0E55"
            >
              How did you hear about us?
            </Text>

            <Card
              width="100%"
              maxWidth={500}
              alignSelf="center"
              backgroundColor="#F9F9FB"
              padding={12}
              borderRadius={12}
            >
              {sources.map((item) => (
                <YStack key={item.key}>
                  <SourceOption
                    item={item}
                    isSelected={selectedSource === item.key}
                    onPress={() => setSelectedSource(item.key)}
                  />

                  {selectedSource === "Referral" && item.key === "Referral" && (
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: "#0E0E55",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        height: 50,
                        marginTop: 8,
                      }}
                      placeholder="Enter referral code"
                      value={referralCode}
                      onChangeText={setReferralCode}
                    />
                  )}
                </YStack>
              ))}

              <YStack
                gap={12}
                width="100%"
                maxWidth={355}
                alignSelf="center"
                marginTop={16}
              >
                <Button
                  height={55}
                  borderRadius={8}
                  backgroundColor="#0E0E55"
                  onPress={completeOnboarding}
                  disabled={!selectedSource}
                  opacity={selectedSource ? 1 : 0.6}
                >
                  <Text color="white" fontWeight="600">
                    Next
                  </Text>
                </Button>
                <Pressable
                  onPress={async () => {
                    if (selectedSource) {
                      if (selectedSource === "Referral" && referralCode) {
                        setReferralInfo(selectedSource, referralCode);
                      } else {
                        setReferralInfo(selectedSource);
                      }
                    }
                    router.push("/onboarding/role-selection");
                  }}
                >
                  <Text style={{ color: "#0E0E55", fontWeight: "600", textAlign: "center", paddingVertical: 16, textDecorationLine: "underline" }}>
                    Skip
                  </Text>
                </Pressable>
              </YStack>
            </Card>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
