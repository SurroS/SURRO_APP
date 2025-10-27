import { ChevronDown } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Accordion, Text, XStack, YStack } from "tamagui";
import About from "../about";
import Contact from "../contact";
import Gallery from "../gallery";
import ProfileData from "../profile-data";
import ProgressMeter from "../progressCircle";
import Referral from "../referral";
import WalletCard from "../wallet";

export default function AgentScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <YStack flex={1} gap="$3">
        <ProfileData />

        {/* Accordion for About + Contact */}
        <Accordion
          type="single"
          collapsible
          defaultValue={undefined} // keeps closed initially
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
              progress={0}
              style={{ width: "100%", height: 210 }}
            />
          </YStack>

          <YStack width={"48%"} gap={10}>
            <Gallery style={{ width: "100%", height: 210 }} />
            <Referral style={{ width: "100%", height: 160 }} />
          </YStack>
        </XStack>
      </YStack>
    </ScrollView>
  );
}

/** Custom trigger with animated Chevron */
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
      {({ open }: { open: boolean }) => {
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
            <XStack alignItems="center" justifyContent="space-between">
              <Text color="white" fontWeight="700" fontSize="$5">
                {title}
              </Text>
              <Animated.View style={animatedStyle}>
                <ChevronDown color="white" size={18} />
              </Animated.View>
            </XStack>
          </XStack>
        );
      }}
    </Accordion.Trigger>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
});
