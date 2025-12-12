import { ChevronDown } from "@tamagui/lucide-icons";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Accordion, Text, View, XStack, YStack } from "tamagui";

import About from "../about";
import Contact from "../contact";
import ProfileData from "./AgentProfileData"; // <-- changed
import ProgressMeter from "../progressCircle";
import Referral from "../referral";
import WalletCard from "../wallet";
import SurrogatePreview from "../surrogate/SurrogatePreview";
import { router } from "expo-router";

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
  const ViewParents = () => {
    router.push({
      pathname: "/(tabs)/home/parent/parentsListScreen",
    });
  };

  const ViewSurrogate = () => {
    router.push({
      pathname: "/(tabs)/home/surrogate/surrogateList",
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
    >
      <YStack flex={1} gap="$3">
        {/* AGENT PROFILE SECTION */}
        <SafeRender fallback={<Text>Loading profile...</Text>}>
          <ProfileData />
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
                  <About />
                </SafeRender>

                <SafeRender fallback={<Text>Loading contact info...</Text>}>
                  <Contact />
                </SafeRender>
              </YStack>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>

        {/* HORIZONTAL SLIDER FOR PARENTS + AGENTS */}
        <ScrollView horizontal nestedScrollEnabled style={{ height: 210 }}>
          <SafeRender fallback={<Text>Loading...</Text>}>
            {/* Other Agents */}
            <Pressable onPress={ViewSurrogate} style={{ marginRight: 5 }}>
              <SurrogatePreview
                style={{ height: 200, padding: 2, width: 150 }}
              />
            </Pressable>
          </SafeRender>
        </ScrollView>

        {/* FINANCIAL + WORKLOAD CARDS */}
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
          </YStack>

          <YStack width={"48%"} gap={10}>
            <SafeRender fallback={<Text>Loading referral...</Text>}>
              <Referral style={{ width: "100%", height: 160 }} />
            </SafeRender>
          </YStack>

          <SafeRender fallback={<Text>Loading progress...</Text>}>
            <ProgressMeter
              progress={0}
              style={{ width: "100%", height: 210 }}
            />
          </SafeRender>
        </XStack>
      </YStack>
    </ScrollView>
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
            <ChevronDown color="white" size={25} />
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
 