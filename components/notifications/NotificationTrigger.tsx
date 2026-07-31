// components/notifications/NotificationTriggerWithModal.tsx
import React, { useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/notifications";
import { useAuth } from "@/hooks/useAuth";

export type TriggerNotificationProps = {
  title: string;
  body: string;
  type?: "GENERAL" | "PROFILE_SETUP" | "PROFILE_VIEWS" | "PAYMENT" | "REFERRAL" | "SURROGATE_BOOST" | "KYC" | "PROFILE_BOOST";
  role?: "SURROGATE" | "INTENDED_PARENT" | "AGENT" | "ALL";
  delayMinutes?: number; // minutes
};

const NotificationTriggerWithModal: React.FC<TriggerNotificationProps> = ({
  title,
  body,
  type = "GENERAL",
  role = "ALL",
  delayMinutes = 0,
}) => {
  const addLocal = useNotificationStore((s) => s.addLocal);
  const { user } = useAuth();
  const roleRef = useRef(user?.role?.trim());

  useEffect(() => {
    const delayMs = delayMinutes * 60 * 1000; // convert minutes → milliseconds

    const timeout = setTimeout(() => {
      if (!roleRef.current) return;
      if (role === "ALL" || role === roleRef.current) {
        addLocal({
          title,
          body,
          type,
          role,
        });
      }
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [title, body, type, role, delayMinutes, addLocal]);

  return null; // no UI, just triggers
};

export default NotificationTriggerWithModal;
