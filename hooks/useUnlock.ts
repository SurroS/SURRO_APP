import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/store/auth";
import {
  getUnlockFee,
  getUnlockStatus,
  createUnlock,
  UnlockFeeResponse,
} from "@/services/unlockApi";

const DEV_SKIP_PAYMENT = false;

const globalProcessingMap = new Map<string, boolean>();

interface UseUnlockOptions {
  targetUserId: string | null | undefined;
  targetRole?: string;
}

export interface UnlockResult {
  success: boolean;
  error?: string;
  unlockedByOther?: boolean;
  version?: number;
}

interface UseUnlockReturn {
  isUnlocked: boolean;
  isProcessing: boolean;
  isLoading: boolean;
  unlockedByOther: boolean;
  fee: UnlockFeeResponse | null;
  expiresAt: string | null;
  error: string | null;
  version: number | null;
  unlock: () => Promise<UnlockResult>;
  refresh: () => Promise<void>;
}

export function useUnlock({
  targetUserId,
  targetRole,
}: UseUnlockOptions): UseUnlockReturn {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedByOther, setUnlockedByOther] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fee, setFee] = useState<UnlockFeeResponse | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState<number | null>(null);

  const { user, token } = useAuthStore();
  const isProcessingRef = useRef(false);
  const targetUserIdRef = useRef(targetUserId);

  useEffect(() => {
    targetUserIdRef.current = targetUserId;
  }, [targetUserId]);

  const acquireGlobalLock = useCallback((): boolean => {
    const key = targetUserIdRef.current;
    if (!key) return false;
    if (globalProcessingMap.get(key)) return false;
    globalProcessingMap.set(key, true);
    return true;
  }, []);

  const releaseGlobalLock = useCallback(() => {
    const key = targetUserIdRef.current;
    if (key) globalProcessingMap.delete(key);
  }, []);

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

      if (statusResult.unlockedBy) {
        setUnlockedByOther(statusResult.unlockedBy !== user?.userId);
      }
      if (statusResult.version != null) {
        setVersion(statusResult.version);
      }
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
  }, [targetUserId, targetRole, user?.userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const unlock = useCallback(async (): Promise<UnlockResult> => {
    if (DEV_SKIP_PAYMENT) {
      setIsUnlocked(true);
      setUnlockedByOther(false);
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

    if (!acquireGlobalLock()) {
      return {
        success: false,
        error: "Another unlock is in progress for this profile",
      };
    }

    isProcessingRef.current = true;
    setIsProcessing(true);
    setError(null);

    try {
      const result = await createUnlock(targetUserId);

      setIsUnlocked(true);
      setUnlockedByOther(false);

      if (result.unlock.version != null) {
        setVersion(result.unlock.version);
      }
      if (result.unlock.expiresAt) {
        setExpiresAt(result.unlock.expiresAt);
      } else {
        setExpiresAt(
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        );
      }

      return {
        success: true,
        version: result.unlock.version,
        unlockedByOther: !!result.unlockedByOther,
      };
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
        setIsUnlocked(true);
        setUnlockedByOther(true);

        const conflictData = err?.details;
        if (conflictData?.version != null) {
          setVersion(conflictData.version);
        }
        if (conflictData?.expiresAt) {
          setExpiresAt(conflictData.expiresAt);
        } else {
          setExpiresAt(
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          );
        }

        return {
          success: true,
          unlockedByOther: true,
          error: "This profile has already been unlocked by another user",
        };
      }

      setError(message);
      return {
        success: false,
        error: isInsufficient ? "Insufficient balance" : message,
      };
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
      releaseGlobalLock();
    }
  }, [targetUserId, user, fee, isUnlocked, token, acquireGlobalLock, releaseGlobalLock]);

  return {
    isUnlocked,
    isProcessing,
    isLoading,
    unlockedByOther,
    fee,
    expiresAt,
    error,
    version,
    unlock,
    refresh,
  };
}
