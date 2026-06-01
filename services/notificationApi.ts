import { authenticatedGet, authenticatedPatch } from "./httpClient";

export interface ReminderSettings {
  emailReminder: boolean;
  smsReminder: boolean;
  pushReminder: boolean;
}

export const getReminderSettings = async (): Promise<ReminderSettings> => {
  const response = await authenticatedGet("/notifications/reminders/me");
  return response?.data ?? response ?? {};
};

export const updateReminderSettings = async (
  data: Partial<ReminderSettings>,
): Promise<ReminderSettings> => {
  const response = await authenticatedPatch("/notifications/reminders/me", data);
  return response?.data ?? response ?? {};
};
