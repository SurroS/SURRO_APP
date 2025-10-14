import type { Notification } from "@/components/notifications/NotificationItem";

export const notifications: Notification[] = [
  {
    id: "1",
    type: "profile",
    title: "Profile setup",
    message: "You need to update your profile information",
    time: "1hr",
  },
  {
    id: "2",
    type: "message",
    title: "Message",
    message: "You have 1 unread message",
    time: "1hr",
  },
  {
    id: "3",
    type: "profileSetup",
    title: "Profile setup",
    message: "You have successfully set up your profile",
    time: "1hr",
  },
  {
    id: "4",
    type: "views",
    title: "Profile views",
    message: "Your profile was viewed once today",
    time: "1hr",
  },
];
