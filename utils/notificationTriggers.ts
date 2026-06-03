import { useNotificationStore } from "@/store/notifications";
import { NotificationType, UserRole } from "@/types/notification";

const store = useNotificationStore.getState();

export const triggerPaymentSuccess = (role: UserRole) => {
  console.log("[Notif] triggerPaymentSuccess:", role);
  store.addLocal({
    title: "Payment successful 🎉",
    body: "Your transaction was successful.",
    type: "PAYMENT",
    role,
  });

  setTimeout(() => {
    console.log("[Notif] triggerPaymentSuccess: scheduling follow-up (30min)");
    store.addLocal({
      title: "Next step unlocked",
      body: "You can now continue matching.",
      type: "PAYMENT",
      role,
    });
  }, 30 * 60 * 1000); // 30 minutes
};

export const triggerReferralReminder = (role: UserRole) => {
  console.log("[Notif] triggerReferralReminder:", role);
  store.addLocal({
    title: "Daily Referral Reminder",
    body: "Invite friends today and earn credits!",
    type: "REFERRAL",
    role,
  });
};

export const triggerProfileBoostAlert = (role: UserRole) => {
  console.log("[Notif] triggerProfileBoostAlert:", role);
  store.addLocal({
    title: "Profile Boost Available 🚀",
    body: "Boost your profile to increase visibility.",
    type: "PROFILE_BOOST",
    role,
  });
};

export const triggerKycAlert = (role: UserRole) => {
  console.log("[Notif] triggerKycAlert:", role);
  store.addLocal({
    title: "Complete KYC",
    body: "Finish your KYC to receive payments quickly.",
    type: "KYC",
    role,
  });
};
