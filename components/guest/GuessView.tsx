// components/guess/GuessView.tsx
import React from "react";
import { ScrollView } from "react-native";
import { YStack, Text, Separator } from "tamagui";
import { useRouter } from "expo-router";

// Components
import HeaderBar from "@/components/guest/HeaderBar";
import ProfileCard from "@/components/guest/ProfileCard";
import AboutSection from "@/components/guest/AboutSection";
import ContactSection from "@/components/guest/ContactSection";
import SocialsSection from "@/components/guest/SocialsSection";
import GallerySection from "@/components/guest/GallerySection";

const GuessView = () => {
  const router = useRouter();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingHorizontal={20}
        paddingTop={12}
        gap="$4"
      >
        {/* Header */}
        <HeaderBar />

        {/* Profile Sections */}
        <ProfileCard />
        <AboutSection />

        {/* Separator between About and Contact */}
        <Separator width="100%" marginVertical={-1} borderColor="$grey" />

        <ContactSection />
        <SocialsSection />

        {/* Gallery Section */}
        <YStack gap="$3" paddingVertical="$2">
          <Text color="$text" fontWeight="600">
            Back to default view
          </Text>
          <GallerySection />
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default GuessView;
