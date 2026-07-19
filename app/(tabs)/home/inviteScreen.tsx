import { ScreenHeader } from "@/components/auth";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text, XStack, YStack, View } from "tamagui";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

import { useAuth } from "@/hooks/useAuth";
import { fetchReferrals, redeemReferralRewards } from "@/services/referralApi";
import { useWalletStore } from "@/store/wallet/walletStore";
import colors from "@/hooks/colors";

const whatsapp = require("@/assets/images/whatsapp.png");
const xIcon = require("@/assets/images/x_icon.png");
const facebook = require("@/assets/images/facebook.png");
const mail = require("@/assets/images/mail.png");

const REFERRAL_REWARD_AMOUNT = 1000;

export default function InviteScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const fetchWallet = useWalletStore((s) => s.fetchWallet);

  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  const referralCode = user?.referralCode;

  const inviteLink = referralCode
    ? `https://surrosantara.com/invite/${referralCode}`
    : "";

  const inviteMessage = useMemo(() => {
    if (!inviteLink) return "";
    return `Join SurroSantara using my referral link:
${inviteLink}

Referral code: ${referralCode}`;
  }, [inviteLink, referralCode]);

  // Load referrals from API
  const loadReferrals = useCallback(async () => {
    try {
      setLoadingReferrals(true);
      const data = await fetchReferrals();
      setReferrals(data);
    } catch (err: any) {
      console.error("[InviteScreen] Failed to load referrals:", err);
      // Fall back to hasReferred from user profile if API fails
      if (user?.hasReferred?.length) {
        setReferrals(user.hasReferred);
      }
    } finally {
      setLoadingReferrals(false);
    }
  }, [user?.hasReferred]);

  useEffect(() => {
    loadReferrals();
  }, [loadReferrals]);

  // Only pending/qualified referrals count toward redeemable rewards
  const pendingReferrals = referrals.filter(
    (r) => r.status === "PENDING" || r.status === "QUALIFIED"
  );
  const qualifiedReferrals = referrals.filter(
    (r) => r.status === "QUALIFIED"
  );
  const totalAmount = qualifiedReferrals.length * REFERRAL_REWARD_AMOUNT;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(inviteMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    Toast.show({
      text1: "referal code copied",
      type: "customSuccess" as ToastType,
    });
  };

  const handleShare = (mode: "whatsapp" | "facebook" | "mail" | "x") => {
    const encoded = encodeURIComponent(inviteMessage);
    if (mode === "whatsapp") {
      Linking.openURL(`whatsapp://send?text=${encoded}`);
    }
    if (mode === "facebook") {
      Linking.openURL(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          inviteLink
        )}`
      );
    }
    if (mode === "mail") {
      Linking.openURL(`mailto:?subject=Join SurroSantara&body=${encoded}`);
    }
    if (mode === "x") {
      Linking.openURL(`https://twitter.com/intent/tweet?text=${encoded}`);
    }
  };

  const howItWorks = useMemo(() => {
    if (user?.role === "AGENT") {
      return [
        "Invite professionals or intended parents.",
        "They register using your referral link.",
        `They complete any of the following qualifying action to unlock your reward.
        \n* Subscribe to a package.
        \n* Boost their profile
        \n* Makes a purchase on the platform.`,
        "You earn referral rewards.",
      ];
    }

    if (user?.role === "INTENDED_PARENT") {
      return [
        "Invite friends or professionals.",
        "They sign up and verify.",
        `They complete any of the following qualifying action to unlock your reward.
        \n* Subscribe to a package.
        \n* Boost their profile
        \n* Makes a purchase on the platform.`,
        "You receive a referral reward.",
      ];
    }

    return [
      "Invite someone interested in surrogacy.",
      "They register and verify their account.",
      `They complete any of the following qualifying action to unlock your reward.
        \n* Subscribe to a package.
        \n* Boost their profile
        \n* Makes a purchase on the platform.`,
      "You receive your referral reward.",
    ];
  }, [user]);

  const handleRedeemToWallet = async () => {
    if (qualifiedReferrals.length === 0) {
      Toast.show({
        text1: "No redeemable referrals",
        type: "customWarning" as ToastType,
        text2: "Wait for your referrals to complete qualifying actions.",
      });
      return;
    }

    try {
      setRedeeming(true);
      const result = await redeemReferralRewards();
      await fetchWallet();
      setRedeemOpen(false);
      Toast.show({
        text1: "Rewards redeemed!",
        type: "customSuccess" as ToastType,
        text2: `₦${result.creditedAmount.toLocaleString()} credited to your wallet`,
      });
      loadReferrals();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to redeem at this time";
      Toast.show({
        text1: "Redeem failed",
        type: "customError" as ToastType,
        text2: message,
      });
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
      >
        <View marginVertical={20}>
          <ScreenHeader
            title="Refer a Friend"
            onBackPress={() => router.back()}
          />
        </View>

        <XStack gap="$10" marginBottom={24}>
          <Image
            source={require("@/assets/images/gift.png")}
            style={{ width: 100, height: 100 }}
          />

          <YStack flex={1} justifyContent="center" gap={8}>
            <Text fontSize={20} fontWeight="800" color="#0E0E55">
              Invite & Earn Rewards
            </Text>
            <Button
              backgroundColor={colors.primary}
              borderRadius={12}
              onPress={() => setRedeemOpen(true)}
            >
              <Text fontWeight="600">Redeem</Text>
            </Button>
          </YStack>
        </XStack>

        <Text color={colors.text} fontWeight="700" marginBottom={10}>
          Share via
        </Text>

        <XStack justifyContent="space-around">
          {([
            { key: "whatsapp" as const, icon: whatsapp, label: "WhatsApp" },
            { key: "x" as const, icon: xIcon, label: "X" },
            { key: "facebook" as const, icon: facebook, label: "Facebook" },
            { key: "mail" as const, icon: mail, label: "Mail" },
          ] as const).map(({ key, icon, label }) => (
            <Pressable
              key={key}
              style={styles.pressable}
              onPress={() => handleShare(key)}
            >
              <Image source={icon} style={styles.socialIcon} />
              <Text color={colors.text} fontSize={13}>
                {label}
              </Text>
            </Pressable>
          ))}
        </XStack>

        <YStack marginTop={30} gap={12}>
          <Text color={colors.text} fontSize={16} fontWeight="800">
            How it works
          </Text>

          {howItWorks.map((step, idx) => (
            <XStack key={idx} gap={10}>
              <View
                width={24}
                height={24}
                borderRadius={12}
                backgroundColor="#0E0E55"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="#fff">{idx + 1}</Text>
              </View>
              <Text color={colors.text} flex={1}>
                {step}
              </Text>
            </XStack>
          ))}
        </YStack>

        <Button
          backgroundColor={colors.primary}
          borderRadius={12}
          marginTop={25}
          onPress={handleCopy}
        >
          <Text fontWeight="600">{copied ? "Copied!" : "Copy Invite"}</Text>
        </Button>
      </ScrollView>

      <Modal
        visible={redeemOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setRedeemOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setRedeemOpen(false)}
        />

        <View style={[styles.bottomSheet, { paddingBottom: 20 + insets.bottom }]}>
          <Text
            color={colors.text}
            fontSize={18}
            fontWeight="800"
            marginBottom={10}
          >
            Redeem Earnings
          </Text>

          <Text fontSize={16} fontWeight="700" color={colors.primary}>
            Total: ₦{totalAmount.toLocaleString()}
          </Text>
          <Text fontSize={12} color="#888" marginBottom={12}>
            {qualifiedReferrals.length} qualified referral
            {qualifiedReferrals.length !== 1 ? "s" : ""} · ₦
            {REFERRAL_REWARD_AMOUNT.toLocaleString()} each
          </Text>

          {loadingReferrals ? (
            <YStack padding={20} alignItems="center">
              <ActivityIndicator size="small" color="#0E0E55" />
            </YStack>
          ) : (
            <YStack marginTop={8} gap={8} maxHeight={240}>
              {pendingReferrals.length === 0 ? (
                <Text color={colors.text} alignSelf="center" marginVertical={12}>
                  No pending referrals
                </Text>
              ) : (
                pendingReferrals.map((ref: any, index: number) => (
                  <View
                    key={ref.id ?? index}
                    padding={12}
                    borderRadius={10}
                    backgroundColor={ref.status === "QUALIFIED" ? "#E8F5E9" : "#F5F5F5"}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text color={colors.text}>{ref.userName || ref.email || "Unknown"}</Text>
                    <View
                      paddingHorizontal={8}
                      paddingVertical={2}
                      borderRadius={8}
                      backgroundColor={
                        ref.status === "QUALIFIED" ? "#22C55E" : "#F59E0B"
                      }
                    >
                      <Text color="#fff" fontSize={11} fontWeight="600">
                        {ref.status === "QUALIFIED" ? "Ready" : "Pending"}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </YStack>
          )}

          <Button
            backgroundColor={colors.primary}
            borderRadius={12}
            marginTop={16}
            disabled={redeeming || qualifiedReferrals.length === 0}
            opacity={qualifiedReferrals.length === 0 ? 0.5 : 1}
            onPress={handleRedeemToWallet}
          >
            <Text fontWeight="600">
              {redeeming
                ? "Processing..."
                : `Redeem ₦${totalAmount.toLocaleString()}`}
            </Text>
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  socialIcon: { width: 30, height: 30, marginBottom: 4 },
  pressable: { alignItems: "center" },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
