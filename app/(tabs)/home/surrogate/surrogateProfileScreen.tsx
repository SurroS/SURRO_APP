import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button } from "tamagui";
import colors from "@/hooks/colors";
import { ImageCarousel } from "@/components/ImageCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaymentModal } from "@/components/payment";
import Entypo from "@expo/vector-icons/Entypo";
import BioSection from "@/components/roles/BioSectionView";
import MedicalSection from "@/components/medical/MedicalSectionView";
import ContactSection from "@/components/roles/ContactSectionView";
import SurrogacyExperienceSection from "@/components/roles/surrogate/SurrogacyExperienceView";
import HeaderInfo from "@/components/roles/HeaderInfoSection";
import ChatMethodModal from "@/components/modals/SelectChatMethod";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { router, useLocalSearchParams } from "expo-router";
import EmptyWalletModal from "@/components/modals/EmptyWalletModal";
import { getSurrogateById } from "@/services/profileApi";
import { resolveProfilePicture } from "@/utils/resolveMediaUrl";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet/walletStore";
import { useUnlock } from "@/hooks/useUnlock";
import { SurrogateProfile } from "@/types/profile";

export default function SurrogateProfileScreen() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { user, token } = useAuthStore();
  console.log("current User:", user);

  const { balance, fetchBalance } = useWalletStore();

  const params = useLocalSearchParams();
  const surrogateId = typeof params?.id === "string" ? params.id : null;
  const fromNetwork = params.fromNetwork === "1";

  const [surrogate, setSurrogate] = useState<SurrogateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    isUnlocked: unlockStatus,
    isProcessing,
    fee: unlockFee,
    unlock,
  } = useUnlock({
    targetUserId: surrogate?.userId ?? surrogate?.user?.id,
    targetRole: "SURROGATE",
  });

  const isUnlocked = fromNetwork || unlockStatus;

  // Load backend profile
  useEffect(() => {
    loadSurrogate();
  }, []);
  useEffect(() => {
    if (user) {
      fetchBalance(user.id, token || null);
    }
  }, [user]);

  const handleChat = () => {
    if (isProcessing) return;
    if (!surrogate?.userId && !surrogate?.user?.id) {
      Toast.show({
        text1: "Chat unavailable",
        text2: "This profile cannot be messaged yet",
        type: "customError" as ToastType,
      });
      return;
    }

    router.push({
      pathname: "/(tabs)/chat/conversation",
      params: {
        otherUserId: surrogate?.userId ?? surrogate?.user?.id,
        surrogateId: surrogate?.id,
        accessId: (surrogate as any)?.currentAccessId,
      },
    });
  };

  const loadSurrogate = async () => {
    if (!surrogateId) {
      console.warn("⚠ No surrogate ID provided");
      setSurrogate(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await getSurrogateById(surrogateId);
      console.log("[SurrogateProfile] Full API response:", JSON.stringify(response, null, 2));

      const profile = response?.profile ?? response?.data?.profile ?? response?.data ?? response;
      console.log("[SurrogateProfile] Extracted profile keys:", Object.keys(profile || {}).join(", "));
      if (profile?.profilePicture) {
        profile.profilePicture = resolveProfilePicture(profile.profilePicture);
      }

      if (profile && profile.id) {
        setSurrogate(profile);
      } else {
        console.warn("[SurrogateProfile] No valid profile data in response");
        setSurrogate(null);
        Toast.show({
          text1: "Surrogate not found",
          type: "customError" as ToastType,
        });
      }
    } catch (error: any) {
      console.error("[SurrogateProfile] Fetch error:", error?.response?.data || error?.message || error);
      setSurrogate(null);
      Toast.show({
        text1: "Failed to load surrogate profile",
        type: "customError" as ToastType,
      });
    } finally {
      setLoading(false);
    }
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

  const handleTopUp = () => {
    if (isProcessing) return;
    setShowWalletModal(false);
    router.push("/walletFlow");
  };

  const HandleUseAgent = () => {
    if (isProcessing) return;
    router.push("/agent/agentsListScreen");
  };

  const hasProfilePicture = !!surrogate?.profilePicture;

  const galleryUrls: string[] = surrogate?.gallery?.filter(i => i?.url).map(i => i.url) ?? [];
  const carouselImages: string[] = [
    ...(hasProfilePicture && surrogate?.profilePicture ? [surrogate.profilePicture] : []),
    ...galleryUrls,
  ];
  const hasCarouselImages = carouselImages.length > 0;

  // ---------------------------
  // FALLBACK MAPPED DATA
  // ---------------------------

  const headerData = {
    name:
      `${surrogate?.firstName ?? ""} ${surrogate?.lastName ?? ""}`.trim() ||
      surrogate?.userName ||
      "No name",

    username: surrogate?.userName ?? "unknown",
    location:
      surrogate?.countryOfResidence ?? surrogate?.countryOfOrigin ?? "Unknown",
    age: surrogate?.age ?? 0,
    maritalStatus: surrogate?.maritalStatus ?? "Not specified",
    height: surrogate?.height ? `${surrogate.height} cm` : "N/A",
    weight: surrogate?.weight ? `${surrogate.weight} kg` : "N/A",
    compensation: surrogate?.compensationAmount ?? 0,
    isNegotiable: surrogate?.compensationNegotiable ?? false,
  };

  const aboutContent = surrogate?.aboutMe ?? "No description available";

  const medicalData = {
    genotype: surrogate?.medical?.genotype ?? "N/A",
    bloodGroup: surrogate?.medical?.bloodGroup ?? "N/A",
    pregnant: surrogate?.medical?.pregnancyExperience === true ? "Yes" : "No",
    children:
      surrogate?.medical?.numberofChildren ?? surrogate?.numberOfChildren ?? 0,
    caesarean: surrogate?.medical?.ceasareanSection === true ? "Yes" : "No",
    numberOfCs: surrogate?.medical?.numberOfCs ?? 0,
    hasAllergies: surrogate?.medical?.hasAllergies === true ? "yes" : surrogate?.medical?.hasAllergies === false ? "no" : "N/A",
    allergies: surrogate?.medical?.allergies?.join(", ") ?? "None",
    hasChronicIllness: surrogate?.medical?.hasChronicIllness === true ? "yes" : surrogate?.medical?.hasChronicIllness === false ? "no" : surrogate?.medical?.chronicIllnessDetails ? "yes" : "N/A",
    chronicIllnesses: surrogate?.medical?.chronicIllnesses,
    otherChronicIllness: surrogate?.medical?.otherChronicIllness,
    takesMedication: surrogate?.medical?.takesMedication === true ? "yes" : surrogate?.medical?.takesMedication === false ? "no" : "N/A",
    medications: surrogate?.medical?.medications?.join(", ") ?? "None",
    hadSurgery: surrogate?.medical?.hadSurgery === true ? "yes" : surrogate?.medical?.hadSurgery === false ? "no" : "N/A",
    surgeries: surrogate?.medical?.surgeries?.join(", ") ?? "None",
    hasDisability: surrogate?.medical?.hasDisability === true ? "yes" : surrogate?.medical?.hasDisability === false ? "no" : "N/A",
    disabilities: surrogate?.medical?.disabilities?.join(", ") ?? "None",
    hadMiscarriage: surrogate?.medical?.hadMiscarriage === true ? "yes" : surrogate?.medical?.hadMiscarriage === false ? "no" : "N/A",
    numberOfMiscarriages: surrogate?.medical?.numberOfMiscarriages ?? 0,
    medicalReport: surrogate?.medical?.endometriumUploadUrl,
  };

  const contactData = {
    country: surrogate?.countryOfResidence ?? "N/A",
    state: surrogate?.stateOfResidence ?? "N/A",
    lGA: surrogate?.lga ?? "N/A",
    street: surrogate?.address ?? "N/A",
    zip: surrogate?.zipCode ?? "N/A",
    phone1: surrogate?.phone1 ?? "N/A",
    phone2: surrogate?.phone2 ?? "N/A",
    emergency: surrogate?.emergencyContactPhone ?? "N/A",
    relationship: surrogate?.emergencyContactRelation ?? "N/A",
    social: {
      Facebook: surrogate?.facebookProfile || undefined,
      Instagram: surrogate?.instagramProfile || undefined,
      Twitter: surrogate?.twitterProfile || undefined,
      TikTok: surrogate?.tiktokProfile || undefined,
    },
  };

  const experienceData = [
    {
      question: "Have you ever been a surrogate?",
      answer: surrogate?.hasBeenSurrogate === true ? "Yes" : surrogate?.hasBeenSurrogate === false ? "No" : "Not available",
    },
    {
      question: "How much compensation do you want?",
      answer: surrogate?.compensationAmount ? `₦${surrogate.compensationAmount.toLocaleString()}` : "Not available",
    },
    {
      question: "Is this amount negotiable?",
      answer: surrogate?.compensationNegotiable === true ? "Yes" : surrogate?.compensationNegotiable === false ? "No" : "Not available",
    },
    {
      question: "Previous pregnancy type?",
      answer: surrogate?.previousPregnancyType ?? "Not available",
    },
    {
      question: "Experience notes?",
      answer: surrogate?.experienceNotes ?? "Not available",
    },
    {
      question: "What did you enjoy?",
      answer: surrogate?.enjoymentNotes ?? "Not available",
    },
  ];

  if (loading)
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text style={{ padding: 20 }}>Loading please wait...</Text>
      </View>
    );
  if (!surrogate)
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Text style={{ padding: 20 }}>no surrogate found..</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* IMAGE CAROUSEL */}
          <View style={styles.carouselContainer}>
            {hasCarouselImages ? (
              <ImageCarousel images={carouselImages} unlocked={isUnlocked} />
            ) : (
              <View style={{ flex: 1, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#666", fontSize: 14 }}>No images</Text>
              </View>
            )}
          </View>

          {/* HEADER */}
          <HeaderInfo
            {...headerData}
            isUnlocked={isUnlocked}
            onChatPress={() => {
              if (!isUnlocked) {
                setShowPaymentModal(true);
                return;
              }
              handleChat();
            }}
          />

          {/* ABOUT */}
          <BioSection title="About" content={aboutContent} />

          {/* MEDICAL */}
          <MedicalSection
            data={medicalData}
            reportVisible={isUnlocked}
            unlockReport={() => setShowPaymentModal(true)}
          />

          <SurrogacyExperienceSection data={experienceData} />

          {/* CONTACT */}
          <View style={styles.contactWrapper}>
            {isUnlocked ? (
              <ContactSection data={contactData} isUnlocked onChat={handleChat} />
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

          <Text style={styles.anonymousHint}>If you want to stay anonymous to the surrogate, we recommend you use an agent</Text>

          <TouchableOpacity
            onPress={() =>
              isUnlocked ? setShowChatModal(true) : setShowPaymentModal(true)
            }
            style={styles.agentButton}
          >
            <Text style={styles.agentButtonText}>Use Agent</Text>
          </TouchableOpacity>
          <Text style={styles.agentCaption}>Stay anonymous</Text>
        </ScrollView>

        {/* Modals */}
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

        <EmptyWalletModal
          visible={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          onTopUp={handleTopUp}
        />

        <ChatMethodModal
          visible={showChatModal}
          onClose={() => setShowChatModal(false)}
        >
          <Text style={styles.paymentDescription}>
            To stay anonymous, use an agent. Direct message will reveal your
            identity.
          </Text>
          <Button style={styles.payButton} onPress={HandleUseAgent} disabled={isProcessing}>
            Use An Agent
          </Button>
          <Button style={styles.payButton} onPress={handleChat} disabled={isProcessing}>
            Direct Message
          </Button>
        </ChatMethodModal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { padding: 20 },
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
  openNowButton: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  anonymousHint: {
    color: "#000",
    fontSize: 13,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  agentButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: -4,
    alignSelf: "center",
    paddingHorizontal: 30,
  },
  agentButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  agentCaption: {
    color: colors.gray,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
});
