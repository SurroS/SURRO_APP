import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useNotificationStore } from "@/store/notifications";
import { AppNotification } from "./types";

const NOTIFICATION_CHANNEL = "default";

export const initSystemNotifications = async () => {
  console.log("[Notif] initSystemNotifications: requesting permission...");
  const { status } = await Notifications.requestPermissionsAsync();
  console.log("[Notif] Permission status:", status);
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
    console.log("[Notif] Android notification channel created");
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
  console.log("[Notif] Notification handler registered");
};

export const pushNotification = async (
  notification: Omit<AppNotification, "id" | "read" | "createdAt" | "source">
) => {
  console.log("[Notif] pushNotification:", JSON.stringify(notification));

  // In-app
  useNotificationStore.getState().addLocal(notification);
  console.log("[Notif] In-app notification added");

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
  console.log("[Notif] System notification scheduled");
};
