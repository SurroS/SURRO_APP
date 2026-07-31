import { create } from "zustand";
import { AppNotification } from "./types";
import {
  getNotifications,
  BackendNotification,
  markNotificationRead as apiMarkRead,
  deleteNotification as apiDeleteNotification,
} from "@/services/notificationApi";

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const mapBackendNotification = (n: BackendNotification): AppNotification => ({
  id: n.id,
  title: n.title,
  body: n.message,
  type: n.type as AppNotification["type"],
  source: "SYSTEM" as const,
  read: n.isRead,
  createdAt: new Date(n.createdAt).getTime(),
});

type NotificationStore = {
  notifications: AppNotification[];
  selected: string[];
  isLoadingNotifications: boolean;

  addLocal: (
    n: Omit<AppNotification, "id" | "read" | "createdAt" | "source">
  ) => void;

  fetchNotifications: () => Promise<void>;
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
  isLoadingNotifications: false,

  addLocal: (n) => {
    const id = generateId();
    set((state) => ({
      notifications: [
        {
          ...n,
          id,
          read: false,
          source: "LOCAL",
          createdAt: Date.now(),
        },
        ...state.notifications,
      ],
    }));
  },

  fetchNotifications: async () => {
    set({ isLoadingNotifications: true });
    try {
      const backend = await getNotifications();
      const mapped = Array.isArray(backend) ? backend.map(mapBackendNotification) : [];
      set({ notifications: mapped, isLoadingNotifications: false });
    } catch (err) {
      set({ isLoadingNotifications: false });
    }
  },

  markRead: async (id) => {
    try {
      await apiMarkRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (err) {
    }
  },

  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      selected: state.selected.filter((s) => s !== id),
    }));
    apiDeleteNotification(id).catch((err) => { });
  },

  selectNotification: (id) =>
    set((state) => {
      if (state.selected.includes(id)) return {};
      return { selected: [...state.selected, id] };
    }),

  deselectNotification: (id) => {
    set((state) => ({
      selected: state.selected.filter((s) => s !== id),
    }));
  },

  selectAll: () => {
    const ids = get().notifications.map((n) => n.id);
    set({ selected: ids });
  },

  clearSelection: () => {
    set({ selected: [] });
  },
}));
