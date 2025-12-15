import { create } from "zustand";

/* ---------------------------------- */
/* Types */
/* ---------------------------------- */

export type NotificationType =
  | "GENERAL"
  | "PROFILE_SETUP"
  | "PROFILE_VIEWS"
  | "PAYMENT"
  | "REFERRAL"
  | "SURROGATE_BOOST"
  | "KYC"
  | "PROFILE_BOOST";

export type Notification = {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  role?: "SURROGATE" | "INTENDED_PARENT" | "AGENT" | "ALL";
  read: boolean;
  createdAt: number;
};

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/* ---------------------------------- */
/* Store */
/* ---------------------------------- */

type NotificationStore = {
  notifications: Notification[];
  selected: string[];

  addLocal: (
    n: Omit<Notification, "id" | "read" | "createdAt">
  ) => void;

  markRead: (id: string) => void;
  deleteNotification: (id: string) => void;

  selectNotification: (id: string) => void;
  deselectNotification: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  selected: [],

  /* ---------- CRUD ---------- */

  addLocal: (n) =>
    set((state) => ({
      notifications: [
        {
          ...n,
          id: generateId(),
          read: false,
          createdAt: Date.now(),
        },
        ...state.notifications,
      ],
    })),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      selected: state.selected.filter((s) => s !== id),
    })),

  /* ---------- Selection ---------- */

  selectNotification: (id) =>
    set((state) =>
      state.selected.includes(id)
        ? {}
        : { selected: [...state.selected, id] }
    ),

  deselectNotification: (id) =>
    set((state) => ({
      selected: state.selected.filter((s) => s !== id),
    })),

  selectAll: () =>
    set(() => ({
      selected: get().notifications.map((n) => n.id),
    })),

  clearSelection: () => set({ selected: [] }),
}));
