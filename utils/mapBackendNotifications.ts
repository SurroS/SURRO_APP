import { AppNotification } from "@/types/notification";

export const mapBackendNotification = (n: any): AppNotification => ({
  id: n.id,
  title: n.title,
  body: n.body,
  type: n.data?.type ?? "GENERAL",
  role: undefined,
  read: n.read ?? false,
  createdAt: n.createdAt,
  source: "BACKEND",
  data: n.data,
});
