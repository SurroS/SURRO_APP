import { create } from "zustand";
import { AppNotification } from "./types";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

type NotificationStore = {
  notifications: AppNotification[];
  selected: string[];

  addLocal: (
    n: Omit<AppNotification, "id" | "read" | "createdAt" | "source">
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

  addLocal: (n) =>
    set((state) => ({
      notifications: [
        {
          ...n,
          id: generateId(),
          read: false,
          source: "LOCAL",
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

  selectAll: () => ({
    selected: get().notifications.map((n) => n.id),
  }),

  clearSelection: () => ({ selected: [] }),
}));
