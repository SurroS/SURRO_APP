import React from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import colors from "@/hooks/colors";

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  route: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Pay with international cards (USD, GDP, EUR) ",
    icon: require("@/assets/images/payments/stripe.png"),
    route: "/(tabs)/home/walletFlow/stripePayment",
  },
  {
    id: "paystack",
    name: "Paystack",
    description: "Pay using Nigerian cards, bank, or USSD",
    icon: require("@/assets/images/payments/paystack.png"),
    route: "/(tabs)/home/walletFlow/paystackPayment",
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    description: "Accept multi-currency payments easily",
    icon: require("@/assets/images/payments/flutterwave.png"),
    route: "/(tabs)/home/walletFlow/flutterPayment",
  },
  {
    id: "interswitch",
    name: "Interswitch",
    description: "Pay with cards or Quickteller wallet",
    icon: require("@/assets/images/payments/interswitch.png"),
    route: "/(tabs)/home/walletFlow/interswitchPayment",
  }, 
];

export default function PaymentMethodScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      {/* Header */}
      <XStack
        alignItems="center"
        paddingHorizontal={20}
        paddingTop={10}
        marginBottom={20}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.HEADER_ICON_GRAY} 
          />
        </TouchableOpacity>
        <Text fontSize={18} fontWeight="800" marginLeft={30} color={colors.primary}>
          Select Payment Method
        </Text>
      </XStack>

      {/* Payment Options */}
      <YStack gap="$4" paddingHorizontal={20}>
        {paymentOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionCard}
            activeOpacity={0.7}
            onPress={() => router.push(option.route)}
          >
            <XStack alignItems="center" gap="$3">
              <Image source={option.icon} style={styles.icon} />
              <YStack width={"80%"}>
                <Text fontSize={16} fontWeight="600" color={colors.primary}>
                  {option.name}
                </Text>
                <Text fontSize={13} color={colors.secondaryGray} textWrap="wrap">
                  {option.description}
                </Text>
              </YStack>
            </XStack>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.HEADER_ICON_GRAY}
              justifySelf={"flex-end"}
              
            />
          </TouchableOpacity>
        ))}
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  optionCard: {
    backgroundColor: "#f9f9ffff",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 10,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
