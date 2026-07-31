import type { AppNotification } from "@/store/notifications/types";

export const notifications: AppNotification[] = [
  {
    id: "1",
    title: "Profile setup",
    body: "You need to update your profile information",
    type: "PROFILE_SETUP",
    source: "LOCAL",
    read: false,
    createdAt: Date.now(),
  },
  {
    id: "2",
    title: "Message",
    body: "You have 1 unread message",
    type: "GENERAL",
    source: "LOCAL",
    read: false,
    createdAt: Date.now(),
  },
  {
    id: "3",
    title: "Profile setup",
    body: "You have successfully set up your profile",
    type: "PROFILE_SETUP",
    source: "LOCAL",
    read: false,
    createdAt: Date.now(),
  },
  {
    id: "4",
    title: "Profile views",
    body: "Your profile was viewed once today",
    type: "PROFILE_VIEWS",
    source: "LOCAL",
    read: false,
    createdAt: Date.now(),
  },
];
