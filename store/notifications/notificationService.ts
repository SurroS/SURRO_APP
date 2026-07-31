import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useNotificationStore } from "@/store/notifications";
import { AppNotification } from "./types";

const NOTIFICATION_CHANNEL = "default";

export const initSystemNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("[Notif] Permission not granted, skipping handler setup");
    return;
  }

  // Android: create notification channel (required for Android 8+)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL, {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7F",
    });
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
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
      ...(Platform.OS === "android" && { channelId: NOTIFICATION_CHANNEL }),
    },
    trigger: { seconds: 1 },
  });
};
