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
  platform: "IOS" | "ANDROID",
): Promise<void> {
  await authenticatedPost("/notifications/push-token", { token, platform });
}

export async function getNotifications(): Promise<BackendNotification[]> {
  try {
    return await authenticatedGet("/notifications");
  } catch (error: any) {
    if (error?.status !== 404 && error?.response?.status !== 404) throw error;
    return authenticatedGet("/notification");
  }
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
  try {
    await authenticatedPatch(`/notifications/${id}/read`, { isRead: true });
    return;
  } catch (firstErr: any) {
    if (firstErr?.status !== 404 && firstErr?.response?.status !== 404) {
      throw firstErr;
    }
    try {
      await authenticatedPatch(`/notifications/${id}`, { isRead: true });
      return;
    } catch (secondErr: any) {
      if (secondErr?.status !== 404 && secondErr?.response?.status !== 404) {
        throw secondErr;
      }
      try {
        await authenticatedPatch(`/notification/${id}/read`, { isRead: true });
        return;
      } catch (thirdErr: any) {
        if (thirdErr?.status !== 404 && thirdErr?.response?.status !== 404) {
          throw thirdErr;
        }
        await authenticatedPatch(`/notification/${id}`, { isRead: true });
      }
    }
  }
}

export async function deleteNotification(id: string): Promise<void> {
  try {
    await authenticatedDelete(`/notifications/${id}`);
  } catch (error: any) {
    if (error?.status !== 404 && error?.response?.status !== 404) throw error;
    await authenticatedDelete(`/notification/${id}`);
  }
}
