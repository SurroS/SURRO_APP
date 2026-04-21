import React from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { PrimaryButton } from "@/components/auth";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/hooks/colors";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const Section = ({ icon, title, children }: any) => (
  <YStack
    backgroundColor="#fff"
    padding="$4"
    marginBottom="$4"
    borderRadius="$4"
    borderWidth={1}
    borderColor="#eee"
  >
    <XStack alignItems="center" gap="$2" marginBottom="$2">
      {icon}
      <Text style={{ color: colors.text, fontSize: 16 }} fontWeight="700">{title}</Text>
    </XStack>
    <YStack gap="$2">{children}</YStack>
  </YStack>
);

export default function GetStartedScreen() {
  const { user } = useAuth();
  const role = user?.role?.trim();

  const renderSurrogateContent = () => (
    <>
      <Section title="Complete Registration" icon={<Ionicons name="document-text-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Fill in accurate personal, medical, and lifestyle details.</Text>
        <Text style={{ color: colors.text, fontSize: 13 }}>Incomplete profiles reduce your chances of being matched.</Text>
      </Section>

      <Section title="KYC & Verification" icon={<Ionicons name="shield-checkmark-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Submit valid ID and required documents.</Text>
        <Text style={{ color: colors.text, fontSize: 13 }}>Verification builds trust and increases visibility.</Text>
      </Section>

      <Section title="Profile Picture Matters" icon={<Ionicons name="image-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Use a clear, recent, and friendly photo.</Text>
        <Text style={{ color: colors.text, fontSize: 13 }}>Profiles with good photos get significantly more attention.</Text>
      </Section>

      <Section title="Set Realistic Compensation" icon={<Ionicons name="cash-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Choose compensation that reflects market expectations.</Text>
        <Text style={{ color: colors.text, fontSize: 13 }}>Unrealistic amounts can delay matching.</Text>
      </Section>

      <Section title="Stay Active" icon={<Ionicons name="chatbubble-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Respond quickly to messages and requests.</Text>
        <Text style={{ color: colors.text, fontSize: 13 }}>Active users are prioritized in recommendations.</Text>
      </Section>

      <PrimaryButton title="Start Profile" onPress={() => router.push("/profile")} />
    </>
  );

  const renderParentContent = () => (
    <>
      <Section title="Complete Your Profile" icon={<Ionicons name="person-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Share your preferences, expectations, and requirements.</Text>
        <Text style={{ color: colors.text, fontSize: 13 }}>This helps us recommend the best matches.</Text>
      </Section>

      <Section title="Verification" icon={<Ionicons name="shield-checkmark-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Verify your identity to build trust with surrogates.</Text>
      </Section>

      <Section title="Understand the Process" icon={<Ionicons name="book-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Take time to learn about the surrogacy journey.</Text>
      </Section>

      <Section title="Communicate Clearly" icon={<Ionicons name="chatbubble-ellipses-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Be open about expectations and timelines.</Text>
      </Section>

      <Section title="Consider Agent Support" icon={<Ionicons name="people-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Agents can help guide you through matching and coordination.</Text>
      </Section>

      <PrimaryButton title="Find a Surrogate" onPress={() => router.push("/(tabs)/home/surrogate/surrogateList")} />
    </>
  );

  const renderAgentContent = () => (
    <>
      <Section title="Build a Strong Profile" icon={<Ionicons name="briefcase-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Highlight your expertise and services clearly.</Text>
      </Section>

      <Section title="Add Certifications" icon={<Ionicons name="ribbon-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Upload credentials to increase trust and credibility.</Text>
      </Section>

      <Section title="Verification Badge" icon={<Ionicons name="checkmark-circle-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Verified agents get more visibility and client trust.</Text>
      </Section>

      <Section title="Manage Matches Efficiently" icon={<Ionicons name="swap-horizontal-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Connect the right surrogates with the right parents.</Text>
      </Section>

      <Section title="Stay Responsive" icon={<Ionicons name="time-outline" size={20} />}>
        <Text style={{ color: colors.text, fontSize: 13 }}>Fast responses improve your ranking on the platform.</Text>
      </Section>

      <PrimaryButton title="Start Profile" onPress={() => router.push("/profile")} />
    </>
  );

  const getTitle = () => {
    switch (role) {
      case "SURROGATE":
        return "Getting Started as a Surrogate";
      case "INTENDED_PARENT":
        return "Getting Started as an Intended Parent";
      case "AGENT":
        return "Getting Started as an Agent";
      default:
        return "Getting Started";
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <YStack gap="$4">
          <Text style={{ color: colors.text, fontSize: 20 }} fontWeight="800">
            {getTitle()}
          </Text>

          {role === "SURROGATE" && renderSurrogateContent()}
          {role === "INTENDED_PARENT" && renderParentContent()}
          {role === "AGENT" && renderAgentContent()}
          
          {!role && (
            <>
              <Text style={{ color: colors.text, fontSize: 13 }}>Please log in to see personalized content.</Text>
              <PrimaryButton title="Go Home" onPress={() => router.push("/(tabs)/home")} />
            </>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}