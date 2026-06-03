import { getLastActive } from "@/hooks/useAppActivity";
import { pushNotification } from "./notificationService";

const INACTIVITY_DAYS = 3;

export const checkInactivity = async () => {
  const last = await getLastActive();
  console.log("[Notif] checkInactivity: lastActive =", last);
  if (!last) {
    console.log("[Notif] checkInactivity: no last active timestamp, skipping");
    return;
  }

  const diffDays =
    (Date.now() - last) / (1000 * 60 * 60 * 24);
  console.log("[Notif] checkInactivity: diffDays =", diffDays.toFixed(2));

  if (diffDays >= INACTIVITY_DAYS) {
    console.log("[Notif] checkInactivity: inactivity threshold reached, sending notification");
    await pushNotification({
      title: "We haven't seen you in a while",
      body: "Open the app to continue where you left off.",
      type: "INACTIVITY",
      role: "ALL",
    });
  } else {
    console.log("[Notif] checkInactivity: within threshold, no notification needed");
  }
};
