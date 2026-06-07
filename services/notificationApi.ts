import { authenticatedGet, authenticatedPatch } from "./httpClient";

export interface ReminderSettings {
  emailReminder: boolean;
  smsReminder: boolean;
  pushReminder: boolean;
}

export const getReminderSettings = async (): Promise<ReminderSettings> => {
  console.log("[Notif] getReminderSettings: fetching...");
  const response = await authenticatedGet("/notifications/reminders/me");
  console.log("[Notif] getReminderSettings: response =", JSON.stringify(response).slice(0, 200));
  return response?.data ?? response ?? {};
};

export const updateReminderSettings = async (
  data: Partial<ReminderSettings>,
): Promise<ReminderSettings> => {
  console.log("[Notif] updateReminderSettings:", JSON.stringify(data));
  const response = await authenticatedPatch("/notifications/reminders/me", data);
  console.log("[Notif] updateReminderSettings: response =", JSON.stringify(response).slice(0, 200));
  return response?.data ?? response ?? {};
};

export interface NotificationPreferences {
  emailNotification: boolean;
  smsNotification: boolean;
  pushNotification: boolean;
  emailPromotions: boolean;
  smsPromotions: boolean;
  pushNotificationPromotions: boolean;
}

export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  console.log("[Notif] getNotificationPreferences: fetching...");
  const response = await authenticatedGet("/notifications/preferences/me");
  console.log("[Notif] getNotificationPreferences: response =", JSON.stringify(response).slice(0, 300));
  const data = response?.data ?? response ?? {};
  return {
    emailNotification: data.emailNotification ?? true,
    smsNotification: data.smsNotification ?? true,
    pushNotification: data.pushNotification ?? true,
    emailPromotions: data.emailPromotions ?? true,
    smsPromotions: data.smsPromotions ?? true,
    pushNotificationPromotions: data.pushNotificationPromotions ?? true,
  };
};

export const updateNotificationPreferences = async (
  data: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> => {
  console.log("[Notif] updateNotificationPreferences:", JSON.stringify(data));
  const response = await authenticatedPatch("/notifications/preferences/me", data);
  console.log("[Notif] updateNotificationPreferences: response =", JSON.stringify(response).slice(0, 200));
  return response?.data ?? response ?? {};
};

export interface BackendNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<BackendNotification[]> => {
  console.log("[Notif] getNotifications: fetching...");
  const response = await authenticatedGet("/notifications");
  console.log("[Notif] getNotifications: response =", JSON.stringify(response).slice(0, 300));
  const data = response?.data ?? response ?? [];
  return Array.isArray(data) ? data : [];
};
