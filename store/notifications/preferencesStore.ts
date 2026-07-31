import { create } from "zustand";
import { getNotificationPreferences } from "@/services/notificationApi";
import { NotificationPreferences } from "@/services/notificationApi";

interface NotificationPreferencesState {
  preferences: NotificationPreferences | null;
  loaded: boolean;
  load: () => Promise<void>;
}

export const useNotificationPreferences = create<NotificationPreferencesState>((set) => ({
  preferences: null,
  loaded: false,
  load: async () => {
    try {
      const prefs = await getNotificationPreferences();
      set({ preferences: prefs, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },
}));
