import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import {
  getUnlockFee,
  getUnlockStatus,
  createUnlock,
  UnlockFeeResponse,
} from "@/services/unlockApi";

const DEV_SKIP_PAYMENT = false;

interface UseUnlockOptions {
  targetUserId: string | null | undefined;
  targetRole?: string;
}

interface UseUnlockReturn {
  isUnlocked: boolean;
  isProcessing: boolean;
  isLoading: boolean;
  fee: UnlockFeeResponse | null;
  expiresAt: string | null;
  error: string | null;
  unlock: () => Promise<{ success: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

export function useUnlock({
  targetUserId,
  targetRole,
}: UseUnlockOptions): UseUnlockReturn {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fee, setFee] = useState<UnlockFeeResponse | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { user, token } = useAuthStore();
  const isProcessingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (!targetUserId) {
      setIsLoading(false);
      return;
    }

    if (DEV_SKIP_PAYMENT) {
      setIsUnlocked(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [statusResult, feeResult] = await Promise.all([
        getUnlockStatus(targetUserId),
        targetRole ? getUnlockFee(targetRole) : Promise.resolve(null),
      ]);

      setIsUnlocked(statusResult.unlocked);
      if (statusResult.expiresAt) {
        setExpiresAt(statusResult.expiresAt);
      }
      if (feeResult) {
        setFee(feeResult);
      }
    } catch (err: any) {
      console.error("[useUnlock] Failed to load unlock data:", err);
      setError(err?.message || "Failed to load unlock data");
    } finally {
      setIsLoading(false);
    }
  }, [targetUserId, targetRole]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const unlock = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (DEV_SKIP_PAYMENT) {
      setIsUnlocked(true);
      setExpiresAt(
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      );
      return { success: true };
    }

    if (!targetUserId || !user || !fee) {
      return { success: false, error: "Missing required data" };
    }

    if (isProcessingRef.current) {
      return { success: false, error: "Already processing" };
    }
    if (isUnlocked) return { success: false, error: "Already unlocked" };

    isProcessingRef.current = true;
    setIsProcessing(true);
    setError(null);

    try {
      console.log("[useUnlock] Creating unlock (server handles payment)...", {
        userId: user.id,
        targetUserId,
        targetRole,
        feeAmount: fee.amount,
        feeCurrency: fee.currency,
      });

      await createUnlock(targetUserId, targetRole);
      console.log("[useUnlock] Unlock created successfully");

      setIsUnlocked(true);
      setExpiresAt(
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      );

      return { success: true };
    } catch (err: any) {
      const rawMessage =
        err?.details?.message ?? err?.message ?? null;
      const message =
        typeof rawMessage === "string" ? rawMessage : "Unlock failed";
      const isInsufficient =
        message.toLowerCase().includes("insufficient") ||
        message.toLowerCase().includes("balance");

      console.error("[useUnlock] Unlock failed:", {
        message,
        rawMessage,
        details: err?.details,
        status: err?.status,
        code: err?.code,
      });

      if (err?.status === 409) {
        console.log("[useUnlock] Unlock already exists, treating as success");
        setIsUnlocked(true);
        setExpiresAt(
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        );
        return { success: true };
      }

      setError(message);
      return {
        success: false,
        error: isInsufficient ? "Insufficient balance" : message,
      };
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [targetUserId, user, fee, isUnlocked, token]);

  return {
    isUnlocked,
    isProcessing,
    isLoading,
    fee,
    expiresAt,
    error,
    unlock,
    refresh,
  };
}
