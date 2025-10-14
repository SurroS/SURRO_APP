import { Ionicons } from '@expo/vector-icons';
import { Stack, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, XStack, YStack } from 'tamagui';

// --- IMAGE ASSETS ---
// NOTE: I am using relative paths here based on the standard Expo structure.
import americanExpressLogo from '@/assets/images/americanexpress.png';
import mastercardLogo from '@/assets/images/mastercard.jpeg';
import visaLogo from '@/assets/images/visa.png';

const { width } = Dimensions.get('window');

// --- CONSTANTS ---
const SCREENS = {
    WALLET_SUMMARY: 'WalletSummary',
    ADD_PAYMENT: 'AddPayment',
    ENTER_CARD_DETAILS: 'EnterCardDetails',
    PAYMENT_STATUS: 'PaymentStatus',
    RECENT_ACTIVITIES: 'RecentActivities', // NEW SCREEN
};

const COLORS = {
    ACTION_NAVY_BLUE: '#0E0E55',
    HEADER_ICON_GRAY: '#666666',
    primaryDark: '#0E0E55',
    balanceText: '#222222',
    headerText: '#000000',
    secondaryGray: '#444444',
    lightGrayBg: '#F9F9F9',
    border: '#E0E0E0',
    white: '#FFFFFF',
    inputBorder: '#E0E0E0',
    placeholderText: '#999999',
    buttonBlue: '#0E0E55',
    SUCCESS_GREEN: '#1F8454',
    DEBIT_RED: '#D52D3F',
    CREDIT_GREEN: '#1F8454',
};

// =======================================================
// === REUSABLE TRANSACTION COMPONENT ===
// =======================================================

const TransactionItem = ({ title, date, amount, type }) => {
    const isDebit = type === 'debit';
    const amountColor = isDebit ? COLORS.DEBIT_RED : COLORS.CREDIT_GREEN;
    const iconBackgroundColor = isDebit ? COLORS.DEBIT_RED : COLORS.CREDIT_GREEN;

    const formattedAmount = Math.abs(amount).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    let displayedIcon;
    if (title.includes('Subscription renewal') && amount === -100) {
        displayedIcon = (
            <Ionicons
                name="document-text-outline"
                size={20}
                color={COLORS.white}
            />
        );
    } else if (title.includes('Subscription renewal')) {
        displayedIcon = (
            <Ionicons
                name="arrow-up-right"
                size={20}
                color={COLORS.white}
            />
        );
    } else if (title.includes('Top-up')) {
        displayedIcon = (
            <Ionicons
                name="checkmark"
                size={24}
                color={COLORS.white}
            />
        );
    } else {
        displayedIcon = (
            <Ionicons
                name={isDebit ? 'arrow-up-outline' : 'arrow-down-outline'}
                size={20}
                color={COLORS.white}
            />
        );
    }


    return (
        <XStack
            alignItems="center"
            justifyContent="space-between"
            paddingVertical={12}
        >
            <XStack alignItems="center" flex={1}>
                {/* Icon Circle */}
                <View style={[transactionStyles.iconCircle, { backgroundColor: iconBackgroundColor }]}>
                    {displayedIcon}
                </View>

                {/* Title and Date */}
                <YStack marginLeft={15} flexShrink={1}>
                    <Text fontSize={16} fontWeight="500" color={COLORS.headerText} numberOfLines={1}>
                        {title}
                    </Text>
                    <Text fontSize={13} color={COLORS.secondaryGray}>
                        {date}
                    </Text>
                </YStack>
            </XStack>

            {/* Amount */}
            <Text fontSize={16} fontWeight="600" color={amountColor}>
                {isDebit ? '-' : '$'}{formattedAmount}
            </Text>
        </XStack>
    );
};

const transactionStyles = StyleSheet.create({
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    seeAllButton: {
        backgroundColor: COLORS.lightGrayBg,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    seeAllButtonText: {
        color: COLORS.secondaryGray,
        fontSize: 16,
        fontWeight: '500',
    },
});

// =======================================================
// === RECENT ACTIVITIES SCREEN (NEW) ===
// =======================================================

const RecentActivitiesScreenContent = ({ onBack, allTransactions }) => {
    // Group transactions by date string for the headers
    const groupedTransactions = allTransactions.reduce((acc, transaction) => {
        // The `date` property is used for grouping (e.g., '28-09-2025')
        const dateKey = transaction.date;
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(transaction);
        return acc;
    }, {});

    // Sort the keys (dates) to ensure newest dates appear first
    const sortedDateKeys = Object.keys(groupedTransactions).sort((a, b) => {
        // Simple comparison for string dates in 'DD-MM-YYYY' format
        return b.localeCompare(a); 
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            {/* Header */}
            <XStack
                width="100%"
                paddingHorizontal={20}
                paddingTop={10}
                marginBottom={20}
                alignItems="center"
            >
                <TouchableOpacity onPress={onBack} style={{ marginRight: 20 }}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.HEADER_ICON_GRAY} />
                </TouchableOpacity>
                <Text fontSize={18} fontWeight="600" color={COLORS.headerText}>
                    Recent activities
                </Text>
            </XStack>

            <ScrollView contentContainerStyle={recentActivitiesStyles.scrollContainer}>
                {sortedDateKeys.map((dateKey) => (
                    <YStack key={dateKey} width="100%" marginBottom={10}>
                        {/* Date Header */}
                        <Text style={recentActivitiesStyles.dateHeader}>
                            {dateKey}
                        </Text>
                        {/* Transactions for the date */}
                        <YStack>
                            {groupedTransactions[dateKey].map((tx) => (
                                <TransactionItem
                                    key={tx.id}
                                    title={tx.title}
                                    // The dateDetails is the subtext (e.g., Today, Yesterday)
                                    date={tx.dateDetails} 
                                    amount={tx.amount}
                                    type={tx.type}
                                    iconName={tx.iconName}
                                />
                            ))}
                        </YStack>
                    </YStack>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const recentActivitiesStyles = StyleSheet.create({
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    dateHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.secondaryGray,
        marginBottom: 8,
        marginTop: 15,
    },
});

// =======================================================
// === PAYMENT STATUS SCREEN ===
// =======================================================

const PaymentStatusScreenContent = ({ onDone }) => {
    const [status, setStatus] = useState('processing');
    const spinValue = useRef(new Animated.Value(0)).current;

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const startSpinning = () => {
        spinValue.setValue(0);
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    };

    useEffect(() => {
        if (status === 'processing') {
            startSpinning();
        } else {
            spinValue.stopAnimation();
        }

        const timer = setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                onDone();
            }, 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [status, onDone]);

    const isProcessing = status === 'processing';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <YStack
                width="100%"
                paddingHorizontal={20}
                paddingTop={30}
                marginBottom={40}
                alignItems="center"
            >
                <Text fontSize={18} fontWeight="600" color={COLORS.headerText}>
                    Payment Processing
                </Text>
            </YStack>

            <YStack alignItems="center" paddingHorizontal={20}>
                {isProcessing ? (
                    <>
                        <Animated.View
                            style={[
                                statusStyles.spinnerContainer,
                                { transform: [{ rotate: spin }] },
                            ]}
                        >
                        </Animated.View>
                        <Text style={statusStyles.message}>
                            Please wait while we process your payment
                        </Text>
                    </>
                ) : (
                    <>
                        <View style={statusStyles.successIconContainer}>
                            <Ionicons name="checkmark" size={40} color={COLORS.white} />
                        </View>
                        <Text style={statusStyles.title}>Payment successful</Text>
                        <Text style={statusStyles.message}>
                            Your wallet has been topped up successfully. We've sent your receipt to your email.
                        </Text>
                    </>
                )}
            </YStack>
        </SafeAreaView>
    );
};

const statusStyles = StyleSheet.create({
    spinnerContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 6,
        borderColor: 'rgba(14, 14, 85, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderTopColor: COLORS.ACTION_NAVY_BLUE,
        borderLeftColor: COLORS.ACTION_NAVY_BLUE,
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.SUCCESS_GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.headerText,
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.secondaryGray,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});

// =======================================================
// === ENTER CARD DETAILS SCREEN ===
// =======================================================
const EnterCardDetailsScreenContent = ({ onBack, onMakePayment }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [cardHolder, setCardHolder] = useState('');

    const handleMakePayment = () => {
        if (cardNumber && expiryDate && cvc && cardHolder) {
            console.log('Payment Details:', { cardNumber, expiryDate, cvc, cardHolder });
            onMakePayment();
        } else {
            console.log('Please fill all required card details.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <XStack
                width="100%"
                paddingHorizontal={20}
                marginBottom={30}
                alignItems="center"
                justifyContent="space-between"
            >
                <XStack alignItems="center">
                    <TouchableOpacity onPress={onBack} style={{ marginRight: 20 }}>
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color={COLORS.HEADER_ICON_GRAY}
                        />
                    </TouchableOpacity>
                    <Text fontSize={18} fontWeight="600" color={COLORS.headerText}>
                        Enter card details
                    </Text>
                </XStack>

                <XStack alignItems="center" gap={8}>
                    <Image source={visaLogo} style={enterCardDetailsStyles.cardLogo} />
                    <Image
                        source={americanExpressLogo}
                        style={enterCardDetailsStyles.cardLogo}
                    />
                    <Image source={mastercardLogo} style={enterCardDetailsStyles.cardLogo} />
                </XStack>
            </XStack>

            <ScrollView contentContainerStyle={enterCardDetailsStyles.scrollViewContent}>
                <YStack flex={1}>
                    <Text style={enterCardDetailsStyles.inputLabel}>Card Number</Text>
                    <View style={enterCardDetailsStyles.inputContainer}>
                        <Ionicons
                            name="card-outline"
                            size={20}
                            color={COLORS.placeholderText}
                            style={enterCardDetailsStyles.inputIcon}
                        />
                        <TextInput
                            style={enterCardDetailsStyles.input}
                            placeholder="**** **** **** ****"
                            placeholderTextColor={COLORS.placeholderText}
                            keyboardType="numeric"
                            value={cardNumber}
                            onChangeText={setCardNumber}
                            maxLength={19}
                        />
                    </View>

                    <XStack justifyContent="space-between" marginBottom={20}>
                        <YStack flex={1} marginRight={10}>
                            <Text style={enterCardDetailsStyles.inputLabel}>Expiry Date</Text>
                            <TextInput
                                style={enterCardDetailsStyles.inputSingle}
                                placeholder="MM/DD"
                                placeholderTextColor={COLORS.placeholderText}
                                keyboardType="numeric"
                                value={expiryDate}
                                onChangeText={setExpiryDate}
                                maxLength={5}
                            />
                        </YStack>
                        <YStack flex={1} marginLeft={10}>
                            <Text style={enterCardDetailsStyles.inputLabel}>CVC</Text>
                            <TextInput
                                style={enterCardDetailsStyles.inputSingle}
                                placeholder="***"
                                placeholderTextColor={COLORS.placeholderText}
                                keyboardType="numeric"
                                value={cvc}
                                onChangeText={setCvc}
                                maxLength={3}
                                secureTextEntry
                            />
                        </YStack>
                    </XStack>

                    <Text style={enterCardDetailsStyles.inputLabel}>Cardholder Name</Text>
                    <TextInput
                        style={enterCardDetailsStyles.inputSingle}
                        placeholder="Name on card"
                        placeholderTextColor={COLORS.placeholderText}
                        value={cardHolder}
                        onChangeText={setCardHolder}
                        autoCapitalize="words"
                    />
                </YStack>
            </ScrollView>

            <TouchableOpacity
                style={enterCardDetailsStyles.makePaymentButton}
                onPress={handleMakePayment}
            >
                <Text style={enterCardDetailsStyles.makePaymentButtonText}>
                    Make payment
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const enterCardDetailsStyles = StyleSheet.create({
    scrollViewContent: { paddingHorizontal: 20, paddingBottom: 20 },
    cardLogo: { width: 35, height: 25, resizeMode: 'contain' },
    inputLabel: {
        fontSize: 14,
        color: COLORS.secondaryGray,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        height: 50,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, color: COLORS.balanceText },
    inputSingle: {
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 50,
        fontSize: 16,
        color: COLORS.balanceText,
    },
    makePaymentButton: {
        backgroundColor: COLORS.buttonBlue,
        paddingVertical: 18,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 30,
    },
    makePaymentButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

// =======================================================
// === ADD PAYMENT METHOD SCREEN ===
// =======================================================
const AddPaymentScreenContent = ({ onBack, onCreditCardPress }) => (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
        <XStack
            width="100%"
            paddingHorizontal={20}
            marginBottom={40}
            alignItems="center"
        >
            <TouchableOpacity onPress={onBack} style={{ marginRight: 20 }}>
                <Ionicons name="chevron-back" size={24} color={COLORS.HEADER_ICON_GRAY} />
            </TouchableOpacity>
            <Text fontSize={18} fontWeight="600" color={COLORS.headerText}>
                Add payment method
            </Text>
        </XStack>

        <YStack paddingHorizontal={20} flex={1}>
            <Text fontSize={16} color={COLORS.secondaryGray} marginBottom={40}>
                You need to add a payment method in order to top-up your account
            </Text>

            <TouchableOpacity
                style={addPaymentStyles.card}
                activeOpacity={0.7}
                onPress={onCreditCardPress}
            >
                <XStack justifyContent="space-between" alignItems="center">
                    <YStack>
                        <Text
                            fontSize={18}
                            fontWeight="600"
                            color={COLORS.headerText}
                            marginBottom={2}
                        >
                            Credit card
                        </Text>
                        <Text fontSize={14} color={COLORS.secondaryGray}>
                            Powered by Stripe
                        </Text>
                    </YStack>
                    <Ionicons name="card-outline" size={24} color={COLORS.secondaryGray} />
                </XStack>
            </TouchableOpacity>
        </YStack>
    </SafeAreaView>
);

const addPaymentStyles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: 10,
        padding: 20,
        backgroundColor: COLORS.lightGrayBg,
    },
});

// =======================================================
// === MOCK DATA FOR ALL TRANSACTIONS (EXPANDED) ===
// =======================================================

const allMockTransactions = [
    {
        id: 1,
        type: 'debit',
        title: 'Subscription renewal',
        date: '28-09-2025', // Grouping key
        dateDetails: 'Today', // Displayed subtext for summary
        amount: -100,
        iconName: 'document-text-outline',
    },
    {
        id: 2,
        type: 'credit',
        title: 'Account Top-up',
        date: '28-09-2025',
        dateDetails: 'Today',
        amount: 120,
        iconName: 'checkmark',
    },
    {
        id: 3,
        type: 'debit',
        title: 'Subscription renewal',
        date: '28-09-2025',
        dateDetails: 'Today',
        amount: -30,
        iconName: 'arrow-up-right',
    },
    {
        id: 4,
        type: 'credit',
        title: 'Account Top-up',
        date: '28-09-2025',
        dateDetails: 'Today',
        amount: 300,
        iconName: 'checkmark',
    },
    {
        id: 5,
        type: 'credit',
        title: 'Account Top-up',
        date: '28-09-2025',
        dateDetails: 'Today',
        amount: 125,
        iconName: 'checkmark',
    },
    {
        id: 6,
        type: 'debit',
        title: 'Subscription renewal',
        date: '27-09-2025',
        dateDetails: 'Yesterday',
        amount: -360,
        iconName: 'arrow-up-right',
    },
    {
        id: 7,
        type: 'credit',
        title: 'Account Top-up',
        date: '27-09-2025',
        dateDetails: 'Yesterday',
        amount: 15,
        iconName: 'checkmark',
    },
    {
        id: 8,
        type: 'debit',
        title: 'Subscription renewal',
        date: '26-09-2025', // Changed to match date format and sorting
        dateDetails: '26 Sept 2025',
        amount: -30,
        iconName: 'arrow-up-right',
    },
    {
        id: 9,
        type: 'credit',
        title: 'Account Top-up',
        date: '26-09-2025',
        dateDetails: '26 Sept 2025',
        amount: 12,
        iconName: 'checkmark',
    },
];

// =======================================================
// === MAIN WALLET FLOW SCREEN ===
// =======================================================
export default function WalletFlowScreen() {
    const navigation = useNavigation();
    const [isHidden, setIsHidden] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(SCREENS.WALLET_SUMMARY);
    const totalBalance = 0;
    const currencyCode = 'USD';
    const displayBalance = isHidden
        ? '******'
        : `$${totalBalance.toLocaleString('en-US')}`;

    const toggleBalanceVisibility = () => setIsHidden(!isHidden);

    // Filter transactions for the summary screen (e.g., top 5)
    // We'll use the top 5 transactions from the mock data to populate the summary
    const recentTransactions = allMockTransactions.slice(0, 5);


    // --- SCREEN NAVIGATION LOGIC ---

    // 1. Recent Activities Screen
    if (currentScreen === SCREENS.RECENT_ACTIVITIES)
        return (
            <RecentActivitiesScreenContent
                onBack={() => setCurrentScreen(SCREENS.WALLET_SUMMARY)}
                allTransactions={allMockTransactions}
            />
        );

    // 2. Add Payment Screen
    if (currentScreen === SCREENS.ADD_PAYMENT)
        return (
            <AddPaymentScreenContent
                onBack={() => setCurrentScreen(SCREENS.WALLET_SUMMARY)}
                onCreditCardPress={() => setCurrentScreen(SCREENS.ENTER_CARD_DETAILS)}
            />
        );

    // 3. Payment Status Screen
    if (currentScreen === SCREENS.PAYMENT_STATUS)
        return (
            <PaymentStatusScreenContent
                onDone={() => setCurrentScreen(SCREENS.WALLET_SUMMARY)}
            />
        );

    // 4. Enter Card Details Screen
    if (currentScreen === SCREENS.ENTER_CARD_DETAILS)
        return (
            <EnterCardDetailsScreenContent
                onBack={() => setCurrentScreen(SCREENS.ADD_PAYMENT)}
                onMakePayment={() => setCurrentScreen(SCREENS.PAYMENT_STATUS)}
            />
        );

    // 5. WALLET SUMMARY SCREEN (Default)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <XStack
                    width="100%"
                    paddingHorizontal={20}
                    marginBottom={20}
                    alignItems="center"
                >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color={COLORS.HEADER_ICON_GRAY}
                        />
                    </TouchableOpacity>
                </XStack>

                <YStack alignItems="center" marginBottom={40}>
                    <XStack alignItems="center" marginBottom={8}>
                        <Text fontSize={16} marginRight={6}>
                            🇺🇸
                        </Text>
                        <Text fontSize={16} fontWeight="500" color={COLORS.balanceText}>
                            {currencyCode} Account
                        </Text>
                    </XStack>

                    <XStack alignItems="center" marginBottom={4}>
                        <Text fontSize={14} color={COLORS.secondaryGray} marginRight={5}>
                            Total Balance
                        </Text>
                        <TouchableOpacity onPress={toggleBalanceVisibility}>
                            <Ionicons
                                name={isHidden ? 'eye-off-outline' : 'eye-outline'}
                                size={18}
                                color={COLORS.secondaryGray}
                            />
                        </TouchableOpacity>
                    </XStack>

                    <XStack alignItems="flex-end" gap={4} paddingVertical={4}>
                        <Text fontSize={48} fontWeight="bold" color={COLORS.balanceText}>
                            {displayBalance}
                        </Text>
                        {!isHidden && (
                            <Text
                                fontSize={18}
                                fontWeight="400"
                                color={COLORS.secondaryGray}
                                marginBottom={8}
                            >
                                {currencyCode}
                            </Text>
                        )}
                    </XStack>

                    <XStack justifyContent="space-around" width="80%" marginTop={20}>
                        <YStack alignItems="center">
                            <TouchableOpacity
                                style={[
                                    styles.actionBtn,
                                    { backgroundColor: COLORS.ACTION_NAVY_BLUE },
                                ]}
                                onPress={() => setCurrentScreen(SCREENS.ADD_PAYMENT)}
                            >
                                <Ionicons name="add" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text fontSize={14} color={COLORS.secondaryGray} marginTop={6}>
                                Top up
                            </Text>
                        </YStack>

                        <YStack alignItems="center">
                            <TouchableOpacity
                                style={[
                                    styles.actionBtn,
                                    { backgroundColor: COLORS.ACTION_NAVY_BLUE },
                                ]}
                            >
                                <Ionicons name="remove" size={24} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text fontSize={14} color={COLORS.secondaryGray} marginTop={6}>
                                Withdraw
                            </Text>
                        </YStack>
                    </XStack>
                </YStack>

                {/* RECENT TRANSACTIONS LIST */}
                <View style={{ width: '100%', paddingHorizontal: 20 }}>
                    <Text
                        fontSize={18}
                        fontWeight="600"
                        marginBottom={15}
                        color={COLORS.balanceText}
                    >
                        Recent Transactions
                    </Text>

                    <YStack>
                        {recentTransactions.map((tx) => (
                            <TransactionItem
                                key={tx.id}
                                title={tx.title}
                                date={tx.dateDetails}
                                amount={tx.amount}
                                type={tx.type}
                                iconName={tx.iconName}
                            />
                        ))}
                    </YStack>

                    {/* See All Button - FIXED onPress Handler */}
                    <TouchableOpacity
                        style={transactionStyles.seeAllButton}
                        onPress={() => setCurrentScreen(SCREENS.RECENT_ACTIVITIES)}
                    >
                        <Text style={transactionStyles.seeAllButtonText}>See all</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { paddingBottom: 100, alignItems: 'center' },
    actionBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});