// components/guest/surrogateGuestView.tsx
import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { YStack, Text, Separator } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import Contact from "../roles/contact";

// Components
import HeaderBar from "@/components/guest/HeaderBar";
import ProfileCard from "@/components/guest/ProfileCard";
import AboutSection from "@/components/guest/AboutSection";
import GallerySection from "@/components/guest/GallerySection";
import colors from "@/hooks/colors";
import { useAuth } from "@/hooks/useAuth";

// Hooks
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";

export default function SurrogateGuestView() {
  const { user } = useAuth();
  const { surrogateProfile, fetchProfile, isLoading } = useSurrogateProfile();

  useEffect(() => {
    if (!surrogateProfile) {
      fetchProfile().catch((err: any) => {
        console.error("Failed to fetch surrogate profile:", err);
      });
    }
  }, [surrogateProfile]);

  if (isLoading || !surrogateProfile) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <YStack
          flex={1}
          backgroundColor={colors.white}
          paddingHorizontal="$4"
          paddingTop="$3"
          gap="$4"
        >
          {/* Profile Info */}
          <ProfileCard />
          {/* About Section */}
          <AboutSection about={surrogateProfile?.aboutMe} />
          {/* Subtle Separator */}
          <Separator width="100%" borderColor="$secondary" opacity={0.2} />
          {/* Contact Info */}
          <Contact
            phoneNumber={surrogateProfile?.phone1}
            email={user?.email}
            socials={{
              facebook: surrogateProfile?.facebookProfile,
              instagram: surrogateProfile?.instagramProfile,
              twitter: surrogateProfile?.twitterProfile,
              tiktok: surrogateProfile?.tiktokProfile,
            }}
          />
          <Separator width="100%" borderColor="$secondary" opacity={0.2} />
          {/* Gallery Section */}
          <YStack gap="$2" paddingVertical="$3">
            <Text fontSize="$4" fontWeight="600" color={colors.text}>
              Gallery
            </Text>

            <GallerySection images={surrogateProfile?.gallery} />
          </YStack>
          {/* Optional Bottom Padding */}
          <YStack height={40} />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
