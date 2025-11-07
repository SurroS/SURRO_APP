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
          <YStack
            width={10}
            height={10}
            borderRadius={5}
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
    router.push("/(auth)/signup");
  };

  const sources = [
    {
      key: "Friend",
      label: "From a friend/family",
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
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView>
          <YStack flex={1} paddingHorizontal={16}>
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
                <Button
                  height={55}
                  borderRadius={8}
                  backgroundColor="#E6E6E6"
                  onPress={() => router.push("/(auth)/signup")}
                >
                  <Text color="#0E0E55" fontWeight="600">
                    Skip
                  </Text>
                </Button>
              </YStack>
            </Card>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
