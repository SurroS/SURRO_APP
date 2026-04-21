export const allMockTransactions = [
    {
        id: "1",
        type: 'debit',
        title: 'Subscription renewal',
        date: '28-09-2025', // Grouping key
        dateDetails: 'Today', // Displayed subtext for summary
        amount: -100, // Specific amount to trigger the document icon
    },
    {
        id: "2",
        type: 'credit',
        title: 'Account Top-up',
        date: '28-09-2025',
        dateDetails: 'Today',
        amount: 120,
    },
    {
        id: "3",
        type: 'debit',
        title: 'Subscription renewal',
        date: '28-09-2025',
        dateDetails: 'Today',
        amount: -30, // Triggers the arrow icon
    },
    {
        id: "4",
        type: 'credit',
        title: 'Account Top-up',
        date: '28-09-2025',
        dateDetails: 'Today',
        amount: 300,
    },
    {
        id: "5",
        type: 'credit',
        title: 'Account Top-up',
        date: '28-09-2025',
        dateDetails: 'Today',
        amount: 125,
    },
    {
        id: "6",
        type: 'debit',
        title: 'Subscription renewal',
        date: '27-09-2025',
        dateDetails: 'Yesterday',
        amount: -360, // Triggers the arrow icon
    },
    {
        id: "7",
        type: 'credit',
        title: 'Account Top-up',
        date: '27-09-2025',
        dateDetails: 'Yesterday',
        amount: 15,
    },
    {
        id: "8",
        type: 'debit',
        title: 'Subscription renewal',
        date: '26-10-2025', // Using a different month to demonstrate sorting
        dateDetails: '26 Oct 2025',
        amount: -30, // Triggers the arrow icon
    },
    {
        id: "9",
        type: 'credit',
        title: 'Account Top-up',
        date: '26-10-2025',
        dateDetails: '26 Oct 2025',
        amount: 12,
    },
];
export const SCREENS = {
    WALLET_SUMMARY: 'WalletSummary', 
    ADD_PAYMENT: 'AddPayment',
    ENTER_CARD_DETAILS: 'EnterCardDetails',
    PAYMENT_STATUS: 'PaymentStatus',
    RECENT_ACTIVITIES: 'RecentActivities', 
};