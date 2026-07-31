export type NotificationType =
  | "GENERAL"
  | "PROFILE_SETUP"
  | "PROFILE_VIEWS"
  | "PAYMENT"
  | "REFERRAL"
  | "SURROGATE_BOOST"
  | "KYC"
  | "PROFILE_BOOST"
  | "INACTIVITY";

export type NotificationSource = "LOCAL" | "SYSTEM";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  source: NotificationSource;
  role?: "SURROGATE" | "INTENDED_PARENT" | "AGENT" | "ALL";
  read: boolean;
  createdAt: number;
};
