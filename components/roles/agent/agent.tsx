import { ChevronDown } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Accordion, Text, XStack, YStack } from "tamagui";
import About from "@/components/roles/about";
import Contact from "@/components/roles/contact";
import AgentAdditionalDetails from "@/components/roles/agent/AditionalDetails";
import Gallery from "@/components/roles/gallery";
import ProgressMeter from "@/components/roles/progressCircle";
import Referral from "@/components/roles/referral";
import WalletCard from "@/components/roles/wallet";
import SurrogatePreview from "@/components/roles/surrogate/SurrogatePreview";
import { router } from "expo-router";
import ProfileCompletionModal from "@/components/roles/ProfileCompletionModal";
import { calculateProfileProgress } from "@/utils/profileHelpers";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";
import { useAuth } from "@/hooks/useAuth";
import ProfileData from "@/components/profileDetails/ProfileData";
import HomeResourceCard from "@/components/resources/HomeResourceCard";
import AdEarnCard from "@/components/ads/AdEarnCard";
import SubscriptionCard from "@/components/subscription/SubscriptionCard";

/** Safe render wrapper */
function SafeRender({ children, fallback }: any) {
  try {
    return children;
  } catch (e) {
    console.error("SafeRender caught:", e);
    return fallback;
  }
}

export default function AgentHomeScreen() {
  const { agentProfile, isLoading, fetchProfile, updateProfile } = useAgentProfile();
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Calculate profile completion progress
  const progress = calculateProfileProgress(agentProfile as any);

  // Fetch profile on mount if not loaded
  useEffect(() => {
    if (!agentProfile) {
      fetchProfile();
    }
  }, [agentProfile, fetchProfile]);

  // Show modal if profile is missing or incomplete
  useEffect(() => {
    if (!isLoading) {
      setHasLoadedOnce(true);
      if (progress >= 100) { setShowProfileModal(false); return; }
      const hasProfile = !!agentProfile;
      const needsCompletion = hasProfile && progress < 100;

      if (!hasProfile || needsCompletion) {
        setShowProfileModal(true);
      }
    }
  }, [agentProfile, progress, isLoading]);

  const ViewSurrogate = () => {
    router.push({
      pathname: "/surrogate/surrogateList",
    });
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <YStack flex={1} gap="$3">
          {/* AGENT PROFILE SECTION */}
          <SafeRender fallback={<Text>Loading profile...</Text>}>
            <ProfileData
              name={agentProfile?.userName || agentProfile?.fullName}
              avatarUrl={agentProfile?.profilePicture}
              location={agentProfile?.country || agentProfile?.city}
              dateOfBirth={agentProfile?.dateOfBirth}
              isAvailable={agentProfile?.isAvailable}
              onToggleAvailability={async (next) => {
                await updateProfile({ isAvailable: next });
              }}
              isVerified={agentProfile?.user?.kycStatus === "APPROVED"}
            />
          </SafeRender>

          {/* PROFILE INFO ACCORDION */}
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
                  <SafeRender fallback={<Text>Loading about info...</Text>}>
                    <About aboutMe={agentProfile?.about} />
                  </SafeRender>

                  <SafeRender fallback={null}>
                    <AgentAdditionalDetails
                      languages={agentProfile?.languages}
                      experience={agentProfile?.additionalDetails?.yearsOfExperience}
                      specialization={agentProfile?.services?.join(", ")}
                      coverage={agentProfile?.additionalDetails?.coverage}
                    />
                  </SafeRender>

                  <SafeRender fallback={<Text>Loading contact info...</Text>}>
                    <Contact
                      phoneNumber={agentProfile?.phone1}
                      email={user?.email}
                      socials={{
                        facebook: agentProfile?.facebookProfile,
                        instagram: agentProfile?.instagramProfile,
                        twitter: agentProfile?.twitterProfile,
                        tiktok: agentProfile?.tiktokProfile,
                      }}
                    />
                  </SafeRender>
                </YStack>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>

           {/* VIEW PROFILE AS GUEST */}
           <Pressable
             onPress={() =>
               router.push("/(tabs)/home/agent/agentsGuestView")
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

           {/* HORIZONTAL SLIDER FOR PARENTS + SURROGATES */}
           <ScrollView horizontal nestedScrollEnabled style={{ height: 210 }}>
             <SafeRender fallback={<Text>Loading...</Text>}>
               <Pressable onPress={ViewSurrogate} style={{ marginRight: 5 }}>
                 <SurrogatePreview
                   style={{ height: 200, padding: 2, width: 150 }}
                 />
               </Pressable>
             </SafeRender>

           </ScrollView>

           {/* GALLERY */}
           <SafeRender fallback={<Text>Loading gallery...</Text>}>
             <Gallery style={{ height: 210, marginTop: 10 }} />
           </SafeRender>

          {/* FINANCIAL + WORKLOAD CARDS - 2x2 grid */}
          <XStack
            flexWrap="wrap"
            justifyContent="flex-end"
            alignContent="flex-start"
            gap={10}
          >
            <YStack width={"48%"} gap={10}>
              <SafeRender fallback={<Text>Loading wallet...</Text>}>
                <WalletCard style={{ width: "100%", height: 100 }} />
              </SafeRender>
              <SafeRender fallback={<Text>Loading progress...</Text>}>
                <ProgressMeter
                  progress={progress}
                  style={{ width: "100%", height: 160 }}
                />
              </SafeRender>
            </YStack>

            <YStack width={"48%"} gap={10}>
              <SafeRender fallback={<Text>Loading...</Text>}>
                <HomeResourceCard />
              </SafeRender>
              <SafeRender fallback={<Text>Loading referral...</Text>}>
                <Referral style={{ width: "100%", height: 200 }} />
              </SafeRender>
            </YStack>
          </XStack>

          {/* Promotion row - AdEarnCard + SubscriptionCard */}
          <SafeRender fallback={null}>
            <XStack gap={10} marginTop={10}>
              <AdEarnCard style={{ flex: 1 }} />
              <SubscriptionCard style={{ flex: 1 }} />
            </XStack>
          </SafeRender>
        </YStack>
      </ScrollView>

      {/* Profile Completion Modal */}
      {hasLoadedOnce && progress < 100 && (
        <ProfileCompletionModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={agentProfile}
          profileTypeName="Agent"
          redirectPath="/profile"
        />
      )}
    </>
  );
}

/** Accordion Trigger with Chevron */
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
      {({ open }: { open?: boolean }) => (
        <XStack alignItems="center" justifyContent="space-between" width="100%">
          <Text color="white" fontWeight="700" fontSize="$5">
            {title}
          </Text>

          <Animated.View
            style={{
              transform: [{ rotate: open ? "180deg" : "0deg" }],
            }}
          >
            <ChevronDown color="white" size={20} />
          </Animated.View>
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
