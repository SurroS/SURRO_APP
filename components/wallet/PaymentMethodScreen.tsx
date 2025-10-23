// import React from "react";
// import { StyleSheet, TouchableOpacity, Image } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { YStack, XStack, Text, Separator } from "tamagui";
// import { Ionicons } from "@expo/vector-icons";
// import colors from "@/hooks/colors";
// import { useNavigation } from "@react-navigation/native";

// interface PaymentOption {
//   id: string;
//   name: string;
//   description: string;
//   icon: any;
//   navigateTo: string;
// }

// const paymentOptions: PaymentOption[] = [
//   {
//     id: "stripe",
//     name: "Stripe",
//     description: "Pay with international cards (USD, EUR, GBP)",
//     icon: require("@/assets/icons/stripe.png"),
//     navigateTo: "StripePaymentScreen",
//   },
//   {
//     id: "paystack",
//     name: "Paystack",
//     description: "Pay using Nigerian cards, bank, or USSD",
//     icon: require("@/assets/icons/paystack.png"),
//     navigateTo: "PaystackPaymentScreen",
//   },
//   {
//     id: "flutterwave",
//     name: "Flutterwave",
//     description: "Accept multi-currency payments easily",
//     icon: require("@/assets/icons/flutterwave.png"),
//     navigateTo: "FlutterwavePaymentScreen",
//   },
//   {
//     id: "interswitch",
//     name: "Interswitch",
//     description: "Pay with cards or Quickteller wallet",
//     icon: require("@/assets/icons/interswitch.png"),
//     navigateTo: "InterswitchPaymentScreen",
//   },
// ];

// const PaymentMethodScreen = () => {
//   const navigation = useNavigation<any>();

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
//       {/* Header */}
//       <XStack
//         alignItems="center"
//         paddingHorizontal={20}
//         paddingTop={10}
//         marginBottom={20}
//       >
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons
//             name="chevron-back"
//             size={24}
//             color={colors.HEADER_ICON_GRAY}
//           />
//         </TouchableOpacity>
//         <Text fontSize={18} fontWeight="600" marginLeft={15}>
//           Select Payment Method
//         </Text>
//       </XStack>

//       {/* Payment Options */}
//       <YStack space="$4" paddingHorizontal={20}>
//         {paymentOptions.map((option) => (
//           <TouchableOpacity
//             key={option.id}
//             style={styles.optionCard}
//             activeOpacity={0.7}
//             onPress={() => navigation.navigate(option.navigateTo)}
//           >
//             <XStack alignItems="center" space="$3">
//               <Image source={option.icon} style={styles.icon} />
//               <YStack>
//                 <Text fontSize={16} fontWeight="600" color={colors.primary}>
//                   {option.name}
//                 </Text>
//                 <Text fontSize={13} color={colors.secondaryGray}>
//                   {option.description}
//                 </Text>
//               </YStack>
//             </XStack>
//             <Ionicons
//               name="chevron-forward"
//               size={20}
//               color={colors.HEADER_ICON_GRAY}
//             />
//           </TouchableOpacity>
//         ))}
//       </YStack>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   optionCard: {
//     backgroundColor: "#F9F9FF",
//     borderRadius: 12,
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 1,
//   },
//   icon: {
//     width: 40,
//     height: 40,
//     resizeMode: "contain",
//   },
// });

// export default PaymentMethodScreen;
