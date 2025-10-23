// // import { Ionicons } from '@expo/vector-icons';
// // import { Stack, useNavigation } from 'expo-router';
// // import { useEffect, useRef, useState } from 'react';
// // import {
// //     Image,
// //     StyleSheet,
// //     TextInput,
// //     TouchableOpacity,
// //     View,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { ScrollView, Text, XStack, YStack } from 'tamagui';
// // import RecentActivitiesScreen from '@/components/wallet/RecentActivity'
// // import PaymentStatusScreen from "@/components/wallet/PaymentStatus"

// // // --- IMAGE ASSETS ---
// // import americanExpressLogo from '@/assets/images/americanexpress.png';
// // import mastercardLogo from '@/assets/images/mastercard.jpeg';
// // import visaLogo from '@/assets/images/visa.png';
// // import TransactionItem from '@/components/wallet/TransactonItem'
 
 
// // const SCREENS = {
// //     WALLET_SUMMARY: 'WalletSummary', 
// //     ADD_PAYMENT: 'AddPayment',
// //     ENTER_CARD_DETAILS: 'EnterCardDetails',
// //     PAYMENT_STATUS: 'PaymentStatus',
// //     RECENT_ACTIVITIES: 'RecentActivities', 
// // };

// // const COLORS = {
// //     ACTION_NAVY_BLUE: '#0E0E55',
// //     HEADER_ICON_GRAY: '#666666',
// //     primaryDark: '#0E0E55',
// //     balanceText: '#222222',
// //     headerText: '#000000',
// //     secondaryGray: '#444444',
// //     lightGrayBg: '#F9F9F9',
// //     border: '#E0E0E0',
// //     white: '#FFFFFF',
// //     inputBorder: '#E0E0E0',
// //     placeholderText: '#999999',
// //     buttonBlue: '#0E0E55',
// //     SUCCESS_GREEN: '#1F8454',
// //     DEBIT_RED: '#D52D3F',
// //     CREDIT_GREEN: '#1F8454',
// // };

  


// // // =======================================================
// // // === ENTER CARD DETAILS SCREEN ===
// // // =======================================================
// // const EnterCardDetailsScreenContent = ({ onBack, onMakePayment }) => {
// //     const [cardNumber, setCardNumber] = useState('');
// //     const [expiryDate, setExpiryDate] = useState('');
// //     const [cvc, setCvc] = useState('');
// //     const [cardHolder, setCardHolder] = useState('');

// //     const handleMakePayment = () => {
// //         if (cardNumber && expiryDate && cvc && cardHolder) {
// //             console.log('Payment Details:', { cardNumber, expiryDate, cvc, cardHolder });
// //             onMakePayment();
// //         } else {
// //             console.log('Please fill all required card details.');
// //         }
// //     };

// //     return (
// //         <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
// //             <XStack
// //                 width="100%"
// //                 paddingHorizontal={20}
// //                 marginBottom={30}
// //                 alignItems="center"
// //                 justifyContent="space-between"
// //             >
// //                 <XStack alignItems="center">
// //                     <TouchableOpacity onPress={onBack} style={{ marginRight: 20 }}>
// //                         <Ionicons
// //                             name="chevron-back"
// //                             size={24}
// //                             color={COLORS.HEADER_ICON_GRAY}
// //                         />
// //                     </TouchableOpacity>
// //                     <Text fontSize={18} fontWeight="600" color={COLORS.headerText}>
// //                         Enter card details
// //                     </Text>
// //                 </XStack>

// //                 <XStack alignItems="center" gap={8}>
// //                     <Image source={visaLogo} style={enterCardDetailsStyles.cardLogo} />
// //                     <Image
// //                         source={americanExpressLogo}
// //                         style={enterCardDetailsStyles.cardLogo}
// //                     />
// //                     <Image source={mastercardLogo} style={enterCardDetailsStyles.cardLogo} />
// //                 </XStack>
// //             </XStack>

// //             <ScrollView contentContainerStyle={enterCardDetailsStyles.scrollViewContent}>
// //                 <YStack flex={1}>
// //                     <Text style={enterCardDetailsStyles.inputLabel}>Card Number</Text>
// //                     <View style={enterCardDetailsStyles.inputContainer}>
// //                         <Ionicons
// //                             name="card-outline"
// //                             size={20}
// //                             color={COLORS.placeholderText}
// //                             style={enterCardDetailsStyles.inputIcon}
// //                         />
// //                         <TextInput
// //                             style={enterCardDetailsStyles.input}
// //                             placeholder="**** **** **** ****"
// //                             placeholderTextColor={COLORS.placeholderText}
// //                             keyboardType="numeric"
// //                             value={cardNumber}
// //                             onChangeText={setCardNumber}
// //                             maxLength={19}
// //                         />
// //                     </View>

// //                     <XStack justifyContent="space-between" marginBottom={20}>
// //                         <YStack flex={1} marginRight={10}>
// //                             <Text style={enterCardDetailsStyles.inputLabel}>Expiry Date</Text>
// //                             <TextInput
// //                                 style={enterCardDetailsStyles.inputSingle}
// //                                 placeholder="MM/DD"
// //                                 placeholderTextColor={COLORS.placeholderText}
// //                                 keyboardType="numeric"
// //                                 value={expiryDate}
// //                                 onChangeText={setExpiryDate}
// //                                 maxLength={5}
// //                             />
// //                         </YStack>
// //                         <YStack flex={1} marginLeft={10}>
// //                             <Text style={enterCardDetailsStyles.inputLabel}>CVC</Text>
// //                             <TextInput
// //                                 style={enterCardDetailsStyles.inputSingle}
// //                                 placeholder="***"
// //                                 placeholderTextColor={COLORS.placeholderText}
// //                                 keyboardType="numeric"
// //                                 value={cvc}
// //                                 onChangeText={setCvc}
// //                                 maxLength={3}
// //                                 secureTextEntry
// //                             />
// //                         </YStack>
// //                     </XStack>

// //                     <Text style={enterCardDetailsStyles.inputLabel}>Cardholder Name</Text>
// //                     <TextInput
// //                         style={enterCardDetailsStyles.inputSingle}
// //                         placeholder="Name on card"
// //                         placeholderTextColor={COLORS.placeholderText}
// //                         value={cardHolder}
// //                         onChangeText={setCardHolder}
// //                         autoCapitalize="words"
// //                     />
// //                 </YStack>
// //             </ScrollView>

// //             <TouchableOpacity
// //                 style={enterCardDetailsStyles.makePaymentButton}
// //                 onPress={handleMakePayment}
// //             >
// //                 <Text style={enterCardDetailsStyles.makePaymentButtonText}>
// //                     Make payment
// //                 </Text>
// //             </TouchableOpacity>
// //         </SafeAreaView>
// //     );
// // };

// // const enterCardDetailsStyles = StyleSheet.create({
// //     scrollViewContent: { paddingHorizontal: 20, paddingBottom: 20 },
// //     cardLogo: { width: 35, height: 25, resizeMode: 'contain' },
// //     inputLabel: {
// //         fontSize: 14,
// //         color: COLORS.secondaryGray,
// //         marginBottom: 8,
// //         fontWeight: '500',
// //     },
// //     inputContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         borderWidth: 1,
// //         borderColor: COLORS.inputBorder,
// //         borderRadius: 8,
// //         paddingHorizontal: 15,
// //         marginBottom: 20,
// //         height: 50,
// //     },
// //     inputIcon: { marginRight: 10 },
// //     input: { flex: 1, fontSize: 16, color: COLORS.balanceText },
// //     inputSingle: {
// //         borderWidth: 1,
// //         borderColor: COLORS.inputBorder,
// //         borderRadius: 8,
// //         paddingHorizontal: 15,
// //         height: 50,
// //         fontSize: 16,
// //         color: COLORS.balanceText,
// //     },
// //     makePaymentButton: {
// //         backgroundColor: COLORS.buttonBlue,
// //         paddingVertical: 18,
// //         borderRadius: 8,
// //         alignItems: 'center',
// //         marginHorizontal: 20,
// //         marginBottom: 30,
// //     },
// //     makePaymentButtonText: {
// //         color: COLORS.white,
// //         fontSize: 16,
// //         fontWeight: '600',
// //     },
// // });

// // // =======================================================
// // // === ADD PAYMENT METHOD SCREEN ===
// // // =======================================================
// // const AddPaymentScreenContent = ({ onBack, onCreditCardPress }) => (
// //     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
// //         <XStack
// //             width="100%"
// //             paddingHorizontal={20}
// //             marginBottom={40}
// //             alignItems="center"
// //         >
// //             <TouchableOpacity onPress={onBack} style={{ marginRight: 20 }}>
// //                 <Ionicons name="chevron-back" size={24} color={COLORS.HEADER_ICON_GRAY} />
// //             </TouchableOpacity>
// //             <Text fontSize={18} fontWeight="600" color={COLORS.headerText}>
// //                 Add payment method
// //             </Text>
// //         </XStack>

// //         <YStack paddingHorizontal={20} flex={1}>
// //             <Text fontSize={16} color={COLORS.secondaryGray} marginBottom={40}>
// //                 You need to add a payment method in order to top-up your account
// //             </Text>

// //             <TouchableOpacity
// //                 style={addPaymentStyles.card}
// //                 activeOpacity={0.7}
// //                 onPress={onCreditCardPress}
// //             >
// //                 <XStack justifyContent="space-between" alignItems="center">
// //                     <YStack>
// //                         <Text
// //                             fontSize={18}
// //                             fontWeight="600"
// //                             color={COLORS.headerText}
// //                             marginBottom={2}
// //                         >
// //                             Credit card
// //                         </Text>
// //                         <Text fontSize={14} color={COLORS.secondaryGray}>
// //                             Powered by Stripe
// //                         </Text>
// //                     </YStack>
// //                     <Ionicons name="card-outline" size={24} color={COLORS.secondaryGray} />
// //                 </XStack>
// //             </TouchableOpacity>
// //         </YStack>
// //     </SafeAreaView>
// // );

// // const addPaymentStyles = StyleSheet.create({
// //     card: {
// //         borderWidth: 1,
// //         borderColor: COLORS.inputBorder,
// //         borderRadius: 10,
// //         padding: 20,
// //         backgroundColor: COLORS.lightGrayBg,
// //     },
// // });



// import { Ionicons } from '@expo/vector-icons';
// import { Stack, useNavigation } from 'expo-router';
// import { useEffect, useRef, useState } from 'react';
// import {
//     Image,
//     StyleSheet,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ScrollView, Text, XStack, YStack } from 'tamagui';
// import RecentActivitiesScreen from '@/components/wallet/RecentActivity'
// import PaymentStatusScreen from "@/components/wallet/PaymentStatus"

// // --- IMAGE ASSETS ---
// import americanExpressLogo from '@/assets/images/americanexpress.png';
// import mastercardLogo from '@/assets/images/mastercard.jpeg';
// import visaLogo from '@/assets/images/visa.png';
// import TransactionItem from '@/components/wallet/TransactonItem'
// import colors from "@/hooks/colors"
 
 
// const SCREENS = {
//     WALLET_SUMMARY: 'WalletSummary', 
//     ADD_PAYMENT: 'AddPayment',
//     ENTER_CARD_DETAILS: 'EnterCardDetails',
//     PAYMENT_STATUS: 'PaymentStatus',
//     RECENT_ACTIVITIES: 'RecentActivities', 
// };

// const allMockTransactions = [
//     {
//         id: 1,
//         type: 'debit',
//         title: 'Subscription renewal',
//         date: '28-09-2025', // Grouping key
//         dateDetails: 'Today', // Displayed subtext for summary
//         amount: -100, // Specific amount to trigger the document icon
//     },
//     {
//         id: 2,
//         type: 'credit',
//         title: 'Account Top-up',
//         date: '28-09-2025',
//         dateDetails: 'Today',
//         amount: 120,
//     },
//     {
//         id: 3,
//         type: 'debit',
//         title: 'Subscription renewal',
//         date: '28-09-2025',
//         dateDetails: 'Today',
//         amount: -30, // Triggers the arrow icon
//     },
//     {
//         id: 4,
//         type: 'credit',
//         title: 'Account Top-up',
//         date: '28-09-2025',
//         dateDetails: 'Today',
//         amount: 300,
//     },
//     {
//         id: 5,
//         type: 'credit',
//         title: 'Account Top-up',
//         date: '28-09-2025',
//         dateDetails: 'Today',
//         amount: 125,
//     },
//     {
//         id: 6,
//         type: 'debit',
//         title: 'Subscription renewal',
//         date: '27-09-2025',
//         dateDetails: 'Yesterday',
//         amount: -360, // Triggers the arrow icon
//     },
//     {
//         id: 7,
//         type: 'credit',
//         title: 'Account Top-up',
//         date: '27-09-2025',
//         dateDetails: 'Yesterday',
//         amount: 15,
//     },
//     {
//         id: 8,
//         type: 'debit',
//         title: 'Subscription renewal',
//         date: '26-10-2025', // Using a different month to demonstrate sorting
//         dateDetails: '26 Oct 2025',
//         amount: -30, // Triggers the arrow icon
//     },
//     {
//         id: 9,
//         type: 'credit',
//         title: 'Account Top-up',
//         date: '26-10-2025',
//         dateDetails: '26 Oct 2025',
//         amount: 12,
//     },
// ];



// // =======================================================
// // === MAIN WALLET FLOW SCREEN ===
// // =======================================================
// export default function WalletFlowScreen() {
//     const navigation = useNavigation();
//     const [isHidden, setIsHidden] = useState(false);
//     const [currentScreen, setCurrentScreen] = useState(SCREENS.WALLET_SUMMARY);
//     const totalBalance = 0;
//     const currencyCode = 'USD';
//     const displayBalance = isHidden
//         ? '******'
//         : `$${totalBalance.toLocaleString('en-US')}`;

//     const toggleBalanceVisibility = () => setIsHidden(!isHidden);

//     // Filter transactions for the summary screen (e.g., top 5)
//     // We'll use the top 5 transactions from the mock data to populate the summary
//     const recentTransactions = allMockTransactions.slice(0, 5);


//     // --- SCREEN NAVIGATION LOGIC ---

//     // 1. Recent Activities Screen
//     if (currentScreen === SCREENS.RECENT_ACTIVITIES)
//         return (
//             <RecentActivitiesScreen
//                 onBack={() => setCurrentScreen(SCREENS.WALLET_SUMMARY)}
//                 allTransactions={allMockTransactions}
//             />
//         );

//     // 2. Add Payment Screen
//     if (currentScreen === SCREENS.ADD_PAYMENT)
//         return (
//             <AddPaymentScreenContent
//                 onBack={() => setCurrentScreen(SCREENS.WALLET_SUMMARY)}
//                 onCreditCardPress={() => setCurrentScreen(SCREENS.ENTER_CARD_DETAILS)}
//             />
//         );

//     // 3. Payment Status Screen
//     if (currentScreen === SCREENS.PAYMENT_STATUS)
//         return (
//             <PaymentStatusScreen
//                 onDone={() => setCurrentScreen(SCREENS.WALLET_SUMMARY)}
//             />
//         );

//     // 4. Enter Card Details Screen
//     if (currentScreen === SCREENS.ENTER_CARD_DETAILS)
//         return (
//             <EnterCardDetailsScreenContent
//                 onBack={() => setCurrentScreen(SCREENS.ADD_PAYMENT)}
//                 onMakePayment={() => setCurrentScreen(SCREENS.PAYMENT_STATUS)}
//             />
//         );

//     // 5. WALLET SUMMARY SCREEN (Default)
//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
//             <Stack.Screen options={{ headerShown: false }} />
//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 <XStack
//                     width="100%"
//                     paddingHorizontal={20}
//                     marginBottom={20}
//                     alignItems="center"
//                 >
//                     <TouchableOpacity onPress={() => navigation.goBack()}>
//                         <Ionicons
//                             name="chevron-back"
//                             size={24}
//                             color={colors.HEADER_ICON_GRAY}
//                         />
//                     </TouchableOpacity>
//                 </XStack>

//                 <YStack alignItems="center" marginBottom={40}>
//                     <XStack alignItems="center" marginBottom={8}>
//                         <Text fontSize={16} marginRight={6}>
//                             🇺🇸
//                         </Text>
//                         <Text fontSize={16} fontWeight="500" color={colors.balanceText}>
//                             {currencyCode} Account
//                         </Text>
//                     </XStack>

//                     <XStack alignItems="center" marginBottom={4}>
//                         <Text fontSize={14} color={colors.secondaryGray} marginRight={5}>
//                             Total Balance
//                         </Text>
//                         <TouchableOpacity onPress={toggleBalanceVisibility}>
//                             <Ionicons
//                                 name={isHidden ? 'eye-off-outline' : 'eye-outline'}
//                                 size={18}
//                                 color={colors.secondaryGray}
//                             />
//                         </TouchableOpacity>
//                     </XStack>

//                     <XStack alignItems="flex-end" gap={4} paddingVertical={4}>
//                         <Text fontSize={48} fontWeight="bold" color={colors.balanceText}>
//                             {displayBalance}
//                         </Text>
//                         {!isHidden && (
//                             <Text
//                                 fontSize={18}
//                                 fontWeight="400"
//                                 color={colors.secondaryGray}
//                                 marginBottom={8}
//                             >
//                                 {currencyCode}
//                             </Text>
//                         )}
//                     </XStack>

//                     <XStack justifyContent="space-around" width="80%" marginTop={20}>
//                         <YStack alignItems="center">
//                             <TouchableOpacity
//                                 style={[
//                                     styles.actionBtn,
//                                     { backgroundColor: colors.ACTION_NAVY_BLUE },
//                                 ]}
//                                 onPress={() => setCurrentScreen(SCREENS.ADD_PAYMENT)}
//                             >
//                                 <Ionicons name="add" size={24} color="#FFFFFF" />
//                             </TouchableOpacity>
//                             <Text fontSize={14} color={colors.secondaryGray} marginTop={6}>
//                                 Top up
//                             </Text>
//                         </YStack>

//                         <YStack alignItems="center">
//                             <TouchableOpacity
//                                 style={[
//                                     styles.actionBtn,
//                                     { backgroundColor: colors.ACTION_NAVY_BLUE },
//                                 ]}
//                             >
//                                 <Ionicons name="remove" size={24} color="#FFFFFF" />
//                             </TouchableOpacity>
//                             <Text fontSize={14} color={colors.secondaryGray} marginTop={6}>
//                                 Withdraw
//                             </Text>
//                         </YStack>
//                     </XStack>
//                 </YStack>

//                 {/* RECENT TRANSACTIONS LIST */}
//                 <View style={{ width: '100%', paddingHorizontal: 20 }}>
//                     <Text
//                         fontSize={18}
//                         fontWeight="600"
//                         marginBottom={15}
//                         color={colors.balanceText}
//                     >
//                         Recent Transactions
//                     </Text>

//                     <YStack>
//                         {recentTransactions.map((tx) => (
//                             <TransactionItem
//                                 key={tx.id}
//                                 title={tx.title}
//                                 date={tx.dateDetails}
//                                 amount={tx.amount}
//                                 type={tx.type}
//                             />
//                         ))}
//                     </YStack>

//                     {/* See All Button - FIXED onPress Handler */}
//                     <TouchableOpacity
//                         style={transactionStyles.seeAllButton}
//                         onPress={() => setCurrentScreen(SCREENS.RECENT_ACTIVITIES)}
//                     >
//                         <Text style={transactionStyles.seeAllButtonText}>See all</Text>
//                     </TouchableOpacity>
//                 </View>
//                 <View style={{ height: 40 }} />
//             </ScrollView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     scrollContainer: { paddingBottom: 100, alignItems: 'center' },
//     actionBtn: {
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });