import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, ViewStyle } from "react-native";
import { ChevronDown } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import Animated from "react-native-reanimated";
import { Accordion, Text, XStack, YStack } from "tamagui";
import About from "../about";
import Contact from "../contact";
import Gallery from "../gallery";
import ProfileData from "../profile-data";
import ProgressMeter from "../progressCircle";
import Referral from "../referral";
import WalletCard from "../wallet";
import { useProfile } from "@/hooks/useProfile";
import ProgressStepsModal from "@/components/ProgressStepModal";

interface Step {
  label: string;
  route: string;
  done: boolean;
}

export default function SurrogateScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Example step tracking
  const steps: Step[] = [
    { label: "Complete your profile", route: "/profile/edit", done: true },
    {
      label: "Set your surrogacy experience",
      route: "/profile/experienceIntro",
      done: false,
    },
    { label: "Verify your identity", route: "/settings/kyc", done: true },
  ];

  //  Check if all steps are done
  const allStepsDone = steps.every((s) => s.done);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <YStack flex={1} gap="$3">
          <ProfileData />

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
                  <About />
                  <Contact />
                </YStack>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>

          <Pressable
            onPress={() => router.push("/(tabs)/home/surrogateGuestView")}
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

          <XStack
            flexWrap="wrap"
            justifyContent="flex-end"
            alignContent="flex-start"
            gap={10}
          >
            <YStack width="48%" gap={10}>
              <WalletCard style={{ width: "100%", height: 100 } as ViewStyle} />

              {/* Show progress meter only if not all done */}
              {!allStepsDone && (
                <Pressable onPress={() => setModalVisible(true)}>
                  <ProgressMeter style={{ width: "100%", height: 210 } as ViewStyle} />
                </Pressable>
              )}
            </YStack>

            <YStack width="48%" gap={10} flexGrow={1}>
              <Gallery style={{ width: "100%", height: 210 } as ViewStyle} />
              <Referral style={{ width: "100%", height: 160, padding: 4 } as ViewStyle} />
            </YStack>
          </XStack>
        </YStack>
      </ScrollView>

      {/* Progress Modal */}
      <ProgressStepsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        steps={steps}
      />
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
          <XStack alignItems="center" justifyContent="space-between">
            <Text color="white" fontWeight="700" fontSize="$5">
              {title}
            </Text>
            <Animated.View
              style={{
                transform: [{ rotate: open ? "180deg" : "0deg" }],
              }}
            >
              <ChevronDown color="white" size={18} />
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
