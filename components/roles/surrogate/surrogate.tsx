import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, ViewStyle } from "react-native";
import { ChevronDown } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import Animated from "react-native-reanimated";
import { Accordion, Text, XStack, YStack } from "tamagui";
import About from "@/components/roles/about";
import Contact from "@/components/roles/contact";
import Gallery from "@/components/roles/gallery";
import ProgressMeter from "@/components/roles/progressCircle";
import Referral from "@/components/roles/referral";
import WalletCard from "@/components/roles/wallet";
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";
import { calculateProfileProgress } from "@/utils/profileHelpers";
import ProfileCompletionModal from "@/components/roles/ProfileCompletionModal";
import ProfileData from "@/components/profileDetails/ProfileData";
import { useAuth } from "@/hooks/useAuth";

export default function SurrogateScreen() {
  const { surrogateProfile, isLoading, toggleAvailability } =
    useSurrogateProfile();
  const { user } = useAuth();

  const [showProfileModal, setShowProfileModal] = useState(false);
  // Calculate profile progress
  const progress = calculateProfileProgress(surrogateProfile);

  // Show modal if no profile or progress < 100%
  useEffect(() => {
    console.log("[Home] surrogateprofile", surrogateProfile);
    if (!isLoading) {
      const hasProfile = surrogateProfile !== null;
      const needsCompletion = hasProfile && progress < 100;

      if (!hasProfile || needsCompletion) {
        setShowProfileModal(true);
      }
    }
  }, [surrogateProfile, progress, isLoading]);

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <YStack flex={1} gap="$3">
          <ProfileData
            name={
              surrogateProfile?.userName ||
              `${surrogateProfile?.firstName ?? ""} ${
                surrogateProfile?.lastName ?? ""
              }`.trim()
            }
            avatarUrl={surrogateProfile?.profilePicture}
            location={surrogateProfile?.countryOfResidence}
            dateOfBirth={surrogateProfile?.dateOfBirth?.split("T")[0]}
            isAvailable={surrogateProfile?.isAvailable}
            onToggleAvailability={toggleAvailability}
          />

          {/* Accordion for About + Contact */}
          <Accordion
            type="single"
            collapsible
            borderTopStartRadius={10}
            borderTopEndRadius={10}
            overflow="hidden"
          >
            <Accordion.Item value="profile-info">
              <AccordionTriggerWithChevron title="Profile Information" />
              <Accordion.Content backgroundColor="white" padding="$3">
                <YStack gap="$3">
                  <About aboutMe={surrogateProfile?.aboutMe} />
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
                </YStack>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>

          <Pressable
            onPress={() =>
              router.push("/(tabs)/home/surrogate/surrogateGuestView")
            }
          >
            <Text
              color="black"
              fontWeight="bold"
              textDecorationLine="underline"
              textDecorationColor="#0E0E55"
              marginBottom={8}
            >
              View profile as guest
            </Text>
          </Pressable>
          {/* Floating Card Section */}
          <XStack
            flexWrap="wrap"
            justifyContent="flex-end"
            alignContent="flex-start"
            gap={10}
          >
            <YStack width={"48%"} gap={10}>
              <WalletCard style={{ width: "100%", height: 100 }} />
              <ProgressMeter
                style={{ width: "100%", height: 210 }}
                progress={progress}
              />
            </YStack>

            <YStack width={"48%"} gap={10} flexGrow={1}>
              <Gallery style={{ width: "100%", height: 210 }} />
              <Referral style={{ width: "100%", height: 160, padding: 4 }} />
            </YStack>
          </XStack>
        </YStack>

        {/* Profile Completion Modal */}
        <ProfileCompletionModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={surrogateProfile}
          redirectPath="/profile"
        />
      </ScrollView>
    </>
  );
}

function AccordionTriggerWithChevron({ title }: { title: string }) {
  return (
    <Accordion.Trigger
      backgroundColor="#0E0E55"
      paddingVertical="$2"
      paddingHorizontal="$4"
      alignItems="center"
      justifyContent="space-between"
      height={48}
    >
      {({ open }: { open: boolean }) => (
        <XStack alignItems="center" justifyContent="space-between" width="100%">
          <XStack alignItems="center" gap={"$11"}>
            <Text color="white" fontWeight="700" fontSize="$5">
              {title}
            </Text>
            <Animated.View
              style={{
                transform: [{ rotate: open ? "180deg" : "0deg" }],
              }}
            >
              <ChevronDown color="white" size={25} />
            </Animated.View>
          </XStack>
        </XStack>
      )}
    </Accordion.Trigger>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
});
