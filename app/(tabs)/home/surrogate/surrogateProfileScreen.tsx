import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { Button } from "tamagui";
import colors from "@/hooks/colors";
import { ImageCarousel } from "@/components/ImageCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import image1 from "@/assets/images/image1.jpg";
import image2 from "@/assets/images/image2.jpg";
import image3 from "@/assets/images/image3.jpg";
import { PaymentModal } from "@/components/payment";
import Entypo from "@expo/vector-icons/Entypo";
import BioSection from "@/components/roles/BioSectionView";
import MedicalSection from "@/components/medical/MedicalSectionView";
import ContactSection from "@/components/roles/ContactSectionView";
import SurrogacyExperienceSection from "@/components/roles/surrogate/SurrogacyExperienceView";
import { Facebook, Instagram } from "@tamagui/lucide-icons";
import HeaderInfo from "@/components/roles/HeaderInfoSection";

const SurrogateImages = [
  "https://picsum.photos/600/600",
  "https://picsum.photos/700/700",
  "https://picsum.photos/600/600",
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
  medicalReport: "https://example.com/report.pdf",
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
  {
    question: "Did you carry single or multiple babies?",
    answer: "Single",
  },
  {
    question: "How much will you want to be compensated?",
    answer: "$5,000",
  },
  { question: "Is this amount negotiable?", answer: "Yes" },
  {
    question: "Anything else you'd like to share?",
    answer: "It was a rewarding experience.",
  },
];

export default function SurrogateProfileScreen() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- IMAGE CAROUSEL --- */}
          <View style={styles.carouselContainer}>
            <ImageCarousel
              images={
                isUnlocked ? SurrogateImages : [image1, image2, image3, image1]
              }
              unlocked={isUnlocked}
            />
          </View>

          <HeaderInfo
            name="Michelle John"
            username="Micah"
            location="California"
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
            content="i love to eat rice and beans, only on weekends"
          />
          <MedicalSection data={MedicalData} />

          {/* --- CONTACT INFO --- */}
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
        </ScrollView>
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        >
          <Text style={styles.paymentDescription}>
            To start a conversation with this surrogate, you need to pay N50,000
          </Text>
          <Button
            style={styles.payButton}
            onPress={() => {
              setIsUnlocked(true);
              setShowPaymentModal(false);
            }}
          >
            Pay $10 to unlock
          </Button>
        </PaymentModal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  carouselContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  headerSection: {
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
  },
  username: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#444444",
  },
  dot: {
    marginHorizontal: 6,
    color: "#444444",
  },
  chatButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  contactWrapper: {
    marginVertical: 20,
  },
  lockedContact: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    alignItems: "center",
  },
  lockedText: {
    color: "gray",
    fontSize: 14,
  },
  paymentFooter: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#dddddd",
  },
  paymentDescription: {
    textAlign: "center",
    color: "#444444",
    marginBottom: 12,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
