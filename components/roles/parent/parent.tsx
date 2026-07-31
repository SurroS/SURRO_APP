import { ChevronDown } from "@tamagui/lucide-icons";
import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Pressable, RefreshControl } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Accordion, Text, XStack, YStack } from "tamagui";
import { router } from "expo-router";
import About from "@/components/roles/about";
import Contact from "@/components/roles/contact";
import ProgressMeter from "@/components/roles/progressCircle";
import Referral from "@/components/roles/referral";
import WalletCard from "@/components/roles/wallet";
import SurrogatePreview from "@/components/roles/surrogate/SurrogatePreview";
import AgentPreview from "@/components/roles/agent/AgentPreviewCard";
import ProfileCompletionModal from "@/components/roles/ProfileCompletionModal";
import { calculateProfileProgress } from "@/utils/profileHelpers";
import { useParentProfile } from "@/hooks/profile/useParentProfile";
import { useAuth } from "@/hooks/useAuth";
import ProfileData from "@/components/profileDetails/ProfileData";
import HomeResourceCard from "@/components/resources/HomeResourceCard";

export default function ParentScreen() {
  const { parentProfile, fetchProfile, isLoading } = useParentProfile();
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const progress = calculateProfileProgress(parentProfile);

  // Fetch profile on mount if not loaded (cached ref may still be null)
  useEffect(() => {
    if (!parentProfile && !isLoading) {
      fetchProfile();
    }
  }, [parentProfile, isLoading, fetchProfile]);



  useEffect(() => {
    if (!isLoading) {
      setHasLoadedOnce(true);
    }
    if (!parentProfile || isLoading) return;
    if (progress >= 100) { setShowProfileModal(false); return; }
    const hasProfile = !!parentProfile;
    const needsCompletion = hasProfile && progress < 100;
    if (!hasProfile || needsCompletion) {
      setShowProfileModal(true);
    }
  }, [parentProfile, progress, isLoading]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfile(true);
    setRefreshing(false);
  }, [fetchProfile]);

  const ViewSurrogates = () =>
    router.push("/surrogate/surrogateList");
  const ViewAgents = () => router.push("/agent/agentsListScreen");

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0E0E55"]} />
        }
      >
        <YStack flex={1} gap="$3">
          <ProfileData
            name={parentProfile?.userName}
            avatarUrl={parentProfile?.profilePicture}
            location={parentProfile?.countryOfResidence}
            dateOfBirth={parentProfile?.dateOfBirth?.slice(0, 10)}
            isVerified={parentProfile?.user?.kycStatus === "APPROVED"}
          />

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
                  <About aboutMe={parentProfile?.about} />

                  {(() => {
                    const p = parentProfile as any;
                    const rows: { label: string; value: string }[] = [];

                    if (p?.whySurrogacy) rows.push({ label: "Why Surrogacy", value: p.whySurrogacy });
                    if (p?.yearsOfTrying != null) rows.push({ label: "Years Trying", value: `${p.yearsOfTrying} yrs` });
                    if (p?.languagesSpoken?.length) rows.push({ label: "Languages", value: p.languagesSpoken.join(", ") });
                    if (p?.surrogacyType) rows.push({ label: "Surrogacy Type", value: p.surrogacyType });
                    if (p?.preferredAgeRanges?.length) rows.push({ label: "Preferred Age", value: p.preferredAgeRanges[0] });
                    if (p?.preferredLocations?.length) rows.push({ label: "Preferred Location", value: p.preferredLocations[0] });
                    if (p?.preferredHeights?.length) rows.push({ label: "Preferred Height", value: p.preferredHeights[0] });
                    if (p?.preferredCountries?.length) rows.push({ label: "Preferred Country", value: p.preferredCountries[0] });
                    if (p?.preferredGenotypes?.length) rows.push({ label: "Preferred Genotype", value: p.preferredGenotypes[0] });
                    if (p?.preferredBloodGroups?.length) rows.push({ label: "Preferred Blood Group", value: p.preferredBloodGroups[0] });

                    if (rows.length === 0) return null;

                    return (
                      <YStack gap="$1" width="100%">
                        <Text fontWeight="700" fontSize="$4" color="#222" marginBottom="$1">
                          Profile Summary
                        </Text>
                        {rows.map((r) => (
                          <XStack key={r.label} alignItems="center" justifyContent="space-between" width="100%">
                            <Text fontWeight="600" color="#444" fontSize={14}>{r.label}</Text>
                            <Text color="#555" fontSize={14} flexShrink={1} textAlign="right">{r.value}</Text>
                          </XStack>
                        ))}
                      </YStack>
                    );
                  })()}

                  <Contact
                    phoneNumber={parentProfile?.phone1}
                    email={user?.email}
                    socials={{
                      facebook: parentProfile?.facebookProfile,
                      instagram: parentProfile?.instagramProfile,
                      twitter: parentProfile?.twitterProfile,
                      tiktok: parentProfile?.tiktokProfile,
                    }}
                  />
                </YStack>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>

          {/* Horizontal previews */}
          <ScrollView horizontal style={{ height: 210 }}>
            <Pressable onPress={ViewSurrogates} style={{ marginRight: 5 }}>
              <SurrogatePreview
                style={{ height: 200, padding: 2, width: 150 }}
              />
            </Pressable>

            <Pressable onPress={ViewAgents} style={{ marginRight: 5 }}>
              <AgentPreview style={{ height: 200, padding: 2, width: 150 }} />
            </Pressable>

          </ScrollView>

          {/* Floating Cards - 2x2 grid */}
          <XStack
            flexWrap="wrap"
            justifyContent="flex-end"
            alignContent="flex-start"
            gap={10}
          >
            <YStack width={"48%"} gap={10}>
              <WalletCard style={{ width: "100%", height: 100 }} />
              <ProgressMeter
                progress={progress}
                style={{ width: "100%", height: 200 }}
              />
            </YStack>

            <YStack width={"48%"} gap={10}>
              <HomeResourceCard />
              <Referral style={{ width: "100%", height: 200 }} />
            </YStack>
          </XStack>
        </YStack>
      </ScrollView>

      {hasLoadedOnce && progress < 100 && (
        <ProfileCompletionModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={parentProfile}
          profileTypeName="Parent"
          redirectPath="/profile"
        />
      )}
    </>
  );
}

/** Accordion Trigger with Animated Chevron */
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
      {({ open }: { open?: boolean }) => {
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { rotate: withTiming(open ? "180deg" : "0deg", { duration: 200 }) },
          ],
        }));

        return (
          <XStack
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Text color="white" fontWeight="700" fontSize="$5">
              {title}
            </Text>
            <Animated.View style={animatedStyle}>
              <ChevronDown color="white" size={25} />
            </Animated.View>
          </XStack>
        );
      }}
    </Accordion.Trigger>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },

});
