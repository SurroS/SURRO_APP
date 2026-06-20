import React from "react";
import { ScrollView, View } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";

const Section = ({ icon, title, children }: any) => (
  <View style={{ marginBottom: 16, borderRadius: 16, overflow: "hidden" }}>
    <Svg height="100%" width="100%" style={{ position: "absolute" }}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.6" />
          <Stop offset="100%" stopColor={colors.primary} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
    </Svg>
    <YStack padding="$4" borderRadius="$4">
      <XStack alignItems="center" gap="$2" marginBottom="$2">
        {icon}
        <Text fontSize="$5" fontWeight="700" color={colors.white}>
          {title}
        </Text>
      </XStack>
      <YStack gap="$2">{children}</YStack>
    </YStack>
  </View>
);

export default function PaymentScreen() {
  const { user } = useAuth();
  const role = user?.role?.trim();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <YStack gap="$4">
          <Text color={colors.text} fontSize="$4" fontWeight="800">
            Payments
          </Text>
          <Text color={colors.text} marginLeft={"$2"} fontSize="$3">
            Manage your funds and unlock features on SurroSantara securely.
          </Text>

          {/* Topup - All Roles */}
          <Section
            title="Topping Up Your Wallet"
            icon={
              <Ionicons name="wallet-outline" size={20} color={colors.white} />
            }
          >
            <Text color={colors.white}>
              Your wallet is your account balance on SurroSantara. Before you can
              unlock profiles or pay for services, you need to add funds.
            </Text>
            <Text color={colors.white} fontWeight="600" marginTop="$2">
              How to top up:
            </Text>
            <Text color={colors.white}>1. Go to your Wallet from the Home screen</Text>
            <Text color={colors.white}>2. Tap the top-up button</Text>
            <Text color={colors.white}>3. Enter the amount you want to add</Text>
            <Text color={colors.white}>4. Complete the payment using your preferred method</Text>
            <Text color={colors.white} marginTop="$2">
              Your balance will update immediately once the payment is confirmed.
            </Text>
          </Section>

          {/* Networking for Parents */}
          {role === "INTENDED_PARENT" && (
            <Section
              title="Networking for Intended Parents"
              icon={
                <Ionicons name="people-outline" size={20} color={colors.white} />
              }
            >
              <Text color={colors.white}>
                The Network tab lets you discover and connect with surrogates.
                When you find a surrogate you're interested in, you can unlock
                their full profile to see contact details, medical info, and more.
              </Text>
              <Text color={colors.white} fontWeight="600" marginTop="$2">
                How it works:
              </Text>
              <Text color={colors.white}>
                1. Browse surrogates in the Network tab
              </Text>
              <Text color={colors.white}>
                2. Tap on a profile to preview basic info
              </Text>
              <Text color={colors.white}>
                3. Pay a small fee to unlock the full profile
              </Text>
              <Text color={colors.white}>
                4. Once unlocked, you can chat or call directly
              </Text>
              <Text color={colors.white} marginTop="$2">
                Unlocked profiles remain accessible so you can revisit them
                anytime. Funds are deducted from your wallet balance.
              </Text>
            </Section>
          )}

          {/* Placeholder for Surrogate & Agent networking */}
          {(role === "SURROGATE" || role === "AGENT") && (
            <Section
              title="Networking"
              icon={
                <Ionicons name="people-outline" size={20} color={colors.white} />
              }
            >
              <Text color={colors.white}>
                Networking features for surrogates and agents are coming soon.
                Check back for updates on how you can connect with intended
                parents and grow your reach on SurroSantara.
              </Text>
            </Section>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
