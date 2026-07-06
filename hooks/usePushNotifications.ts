import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { registerPushToken } from "@/services/notificationApi";
import { useAuthStore } from "@/store/auth";

let Device: { isDevice: boolean } | null = null;
try {
  Device = require("expo-device");
} catch {
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
        registerPushToken(token, Platform.OS.toUpperCase() as "ANDROID" | "IOS").catch((err) =>
          console.error("[PushNotifications] Failed to register token:", err),
        );
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as
          | { screen?: string }
          | undefined;
        if (data?.screen === "AdWatchScreen") {
          router.push("/adsWatchScreen");
        } else if (data?.screen === "BoostScreen") {
          router.push("/boostScreen");
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [isAuthenticated]);

  return { expoPushToken };
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Device && !Device.isDevice) {
    return null;
  }

  const existingStatus = (await Notifications.getPermissionsAsync()).status;
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    finalStatus = (await Notifications.requestPermissionsAsync()).status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    console.log("[PushNotifications] Expo push token:", tokenData.data);
    return tokenData.data;
  } catch (err: any) {
    if (err?.message?.includes("FirebaseApp is not initialized")) {
      console.warn("[PushNotifications] Firebase not configured — add google-services.json for Android push");
    } else {
      console.error("[PushNotifications] Error getting token:", err);
    }
    return null;
  }
}
