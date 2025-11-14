import { useAuthStore } from "@/store/auth/index";

export function useAuthHydration() {
  return useAuthStore((state) => state.hasHydrated);
}
