// components/guest/surrogateGuestView.tsx
import React from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { ScrollView } from "react-native"
import { YStack, Text, Separator } from "tamagui"

// Components
import HeaderBar from "@/components/guest/HeaderBar"
import ProfileCard from "@/components/guest/ProfileCard"
import AboutSection from "@/components/guest/AboutSection"
import ContactSection from "@/components/guest/ContactSection"
import SocialsSection from "@/components/guest/SocialsSection"
import GallerySection from "@/components/guest/GallerySection"

// Constants
import { Colors } from "@/constants/Colors"

export default function SurrogateGuestView() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <YStack
          flex={1}
          backgroundColor={Colors.light.background}
          paddingHorizontal="$4"
          paddingTop="$3"
          gap="$4"
        >
          {/* Header */}
          <HeaderBar />

          {/* Profile Info */}
          <ProfileCard />

          {/* About Section */}
          <AboutSection />

          {/* Separator (subtle) */}
          <Separator
            width="100%"
            borderColor="$secondary"  // same subtle color used in other sections
            opacity={0.9}            // makes it almost invisible
          />

          {/* Contact & Socials */}
          <ContactSection />
          <SocialsSection />

          {/* Gallery Section */}
          <YStack gap="$3" paddingVertical="$3">
            <Text color="$color" fontWeight="600">
              Back to default view
            </Text>
            <GallerySection />
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  )
}
