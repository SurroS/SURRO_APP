import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button } from "tamagui";
import colors from "@/hooks/colors";
import { ImageCarousel } from "@/components/ImageCarousel";
import { SafeAreaView } from "react-native-safe-area-context";

import { PaymentModal } from "@/components/payment";
import Entypo from "@expo/vector-icons/Entypo";
import BioSection from "@/components/roles/BioSectionView";
import ContactSection from "@/components/roles/ContactSectionView";
import HeaderInfo from "@/components/roles/HeaderInfoSection";
import AgentAdditionalDetails from "@/components/roles/agent/AditionalDetails";
import AgentServices from "@/components/roles/agent/AgentServiceOffered";
import AgentCertifications from "@/components/roles/agent/AgentCertification";
import { resolveProfilePicture } from "@/utils/resolveMediaUrl";
import EmptyWalletModal from "@/components/modals/EmptyWalletModal";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { router, useLocalSearchParams } from "expo-router";
import { getAgentById } from "@/services/profileApi";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet/walletStore";
import { useUnlock } from "@/hooks/useUnlock";

export default function AgentProfileScreen() {
  const params = useLocalSearchParams();
  const id = typeof params?.id === "string" ? params.id : null;
  const fromNetwork = params.fromNetwork === "1";
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { user, token } = useAuthStore();
  const { balance, fetchBalance } = useWalletStore();

  const {
    isUnlocked: unlockStatus,
    isProcessing,
    fee: unlockFee,
    unlock,
  } = useUnlock({
    targetUserId: agent?.userId ?? agent?.id,
    targetRole: "AGENT",
  });

  const isUnlocked = fromNetwork || unlockStatus;
  // -----------------------------
  // Fetch Agent
  // -----------------------------
  useEffect(() => {
    if (!id) return;
    console.log("OtherId from Profile Pre:", id);
    const fetchAgent = async () => {
      try {
        const res = await getAgentById(id as string);
        // Response shapes vary. Extract profile if present.
        const profile = res?.profile ?? res?.data?.profile ?? res?.data ?? res;

        // normalize profilePicture — API may return profilePicture, profilePictureUrl, or avatar
        const rawPic = profile?.profilePicture ?? profile?.profilePictureUrl ?? profile?.avatar ?? "";
        profile.profilePicture = resolveProfilePicture(rawPic) ?? "";
        profile.avatar = profile.profilePicture;

        // normalize gallery entries to string[]
        if (Array.isArray(profile?.gallery)) {
          profile._galleryUrls = profile.gallery
            .map((it: any) => (typeof it === "string" ? it : it?.url || null))
            .filter(Boolean);
        } else {
          profile._galleryUrls = [];
        }

        setAgent(profile);
      } catch (err: any) {
        Toast.show({
          text1: "Failed to load agent",
          type: "customError" as ToastType,
          text2: err?.response?.data?.message || "Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  useEffect(() => {
    if (user) {
      fetchBalance(user.id, token || null);
    }
  }, [user]);

  // -----------------------------
  // Payment Handlers
  // -----------------------------
  const handleTopUp = () => {
    if (isProcessing) return;
    setShowWalletModal(false);
    router.push("/walletFlow");
  };

  const handleChat = () => {
    if (isProcessing) return;
    if (!id) {
      Toast.show({
        text1: "Cannot start chat",
        type: "customError" as ToastType,
        text2: "try again later",
      });
      return;
    }

    router.push({
      pathname: `/(tabs)/chat/conversation`,
      params: {
        otherUserId: agent?.userId,
      },
    });
  };

  const handlePayment = async () => {
    if (isProcessing) return;

    const result = await unlock();
    setShowPaymentModal(false);

    if (result.success) {
      Toast.show({
        text1: "Payment successful",
        type: "customSuccess" as ToastType,
        text2: "You now have full access to this profile",
      });
    } else if (result.error) {
      Toast.show({
        text1: "Payment failed",
        type: "customError" as ToastType,
        text2: result.error,
      });
      if (result.error === "Insufficient balance") {
        setShowWalletModal(true);
      }
    }
  };

  // -----------------------------
  // Loading State
  // -----------------------------
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading agent profile...</Text>
      </View>
    );
  }

  if (!agent) {
    return (
      <View style={styles.loaderContainer}>
        <Text> No Agent found..</Text>
      </View>
    );
  }

  const galleryUrls: string[] = Array.isArray(agent?._galleryUrls)
    ? agent._galleryUrls
    : Array.isArray(agent?.gallery)
    ? agent.gallery.map((g: any) => (typeof g === "string" ? g : g?.url)).filter(Boolean)
    : [];
  const hasGalleryImage = galleryUrls.length > 0 || !!agent?.profilePicture;
  const age = agent?.dateOfBirth
    ? new Date().getFullYear() - new Date(agent.dateOfBirth).getFullYear()
    : "N/A";

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- IMAGE CAROUSEL --- */}
          <View style={styles.carouselContainer}>
            {isUnlocked && hasGalleryImage ? (
              <ImageCarousel images={[...(agent?.profilePicture ? [agent.profilePicture] : []), ...galleryUrls]} unlocked={true} />
            ) : (
              <View style={{ flex: 1, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#666", fontSize: 14 }}>Profile Picture</Text>
              </View>
            )}
          </View>

           {/* --- HEADER INFO --- */}
           <HeaderInfo
             name={agent?.userName || agent?.fullName || "Unnamed Agent"}
             username={agent?.userName}
             location={agent?.country || "Unknown"}
             city={agent?.city || "N/A"}
             age={age}
             compensation={agent?.compensation || 0}
             isNegotiable={agent?.negotiable === "Yes" || agent?.negotiable === true}
             onChatPress={() => {
               if (!isUnlocked) {
                 setShowPaymentModal(true);
                 return;
               }
               handleChat();
             }}
             isUnlocked={isUnlocked}
             isVerified={agent?.user?.isVerified || agent?.user?.kycStatus === "APPROVED"}
           />

          {/* --- ABOUT --- */}
          <BioSection
            title="About"
            content={agent?.about || "No description available."}
          />


          {/* --- ADDITIONAL DETAILS --- */}
          <AgentAdditionalDetails
            languages={agent?.additionalDetails?.languages || []}
            experience={agent?.additionalDetails?.experience || "N/A"}
            coverage={agent?.additionalDetails?.coverage || "N/A"}
          />

          {/* --- CONTACT INFO --- */}
          <View style={styles.contactWrapper}>
            {isUnlocked ? (
              <ContactSection
                data={{
                  country: agent?.country || "N/A",
                  phone1: agent?.phone1 || "N/A",
                  phone2: agent?.phone2 || "N/A",
                  emergency: agent?.emergencyPhone || "N/A",
                  social: {
                    Facebook: agent?.facebookProfile,
                    Instagram: agent?.instagramProfile,
                    X: agent?.twitterProfile,
                    TikTok: agent?.threadsProfile,
                  },
                  email: agent?.publicEmail ?? undefined,
                }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setShowPaymentModal(true)}
                style={styles.lockedContact}
              >
                <Text style={styles.lockedText}>
                  Contact information is locked
                </Text>
                <Entypo name="lock" size={18} color="gray" />
              </TouchableOpacity>
            )}
          </View>

          {/* --- SERVICES --- */}
          <AgentServices
            services={agent?.services || ["No services added yet"]}
          />

          {/* --- CERTIFICATIONS --- */}
          <AgentCertifications certifications={agent?.certifications || []} />
        </ScrollView>

        {/* WALLET MODAL */}
        <EmptyWalletModal
          visible={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          onTopUp={handleTopUp}
        />

        {/* PAYMENT MODAL */}
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        >
          <Entypo name="lock-open" size={32} color={colors.primary} style={styles.lockIcon} />
          <Text style={styles.paymentDescription}>
            You will be charged <Text style={styles.amountText}>₦{unlockFee?.amount?.toLocaleString() ?? "50,000"}</Text> from your wallet to unlock this profile.
          </Text>

          <Button style={styles.payButton} onPress={handlePayment} disabled={isProcessing}>
            Pay to unlock
          </Button>
        </PaymentModal>
      </SafeAreaView>
    </View>
  );
}

// -----------------------------
// STYLES
// -----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  carouselContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },

  contactWrapper: { marginVertical: 20 },
  lockedContact: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    alignItems: "center",
  },
  lockedText: { color: "gray", fontSize: 14 },

  lockIcon: {
    textAlign: "center",
    marginBottom: 16,
  },
  paymentDescription: {
    textAlign: "center",
    color: "#444444",
    marginBottom: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  amountText: {
    fontWeight: "800",
    fontSize: 17,
    color: "#222",
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignSelf: "center",
    marginVertical: 8,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
