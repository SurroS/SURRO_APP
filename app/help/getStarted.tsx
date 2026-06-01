// THREE SCREENS: Surrogate, Intended Parent, Agent Orientation

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
      <Text style={{ color: colors.text }} fontWeight="700" fontSize={15}>
        {title}
      </Text>
    </XStack>
    <YStack gap="$2">{children}</YStack>
  </YStack>
);

export default function GetStartedScreen() {
  const { user } = useAuth();
  const role = user?.role?.trim();

  const renderSurrogateContent = () => (
    <>
      <Section
        title="Complete Registration"
        icon={<Ionicons name="document-text-outline" size={18} />}
      >
        <Text fontSize={13}>Fill in accurate personal, medical, and lifestyle details.</Text>
        <Text fontSize={13}>Incomplete profiles reduce your chances of being matched.</Text>
        <Text fontSize={13}>Upload all required documents to speed up verification.</Text>
        <Text fontSize={13}>Double-check your contact info so matches can reach you.</Text>
      </Section>

      <Section
        title="KYC & Verification"
        icon={<Ionicons name="shield-checkmark-outline" size={20} />}
      >
        <Text fontSize={13}>Submit valid ID and required documents.</Text>
        <Text fontSize={13}>Verification builds trust and increases visibility.</Text>
        <Text fontSize={13}>Choose a well-lit environment when taking verification photos.</Text>
        <Text fontSize={13}>Ensure your documents are not expired before uploading.</Text>
      </Section>

      <Section
        title="Profile Picture Matters"
        icon={<Ionicons name="image-outline" size={20} />}
      >
        <Text fontSize={13}>Use a clear, recent, and friendly photo.</Text>
        <Text fontSize={13}>Profiles with good photos get significantly more attention.</Text>
        <Text fontSize={13}>Avoid group photos or images with sunglasses/hats.</Text>
        <Text fontSize={13}>A warm, professional headshot works best for first impressions.</Text>
      </Section>

      <Section
        title="Set Realistic Compensation"
        icon={<Ionicons name="cash-outline" size={20} />}
      >
        <Text fontSize={13}>Choose compensation that reflects market expectations.</Text>
        <Text fontSize={13}>Unrealistic amounts can delay matching.</Text>
        <Text fontSize={13}>Research typical surrogate compensation in your region.</Text>
        <Text fontSize={13}>Remember that total packages often include base pay plus expenses.</Text>
      </Section>

      <Section
        title="Stay Active"
        icon={<Ionicons name="chatbubble-outline" size={20} />}
      >
        <Text fontSize={13}>Respond quickly to messages and requests.</Text>
        <Text fontSize={13}>Active users are prioritized in recommendations.</Text>
        <Text fontSize={13}>Check your notifications daily so you don't miss opportunities.</Text>
        <Text fontSize={13}>Update your availability status to attract the right matches.</Text>
      </Section>

      <PrimaryButton
        title="Start Profile "
        onPress={() => router.push("/profile")}
      />
    </>
  );

  const renderParentContent = () => (
    <>
      <Section
        title="Complete Your Profile"
        icon={<Ionicons name="person-outline" size={20} />}
      >
        <Text>Share your preferences, expectations, and requirements.</Text>
        <Text>This helps us recommend the best matches.</Text>
      </Section>

      <Section
        title="Verification"
        icon={<Ionicons name="shield-checkmark-outline" size={20} />}
      >
        <Text>Verify your identity to build trust with surrogates.</Text>
      </Section>

      <Section
        title="Understand the Process"
        icon={<Ionicons name="book-outline" size={20} />}
      >
        <Text>Take time to learn about the surrogacy journey.</Text>
      </Section>

      <Section
        title="Communicate Clearly"
        icon={<Ionicons name="chatbubble-ellipses-outline" size={20} />}
      >
        <Text>Be open about expectations and timelines.</Text>
      </Section>

      <Section
        title="Consider Agent Support"
        icon={<Ionicons name="people-outline" size={20} />}
      >
        <Text>
          Agents can help guide you through matching and coordination.
        </Text>
      </Section>

      <PrimaryButton
        title="Find a Surrogate "
        onPress={() => router.push("/(tabs)/home/surrogate/surrogateList")}
      />
    </>
  );

  const renderAgentContent = () => (
    <>
      <Section
        title="Build a Strong Profile"
        icon={<Ionicons name="briefcase-outline" size={20} />}
      >
        <Text>Highlight your expertise and services clearly.</Text>
      </Section>

      <Section
        title="Add Certifications"
        icon={<Ionicons name="ribbon-outline" size={20} />}
      >
        <Text>Upload credentials to increase trust and credibility.</Text>
      </Section>

      <Section
        title="Verification Badge"
        icon={<Ionicons name="checkmark-circle-outline" size={20} />}
      >
        <Text>Verified agents get more visibility and client trust.</Text>
      </Section>

      <Section
        title="Manage Matches Efficiently"
        icon={<Ionicons name="swap-horizontal-outline" size={20} />}
      >
        <Text>Connect the right surrogates with the right parents.</Text>
      </Section>

      <Section
        title="Stay Responsive"
        icon={<Ionicons name="time-outline" size={20} />}
      >
        <Text>Fast responses improve your ranking on the platform.</Text>
      </Section>

      <PrimaryButton
        title="Start Profile "
        onPress={() => router.push("/profile")}
      />
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
      <Text fontSize="$4" fontWeight="800" style={{ color: colors.text }}>
        {getTitle()}
      </Text>

          {role === "SURROGATE" && renderSurrogateContent()}
          {role === "INTENDED_PARENT" && renderParentContent()}
          {role === "AGENT" && renderAgentContent()}

          {!role && (
            <>
              <Text>Please log in to see personalized content.</Text>
              <PrimaryButton
                title="Go Home"
                onPress={() => router.push("/(tabs)/home")}
              />
            </>
          )}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
