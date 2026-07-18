import { GetAllChat } from "@/services/chatApi";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chatStore";
import { useNotificationStore } from "@/store/notifications";
import { useWalletStore } from "@/store/wallet/walletStore";

let _bootstrapped = false;

export async function bootstrapApp() {
  if (_bootstrapped) return;
  _bootstrapped = true;

  const user = useAuthStore.getState().user;
  if (!user) return;

  const promises: Promise<void>[] = [];

  // Chat conversations + unread count for tab badge
  promises.push(
    GetAllChat().then((result) => {
      if (Array.isArray(result)) {
        useChatStore.getState().setConversations(result);
        const total = result.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);
        useAuthStore.getState().setChatUnreadCount(total);
      }
    }).catch(() => {}),
  );

  // Notifications for bell badge
  promises.push(
    useNotificationStore.getState().fetchNotifications().catch(() => {}),
  );

  // Wallet balance
  promises.push(
    useWalletStore.getState().fetchWallet().catch(() => {}),
  );

  await Promise.allSettled(promises);
}

export function resetBootstrap() {
  _bootstrapped = false;
}
