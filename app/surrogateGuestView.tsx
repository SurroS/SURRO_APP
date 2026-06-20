import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import colors from "@/hooks/colors";
import { ImageCarousel } from "@/components/ImageCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import BioSection from "@/components/roles/BioSectionView";
import MedicalSection from "@/components/medical/MedicalSectionView";
import ContactSection from "@/components/roles/ContactSectionView";
import SurrogacyExperienceSection from "@/components/roles/surrogate/SurrogacyExperienceView";
import HeaderInfo from "@/components/roles/HeaderInfoSection";
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";
import { useGallery } from "@/hooks/useGallery";

export default function SurrogateGuestView() {
  const { surrogateProfile, fetchProfile, isLoading } = useSurrogateProfile();
  const { images: galleryImages, fetchImages } = useGallery();

  useEffect(() => {
    if (!surrogateProfile) {
      fetchProfile();
    }
  }, [surrogateProfile]);

  useEffect(() => {
    fetchImages(true).catch(() => {});
  }, []);

  if (isLoading || !surrogateProfile) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const profile = surrogateProfile;
  const hasProfilePicture = !!profile?.profilePicture;

  const carouselImages = [
    ...(hasProfilePicture ? [profile!.profilePicture] : []),
    ...(Array.isArray(galleryImages) ? galleryImages.filter((img: any) => img?.url).map((img: any) => img.url) : []),
  ];

  const headerData = {
    name:
      `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
      profile?.userName ||
      "No name",
    username: profile?.userName ?? "unknown",
    location:
      profile?.countryOfResidence ?? profile?.countryOfOrigin ?? "Unknown",
    age: profile?.age ?? 0,
    maritalStatus: profile?.maritalStatus ?? "Not specified",
    height: profile?.height ? `${profile.height} cm` : "N/A",
    weight: profile?.weight ? `${profile.weight} kg` : "N/A",
    compensation: profile?.compensationAmount ?? 0,
    isNegotiable: profile?.compensationNegotiable ?? false,
  };

  const aboutContent = profile?.aboutMe ?? "No description available";

  const medicalData = {
    genotype: profile?.medical?.genotype ?? "N/A",
    bloodGroup: profile?.medical?.bloodGroup ?? "N/A",
    pregnant: profile?.medical?.pregnancyExperience === true ? "Yes" : "No",
    children:
      profile?.medical?.numberofChildren ?? profile?.numberOfChildren ?? 0,
    caesarean: profile?.medical?.ceasareanSection === true ? "Yes" : "No",
    numberOfCs: profile?.medical?.numberOfCs ?? 0,
    hasAllergies: profile?.medical?.hasAllergies === true ? "yes" : profile?.medical?.hasAllergies === false ? "no" : "N/A",
    allergies: profile?.medical?.allergies?.join(", ") ?? "None",
    hasChronicIllness: profile?.medical?.hasChronicIllness === true ? "yes" : profile?.medical?.hasChronicIllness === false ? "no" : profile?.medical?.chronicIllnessDetails ? "yes" : "N/A",
    chronicIllnesses: profile?.medical?.chronicIllnesses,
    otherChronicIllness: profile?.medical?.otherChronicIllness,
    takesMedication: profile?.medical?.takesMedication === true ? "yes" : profile?.medical?.takesMedication === false ? "no" : "N/A",
    medications: profile?.medical?.medications?.join(", ") ?? "None",
    hadSurgery: profile?.medical?.hadSurgery === true ? "yes" : profile?.medical?.hadSurgery === false ? "no" : "N/A",
    surgeries: profile?.medical?.surgeries?.join(", ") ?? "None",
    hasDisability: profile?.medical?.hasDisability === true ? "yes" : profile?.medical?.hasDisability === false ? "no" : "N/A",
    disabilities: profile?.medical?.disabilities?.join(", ") ?? "None",
    hadMiscarriage: profile?.medical?.hadMiscarriage === true ? "yes" : profile?.medical?.hadMiscarriage === false ? "no" : "N/A",
    numberOfMiscarriages: profile?.medical?.numberOfMiscarriages ?? 0,
    medicalReport: profile?.medical?.endometriumUploadUrl,
  };

  const contactData = {
    country: profile?.countryOfResidence ?? "N/A",
    state: profile?.stateOfResidence ?? "N/A",
    lGA: profile?.lga ?? "N/A",
    street: profile?.address ?? "N/A",
    zip: profile?.zipCode ?? "N/A",
    phone1: profile?.phone1 ?? "N/A",
    phone2: profile?.phone2 ?? "N/A",
    emergency: profile?.emergencyContactPhone ?? "N/A",
    relationship: profile?.emergencyContactRelation ?? "N/A",
    social: {
      Facebook: profile?.facebookProfile || undefined,
      Instagram: profile?.instagramProfile || undefined,
      Twitter: profile?.twitterProfile || undefined,
      TikTok: profile?.tiktokProfile || undefined,
    },
  };

  const experienceData = [
    {
      question: "Have you ever been a surrogate?",
      answer: profile?.hasBeenSurrogate === true ? "Yes" : profile?.hasBeenSurrogate === false ? "No" : "Not available",
    },
    {
      question: "How much compensation do you want?",
      answer: profile?.compensationAmount ? `₦${profile.compensationAmount.toLocaleString()}` : "Not available",
    },
    {
      question: "Is this amount negotiable?",
      answer: profile?.compensationNegotiable === true ? "Yes" : profile?.compensationNegotiable === false ? "No" : "Not available",
    },
    {
      question: "Previous pregnancy type?",
      answer: profile?.previousPregnancyType ?? "Not available",
    },
    {
      question: "Experience notes?",
      answer: profile?.experienceNotes ?? "Not available",
    },
    {
      question: "What did you enjoy?",
      answer: profile?.enjoymentNotes ?? "Not available",
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Guest badge */}
          <View style={styles.guestBadge}>
            <Entypo name="eye" size={16} color="#fff" />
            <Text style={styles.guestBadgeText}>Guest View</Text>
          </View>

          {/* IMAGE CAROUSEL */}
          <View style={styles.carouselContainer}>
            {carouselImages.length > 0 ? (
              <ImageCarousel images={carouselImages} unlocked={true} />
            ) : (
              <View style={{ flex: 1, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#666", fontSize: 14 }}>Profile Picture</Text>
              </View>
            )}
          </View>

          {/* HEADER */}
          <HeaderInfo
            {...headerData}
            isUnlocked={true}
            hideActions
          />

          {/* ABOUT */}
          <BioSection title="About" content={aboutContent} />

          {/* MEDICAL (always visible) */}
          <MedicalSection
            data={medicalData}
            reportVisible={true}
            unlockReport={() => {}}
          />

          {/* CONTACT (always visible) */}
          <View style={styles.contactWrapper}>
            <ContactSection data={contactData} hideActions />
          </View>

          <SurrogacyExperienceSection data={experienceData} />
        </ScrollView>
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
  guestBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 12,
  },
  guestBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
