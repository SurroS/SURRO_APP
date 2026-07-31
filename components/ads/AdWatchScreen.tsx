import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Linking,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import colors from "@/hooks/colors";
import {
  getCurrentAd,
  claimAdReward,
  sendAdAnalytics,
  getDailyAdStats,
} from "@/services/adApi";

type ScreenState =
  | "loading"
  | "watching"
  | "claimable"
  | "claimed"
  | "done"
  | "limit_reached";

export default function AdWatchScreen() {
  const [ad, setAd] = useState<any>(null);
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [timer, setTimer] = useState(15);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [claiming, setClaiming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadAd();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadAd = async () => {
    try {
      setScreenState("loading");
      const stats = await getDailyAdStats();
      setDailyStats(stats);

      if (stats.adsWatchedToday >= stats.dailyMax) {
        setScreenState("limit_reached");
        return;
      }

      const currentAd = await getCurrentAd();
      if (!currentAd) {
        setScreenState("done");
        return;
      }

      setAd(currentAd);
      setRewardAmount(currentAd.rewardAmount);
      setTimer(15);
      setScreenState("watching");

      sendAdAnalytics(currentAd.id, "view").catch(() => {});

      startTimer();
    } catch {
      setScreenState("done");
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setScreenState("claimable");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLearnMore = () => {
    if (ad?.linkUrl) {
      sendAdAnalytics(ad.id, "click").catch(() => {});
      Linking.openURL(ad.linkUrl);
    }
  };

  const handleClaim = async () => {
    if (!ad || claiming) return;
    setClaiming(true);
    try {
      setScreenState("claimed");
      const result = await claimAdReward(ad.id);
      setRewardAmount(result.rewardAmount);

      sendAdAnalytics(ad.id, "claim").catch(() => {});

      const updatedStats = await getDailyAdStats();
      setDailyStats(updatedStats);
    } catch {
      setScreenState("claimable");
    } finally {
      setClaiming(false);
    }
  };

  const handleWatchAnother = () => {
    loadAd();
  };

  const handleDone = () => {
    router.back();
  };

  const renderWatching = () => (
    <View style={styles.content}>
      {ad?.imageUrl && (
        <Image
          source={{ uri: ad.imageUrl }}
          style={styles.adImage}
          resizeMode="contain"
        />
      )}

      <View style={styles.timerContainer}>
        <View style={styles.timerCircle}>
          <Text style={styles.timerText}>{timer}s</Text>
        </View>
        <Text style={styles.timerLabel}>Watch ad to earn</Text>
        <Text style={styles.rewardText}>+₦{ad?.rewardAmount ?? 0}</Text>
      </View>

      {ad?.linkUrl && (
        <TouchableOpacity onPress={handleLearnMore} activeOpacity={0.7}>
          <Text style={styles.learnMore}>Learn More →</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderClaimable = () => (
    <View style={styles.content}>
      {ad?.imageUrl && (
        <Image
          source={{ uri: ad.imageUrl }}
          style={styles.adImage}
          resizeMode="contain"
        />
      )}

      <View style={styles.claimContainer}>
        <Text style={styles.claimTitle}>Ad complete!</Text>
        <Text style={styles.rewardText}>+₦{rewardAmount}</Text>

        <TouchableOpacity
          style={[styles.claimButton, claiming && { opacity: 0.7 }]}
          onPress={handleClaim}
          activeOpacity={0.8}
          disabled={claiming}
        >
          {claiming ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.claimButtonText}>Claim Reward</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderClaimed = () => (
    <View style={styles.content}>
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>🎉</Text>
        <Text style={styles.successTitle}>+₦{rewardAmount} earned!</Text>
        {dailyStats && (
          <Text style={styles.successSubtext}>
            {dailyStats.adsWatchedToday}/{dailyStats.dailyMax} ads today
          </Text>
        )}

        <View style={styles.successActions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleWatchAnother}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Watch Another</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleDone}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderLimitReached = () => (
    <View style={styles.content}>
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>🎉</Text>
        <Text style={styles.successTitle}>Daily limit reached</Text>
        <Text style={styles.successSubtext}>
          You've watched all available ads today. Come back tomorrow for more!
        </Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading ad...</Text>
    </View>
  );

  const renderDone = () => (
    <View style={styles.content}>
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>📺</Text>
        <Text style={styles.successTitle}>No ads available</Text>
        <Text style={styles.successSubtext}>Check back later for new ads!</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDone} style={styles.backButton}>
          <Entypo name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Watch & Earn</Text>
        <View style={styles.backButton} />
      </View>

      <SafeAreaView style={styles.safeContent}>
        {screenState === "loading" && renderLoading()}
        {screenState === "watching" && renderWatching()}
        {screenState === "claimable" && renderClaimable()}
        {screenState === "claimed" && renderClaimed()}
        {screenState === "limit_reached" && renderLimitReached()}
        {screenState === "done" && renderDone()}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 8 : 56,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  adImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 24,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  timerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
  },
  timerLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
  },
  learnMore: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  claimContainer: {
    alignItems: "center",
  },
  claimTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  claimButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  successContainer: {
    alignItems: "center",
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  successActions: {
    marginTop: 32,
    gap: 12,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
});
