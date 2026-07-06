import { ScreenHeader } from "@/components/auth";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Text, XStack, YStack, View } from "tamagui";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

import { useAuth } from "@/hooks/useAuth";
import { useWalletStore } from "@/store/wallet/walletStore";
import colors from "@/hooks/colors";
import { fundWallet } from "@/services/walletApi";

const whatsapp = require("@/assets/images/whatsapp.png");
const xIcon = require("@/assets/images/x_icon.png");
const facebook = require("@/assets/images/facebook.png");
const mail = require("@/assets/images/mail.png");

export default function InviteScreen() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { credit, loading } = useWalletStore();

  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);

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

  const notRedeemed = user?.referral?.notRedeemed ?? ["@Prime", "@Stupenia"];

  const REFERRAL_REWARD_AMOUNT = 1000;
  const totalAmount = notRedeemed.length * REFERRAL_REWARD_AMOUNT;

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

  const [redeeming, setRedeeming] = useState(false);

  const handleRedeemToWallet = async () => {
    if (!user?.id) {
      Toast.show({
        text1: "User not authenticated",
        type: "customError" as ToastType,
        text2: "please try to login again.",
      });
      return;
    }

    try {
      setRedeeming(true);

      await fundWallet(user.id, totalAmount, user?.token, {
        description: `Referral rewards (${notRedeemed.length} referrals)`,
        currency: user.wallet.currency,
      });
      Toast.show({
        text1: "Unable to Redeem at this time",
        type: "customSuccess" as ToastType,
        text2: "`₦${totalAmount.toLocaleString()} credited to your wallet`",
      });
    } catch (error: any) {
      Toast.show({
        text1: "Unable to Redeem at this time",
        type: "customError" as ToastType,
        text2: "Please try again soon.",
      });
      console.log("error reedeming [Refferal] :", error);
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
          {[
            { key: "whatsapp", icon: whatsapp, label: "WhatsApp" },
            { key: "x", icon: xIcon, label: "X" },
            { key: "facebook", icon: facebook, label: "Facebook" },
            { key: "mail", icon: mail, label: "Mail" },
          ].map(({ key, icon, label }) => (
            <Pressable
              key={key}
              style={styles.pressable}
              onPress={() => handleShare(key as any)}
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

          <YStack marginTop={16} gap={8}>
            {notRedeemed.length === 0 ? (
              <Text color={colors.text} alignSelf="center">
                No pending referrals
              </Text>
            ) : (
              notRedeemed.map((userName: string, index: number) => (
                <View
                  key={index}
                  padding={12}
                  borderRadius={10}
                  backgroundColor="#F5F5F5"
                >
                  <Text color={colors.text}>{userName}</Text>
                </View>
              ))
            )}
          </YStack>

          <Button
            backgroundColor={colors.primary}
            borderRadius={12}
            disabled={redeeming}
            onPress={handleRedeemToWallet}
          >
            <Text fontWeight="600">
              {redeeming ? "Processing..." : "Redeem to Wallet"}
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
