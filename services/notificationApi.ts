import { authenticatedGet, authenticatedPost, authenticatedPatch, authenticatedDelete } from "./httpClient";

export interface BackendNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  emailPromotions: boolean;
  smsPromotions: boolean;
  pushNotificationPromotions: boolean;
}

export interface ReminderSettings {
  emailReminder: boolean;
  smsReminder: boolean;
  pushReminder: boolean;
}

export async function registerPushToken(
  token: string,
  platform: "ios" | "android",
): Promise<void> {
  await authenticatedPost("/notifications/push-token", { token, platform });
}

export async function getNotifications(): Promise<BackendNotification[]> {
  return authenticatedGet("/notifications");
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return authenticatedGet("/notifications/preferences/me");
}

export async function updateNotificationPreferences(
  prefs: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  return authenticatedPatch("/notifications/preferences/me", prefs);
}

export async function getReminderSettings(): Promise<ReminderSettings> {
  return authenticatedGet("/notifications/reminders/me");
}

export async function updateReminderSettings(
  settings: Partial<ReminderSettings>,
): Promise<ReminderSettings> {
  return authenticatedPatch("/notifications/reminders/me", settings);
}

export async function markNotificationRead(id: string): Promise<void> {
  await authenticatedPatch(`/notifications/${id}`, { isRead: true });
}

export async function deleteNotification(id: string): Promise<void> {
  await authenticatedDelete(`/notifications/${id}`);
}
