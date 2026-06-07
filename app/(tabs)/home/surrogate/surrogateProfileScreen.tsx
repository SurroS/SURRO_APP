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
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet/walletStore";
import { SURROGATE_TRANSACTIONS } from "@/types/surrogateTransactionTypes";
import { SurrogateProfile } from "@/types/profile";

export default function SurrogateProfileScreen() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { user, token } = useAuthStore();
  console.log("current User:", user);

  const { balance, debit, fetchBalance } = useWalletStore();

  const params = useLocalSearchParams();
  const surrogateId = typeof params?.id === "string" ? params.id : null;

  const [surrogate, setSurrogate] = useState<SurrogateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const wallet = surrogate?.wallet?.balance ?? 0;
  const transaction = SURROGATE_TRANSACTIONS.PROFILE_BOOST;

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
    if (!surrogate?.user?.id) {
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
        otherUserId: surrogate.user.id,
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
      console.log("Surrogate API response:", response);

      if (response.data?.profile) {
        setSurrogate(response.data.profile);
      } else {
        console.warn("No profile data in response");
        setSurrogate(null);
        Toast.show({
          text1: "Surrogate not found",
          type: "customError" as ToastType,
        });
      }
    } catch (error) {
      console.log("Surrogate fetch error:", error);
      setSurrogate(null);
      Toast.show({
        text1: "Failed to load surrogate profile",
        type: "customError" as ToastType,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (isProcessing) return;
    if (wallet < transaction.amount) {
      setShowWalletModal(true);
      return;
    } else {
      setIsUnlocked(true);
      setShowPaymentModal(false);

      Toast.show({
        text1: "Payment successful",
        type: "customSuccess" as ToastType,
        text2: "You now have full access to agent data",
      });
    }
  };

  const HandleUseAgent = () => {
    if (isProcessing) return;
    router.push("/agent/agentsListScreen");
  };

  const hasProfilePicture = !!surrogate?.profilePicture;

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
    compensation: 0,
    isNegotiable: false,
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
      answer: "Not available",
    },
    {
      question: "How much compensation do you want?",
      answer: "Not available",
    },
    {
      question: "Is this amount negotiable?",
      answer: "Not available",
    },
    {
      question: "Previous pregnancy type?",
      answer: "Not available",
    },
    {
      question: "Experience notes?",
      answer: "Not available",
    },
    {
      question: "What did you enjoy?",
      answer: "Not available",
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
            {hasProfilePicture ? (
              <ImageCarousel images={[surrogate!.profilePicture]} unlocked={isUnlocked} />
            ) : (
              <View style={{ flex: 1, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#666", fontSize: 14 }}>Profile Picture</Text>
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

          {/* CONTACT */}
          <View style={styles.contactWrapper}>
            {isUnlocked ? (
              <ContactSection data={contactData} />
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

          <SurrogacyExperienceSection data={experienceData} />

          {/* UNLOCK BUTTON */}
          <TouchableOpacity
            onPress={() =>
              isUnlocked ? setShowChatModal(true) : setShowPaymentModal(true)
            }
            style={styles.openNowButton}
          >
            <Text style={{ color: "white" }}>
              {isUnlocked ? "Use an Agent" : "Unlock now"}
            </Text>
            <Entypo
              name={isUnlocked ? "lock-open" : "lock"}
              size={18}
              color="white"
            />
          </TouchableOpacity>
        </ScrollView>

        {/* Modals */}
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        >
          <Text style={styles.paymentDescription}>
            You will be charged N50,000 from your wallet to start a conversation
            with this surrogate.
          </Text>
          <Button style={styles.payButton} onPress={handlePayment} disabled={isProcessing}>
            Pay N50,000 to unlock
          </Button>
        </PaymentModal>

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
  paymentDescription: {
    textAlign: "center",
    color: "#444444",
    marginBottom: 12,
    fontWeight: "700",
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
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
});
