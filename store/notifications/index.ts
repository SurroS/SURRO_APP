import { create } from "zustand";
import { AppNotification } from "./types";
import { getNotifications, BackendNotification } from "@/services/notificationApi";

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
    console.log("[Notif] addLocal:", { id, title: n.title, type: n.type, role: n.role });
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
    console.log("[Notif] fetchNotifications: start");
    set({ isLoadingNotifications: true });
    try {
      const backend = await getNotifications();
      const mapped = backend.map(mapBackendNotification);
      console.log("[Notif] fetchNotifications: mapped", mapped.length, "notifications");
      set({ notifications: mapped, isLoadingNotifications: false });
    } catch (err) {
      console.log("[Notif] fetchNotifications: error", err);
      set({ isLoadingNotifications: false });
    }
  },

  markRead: (id) => {
    console.log("[Notif] markRead:", id);
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  deleteNotification: (id) => {
    console.log("[Notif] deleteNotification:", id);
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
      selected: state.selected.filter((s) => s !== id),
    }));
  },

  selectNotification: (id) =>
    set((state) => {
      if (state.selected.includes(id)) return {};
      console.log("[Notif] selectNotification:", id);
      return { selected: [...state.selected, id] };
    }),

  deselectNotification: (id) => {
    console.log("[Notif] deselectNotification:", id);
    set((state) => ({
      selected: state.selected.filter((s) => s !== id),
    }));
  },

  selectAll: () => {
    const ids = get().notifications.map((n) => n.id);
    console.log("[Notif] selectAll:", ids.length);
    return { selected: ids };
  },

  clearSelection: () => {
    console.log("[Notif] clearSelection");
    return { selected: [] };
  },
}));
