import { getLastActive } from "@/hooks/useAppActivity";
import { pushNotification } from "./notificationService";

const INACTIVITY_DAYS = 3;

export const checkInactivity = async () => {
  const last = await getLastActive();
  if (!last) {
    return;
  }

  const diffDays =
    (Date.now() - last) / (1000 * 60 * 60 * 24);

  if (diffDays >= INACTIVITY_DAYS) {
    await pushNotification({
      title: "We haven't seen you in a while",
      body: "Open the app to continue where you left off.",
      type: "INACTIVITY",
      role: "ALL",
    });
  }
};
