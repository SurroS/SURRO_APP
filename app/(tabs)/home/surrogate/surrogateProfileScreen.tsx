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
import { fallbackSurrogates } from "@/store/surrogates/actions";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet/walletStore"; 
import { SURROGATE_TRANSACTIONS } from "@/types/surrogateTransactionTypes";
 

export default function SurrogateProfileScreen() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { user, token } = useAuthStore();
  console.log("current User:", user)

  const { balance, debit, fetchBalance } = useWalletStore();


  const { id } = useLocalSearchParams();
  const [surrogate, setSurrogate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const transaction = SURROGATE_TRANSACTIONS.PROFILE_BOOST;

  // Load backend profile
  useEffect(() => {
    loadSurrogate();
  }, []);
  useEffect(() => {
  if (user?.id) {
    fetchBalance(user.id, token || null);
  }
}, [user]);


  const loadSurrogate = async () => {
    try {
      setLoading(true);
      const { data } = await getSurrogateById(id as string);
      console.log("Single surrogate:", data.profile);
      if (data?.profile) {
        setSurrogate(data.profile);
      } else {
        const fallback = fallbackSurrogates.find((s) => s.id === id);
        setSurrogate(fallback || null);
      }
    } catch (error) {
      console.log("Surrogate fetch error:", error);
      const fallback = fallbackSurrogates.find((s) => s.id === id);
      setSurrogate(fallback || null);
    } finally {
      setLoading(false);
    }
  };

 const HandlePayment = async () => {
  if (!user?.id) return;

  const cost = transaction.amount; // e.g. 3000 or 50000

  if (balance < cost) {
    setShowWalletModal(true);
    return;
  }

  const result = await debit(
    user.id,
    cost,
    token || null,
    {
      description: transaction.description,
      currency: "NGN",
    }
  );

  if (result !== null) {
    setIsUnlocked(true);
    setShowPaymentModal(false);
    setShowChatModal(true);

    Toast.show({
      text1: "Payment Successful",
      type: "customSuccess" as ToastType,
      text2: "You now have full access to this surrogate",
    });
  } else {
    Toast.show({
      text1: "Payment Failed",
      type: "costomError" as ToastType,
    });
  }
};


  const HandleUseAgent = () =>
    router.push("/(tabs)/home/agent/agentsListScreen");

  const profileImages = surrogate?.gallery?.length
    ? surrogate.gallery
    : [
        "https://picsum.photos/600/600",
        "https://picsum.photos/700/700",
        "https://picsum.photos/800/800",
      ];

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
    age: surrogate?.age ?? "N/A",
    maritalStatus: surrogate?.maritalStatus ?? "Not specified",
    height: surrogate?.height ? `${surrogate.height} cm` : "N/A",
    weight: surrogate?.weight ? `${surrogate.weight} kg` : "N/A",
    compensation: surrogate?.expectedCompensation ?? 0,
    isNegotiable: surrogate?.isNegotiable ?? false,
  };

  const aboutContent = surrogate?.aboutMe ?? "No description available";

  const medicalData = {
    genotype: surrogate?.medical?.genotype ?? "N/A",
    bloodGroup: surrogate?.medical?.bloodGroup ?? "N/A",
    pregnant: surrogate?.medical?.pregnancyExperience === true ? "Yes" : "No",
    children:
      surrogate?.medical?.numberofChildren ??
      surrogate?.numberOfChildren ??
      "0",
    caesarean: surrogate?.medical?.ceasareanSection === true ? "Yes" : "No",
    numberOfCs: surrogate?.medical?.numberOfCs ?? 0,
    hasAllergies: surrogate?.medical?.hasAllergies === true ? "Yes" : "No",
    allergies: surrogate?.medical?.allergies ?? "None",
    hasChronicIllness: surrogate?.medical?.chronicIllnessDetails ? "Yes" : "No",
    takesMedication:
      surrogate?.medical?.takesMedication === true ? "Yes" : "No",
    hadSurgery: surrogate?.medical?.hadSurgery ? "Yes" : "No",
    hasDisability: surrogate?.medical?.hasDisability ? "Yes" : "No",
    hadMiscarriage: surrogate?.medical?.hadMiscarriage ? "Yes" : "No",
    numberOfMiscarriages: surrogate?.medical?.numberOfMiscarriages ?? 0,
    medicalReport: surrogate?.medical?.endometriumUploadUrl,
  };

  const contactData = {
    country: surrogate?.countryOfResidence ?? "N/A",
    state: surrogate?.stateOfOrigin ?? "N/A",
    lGA: surrogate?.lga ?? "N/A",
    street: surrogate?.address ?? "N/A",
    zip: surrogate?.zipCode ?? "N/A",
    phone1: surrogate?.phone1 ?? "N/A",
    phone2: surrogate?.phone2 ?? "N/A",
    emergency: surrogate?.emergencyContactPhone ?? "N/A",
    relationship: surrogate?.emergencyContactRelation ?? "N/A",
    social: {
      Facebook: surrogate?.facebookProfile ?? null,
      Instagram: surrogate?.instagramProfile ?? null,
      Twitter: surrogate?.twitterProfile ?? null,
      Threads: surrogate?.threadsProfile ?? null,
    },
  };

  const experienceData = [
    {
      question: "Have you ever been a surrogate?",
      answer: surrogate?.hasSurrogacyExperience ? "Yes" : "No",
    },
    {
      question: "How much compensation do you want?",
      answer: surrogate?.expectedCompensation
        ? `₦${surrogate?.expectedCompensation}`
        : "Not specified",
    },
    {
      question: "Is this amount negotiable?",
      answer: surrogate?.isNegotiable ? "Yes" : "No",
    },
    {
      question: "Anything else you’d like to share?",
      answer: surrogate?.notes ?? "No additional notes",
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
            <ImageCarousel images={profileImages} unlocked={isUnlocked} />
          </View>

          {/* HEADER */}
          <HeaderInfo
            {...headerData}
            onChatPress={() => setShowPaymentModal(true)}
            isUnlocked={isUnlocked}
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
          <Button style={styles.payButton} onPress={HandlePayment}>
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
          <Button style={styles.payButton} onPress={HandleUseAgent}>
            Use An Agent
          </Button>
          <Button style={styles.payButton} onPress={()=>{}}>
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
