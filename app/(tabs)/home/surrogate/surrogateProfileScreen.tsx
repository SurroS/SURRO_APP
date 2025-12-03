import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image as RNImage,
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
import { router } from "expo-router";
import { useSurrogateStore } from "@/store/surrogates";
import EmptyWalletModal from "@/components/modals/EmptyWalletModal";

const SurrogateImages = [
  require("@/assets/images/image1.jpg"),
  require("@/assets/images/image21.jpg"),
  require("@/assets/images/image3.jpg"),
];

const MedicalData = {
  genotype: "AA",
  bloodGroup: "O+",
  pregnant: "No",
  children: 1,
  caesarean: "No",
  numberOfCs: 0,
  hasAllergies: "yes",
  allergies: "Peanuts",
  hasChronicIllness: "no",
  takesMedication: "no",
  hadSurgery: "no",
  hasDisability: "no",
  hadMiscarriage: "yes",
  numberOfMiscarriages: 1,
  medicalReport:
    "https://drive.google.com/file/d/1jKEhRmNlbjfukYIJJVpfqdPzutDZKS2O/view?usp=sharing",
};

const ContactData = {
  country: "Nigeria",
  state: "Lagos",
  lGA: "Ikeja",
  street: "123 Victoria Island",
  zip: "100001",
  phone1: "+2348012345678",
  phone2: "+2348098765432",
  emergency: "+2348023344556",
  relationship: "Sister",
  social: {
    Facebook: "https://facebook.com/profile",
    Instagram: "https://instagram.com/profile",
  },
};

const ExperienceData = [
  { question: "Have you ever been a surrogate?", answer: "Yes" },
  { question: "Did you carry single or multiple babies?", answer: "Single" },
  { question: "How much will you want to be compensated?", answer: "$5,000" },
  { question: "Is this amount negotiable?", answer: "Yes" },
  {
    question: "Anything else you'd like to share?",
    answer: "It was a rewarding experience.",
  },
];

export default function SurrogateProfileScreen() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const { surrogates, fetchSurrogates } = useSurrogateStore();
  const wallet =1

  const HandleUnlockReoprt = () => setShowPaymentModal(true);

  const HandlePayment = () => {
     if (wallet < 1) {
      setShowWalletModal(true);
    } else {
    setIsUnlocked(true);
    setShowPaymentModal(false);
    setShowChatModal(true);
    Toast.show({
      text1: "Payment successful",
      type: "customSuccess" as ToastType,
      text2: "You now have complete access to surrogate's data",
    })
  };
  };

  const HandleUseAgent = () =>
    router.push("/(tabs)/home/agent/agentsListScreen");
  const HandleChat = () => {};

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* IMAGE CAROUSEL */}
          <View style={styles.carouselContainer}>
            <ImageCarousel
              images={
                isUnlocked
                  ? SurrogateImages
                  : [
                      "https://picsum.photos/600/600",
                      "https://picsum.photos/700/700",
                      "https://picsum.photos/800/800",
                    ]
              }
              unlocked={isUnlocked}
            />
          </View>

          <HeaderInfo
            name="Michelle John"
            username="Micah"
            location={ContactData.country}
            age={29}
            maritalStatus="Single"
            height="5ft 6in"
            weight="67kg"
            compensation={5000000}
            isNegotiable={true}
            onChatPress={() => setShowPaymentModal(true)}
            isUnlocked={isUnlocked}
          />

          <BioSection
            title="About"
            content="I love to eat rice and beans, only on weekends"
          />
          <MedicalSection
            data={MedicalData}
            reportVisible={isUnlocked}
            unlockReport={HandleUnlockReoprt}
          />

          <View style={styles.contactWrapper}>
            {isUnlocked ? (
              <ContactSection data={ContactData} />
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

          <SurrogacyExperienceSection data={ExperienceData} />

          <TouchableOpacity
            onPress={() => {
              {
                isUnlocked ? setShowChatModal(true) : setShowPaymentModal(true);
              }
            }}
            style={styles.openNowButton}
          >
            <Text style={{ color: colors.white }}>
              {isUnlocked ? "Use an Agent" : "Unlock now"}
            </Text>
            {isUnlocked ? (
              <Entypo name="lock-open" size={18} color="white" />
            ) : (
              <Entypo name="lock" size={18} color="white" />
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* --- Modals --- */}
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
            If you would like to keep your identity anonymous we recommend that
            you use an agent, clicking direct message will show your identity to
            the surrogate.
          </Text>
          <Button style={styles.payButton} onPress={HandleUseAgent}>
            Use An Agent
          </Button>
          <Button style={styles.payButton} onPress={HandleChat}>
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
