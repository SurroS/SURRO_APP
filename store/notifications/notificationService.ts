import * as Notifications from "expo-notifications";
import { useNotificationStore } from "@/store/notifications";
import { AppNotification } from "./types";

export const initSystemNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      // Required (newer Expo)
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,

      // Optional but expected
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

export const pushNotification = async (
  notification: Omit<AppNotification, "id" | "read" | "createdAt" | "source">
) => {
  // In-app
  useNotificationStore.getState().addLocal(notification);

  // System
  await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      sound: true,
    },
    trigger: null,
  });
};
