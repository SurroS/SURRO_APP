// app/onboarding/how-did-you-hear.tsx
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList, 
  Platform,
  Pressable,
  ScrollView
} from "react-native";
import { Button, Card, Input, Text, XStack, YStack } from "tamagui";
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller'
// Ordered list from Figma + PRD

const SOURCE_ITEMS = [
  { key: "Friend", label: "From a friend/family", bg: "#0E0E55", fg: "#F2F2F2", icon: "person" },
  { key: "X", label: "X", bg: "#000000", fg: "#ffffff", icon: "logo-xbox" },
  { key: "Facebook", label: "Facebook", bg: "#1877F2", fg: "#ffffff", icon: "logo-facebook" },
  { key: "Instagram", label: "Instagram", bg: "#E1306C", fg: "#ffffff", icon: "logo-instagram" },
  { key: "TikTok", label: "TikTok", bg: "#000000", fg: "#ffffff", icon: "logo-tiktok" },
  { key: "YouTube", label: "YouTube", bg: "#FF0000", fg: "#ffffff", icon: "logo-youtube" },
  { key: "Referral", label: "Referral", bg: "#0E0E55", fg: "#EAEAF6", icon: null  },
];

type SourceOptionProps = {
  item: typeof SOURCE_ITEMS[number];
  isSelected: boolean;
  onPress: () => void;
};

const SourceOption = ({ item, isSelected, onPress }: SourceOptionProps) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="radio"
    accessibilityState={{ selected: isSelected }}
    style={{ marginBottom: 16 }}
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

      {/* Radio circle */}
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

  const completeOnboarding = () => {
    if (selectedSource) {
      if (selectedSource === "Referral" && referralCode) {
        setReferralInfo(selectedSource, referralCode);
      } else {
        setReferralInfo(selectedSource);
      }
    }
    router.replace("/(auth)/signup");
  };

  return (
    <ScrollView>
    <KeyboardAwareScrollView
    style={{flex:1, marginBottom:62}}
    bottomOffset={60}
    >
      <YStack flex={1} padding="$4" backgroundColor="$background">
        <Text
          fontSize={23}
          lineHeight={32}
          fontWeight="600"
          textAlign="center"
          marginBottom="$4"
        >
          How did you hear about us?
        </Text>

        <Card width="100%" maxWidth={500} alignSelf="center" padding="$3" borderRadius={12}>
          <FlatList
            data={SOURCE_ITEMS}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <SourceOption
                item={item}
                isSelected={selectedSource === item.key}
                onPress={() => setSelectedSource(item.key)}
              />
            )}
          />

          {selectedSource === "Referral" && (
            <YStack gap="$2" marginTop="$3">
              <Text fontSize={16} fontWeight="500" color="$gray11">
                Referral Code
              </Text>
              <Input
                placeholder="Enter your code"
                value={referralCode}
                onChangeText={setReferralCode}
                height={48}
                paddingHorizontal={12}
                fontSize={16}
                borderRadius={8}
                borderWidth={1}
                borderColor="#CFCFCF"
              />
            </YStack>
          )}
        </Card>

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
            onPress={() => router.replace("/(auth)/signup")}
          >
            <Text color="$color12" fontWeight="600">
              Skip
            </Text>
          </Button>
        </YStack>
      </YStack>
    </KeyboardAwareScrollView>
    </ScrollView>
  );
}
