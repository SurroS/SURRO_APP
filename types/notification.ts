export type NotificationSource = "LOCAL" | "BACKEND";

/**
 * ADMIN = backend only (render-only)
 */
export type NotificationType =
  | "GENERAL" // admin console only
  | "PAYMENT"
  | "PROFILE_SETUP"
  | "PROFILE_VIEW"
  | "PROFILE_BOOST"
  | "REFERRAL"
  | "KYC"
  | "MATCH"
  | "REMINDER"
  | "SYSTEM";

export type UserRole = "SURROGATE" | "INTENDED_PARENT" | "AGENT" | "ALL";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  role?: UserRole; 
  read: boolean;
  createdAt: string;
  source: NotificationSource;
  data?: Record<string, any>;
}
