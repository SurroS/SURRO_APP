import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/auth";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import BottomModal from "@/components/modals/BottomModal";

const Section = ({ icon, title, children }: any) => (
  <View style={{ marginBottom: 16, borderRadius: 16, overflow: "hidden" }}>
    {/* Gradient Background */}
    <Svg height="100%" width="100%" style={{ position: "absolute" }}>
      <Defs>
        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.6" />
          <Stop offset="100%" stopColor={colors.primary} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
    </Svg>

    {/* Content */}
    <YStack padding="$4" borderRadius="$4">
      <XStack alignItems="center" gap="$2" marginBottom="$2">
        {icon}
        <Text fontSize="$5" fontWeight="700">
          {title}
        </Text>
      </XStack>
      <YStack gap="$2">{children}</YStack>
    </YStack>
  </View>
);

export default function GettingMatchedScreen() {
  const { user } = useAuth();
  const role = user?.role?.trim();
  const [showModal, setShowModal] = useState(false);

  const getButtonText = () => {
    switch (role) {
      case "SURROGATE":
        return "Complete My Profile";
      case "AGENT":
        return "Get a Client";
      case "INTENDED_PARENT":
        return "Get a Match";
      default:
        return "Get Started";
    }
  };

  const handlePrimaryAction = () => {
    setShowModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <YStack gap="$4">
          <Text color={colors.text} fontSize="$4" fontWeight="800">
            Getting Matched
          </Text>
          <Text color={colors.text} marginLeft={"$2"} fontSize="$3">
            SurroSantara helps you connect with the right people through a
            secure and guided matching process. Every match is based on
            compatibility, preferences, and mutual choice.
          </Text>

          {/* Surrogates */}
          <Section
            title="Surrogates"
            icon={
              <Ionicons name="person-outline" size={20} color={colors.white} />
            }
          >
            <Text>
              Start by completing your profile with accurate details about your
              health, experience, lifestyle, and availability.
            </Text>

            <Text fontWeight="600">Once you’re active:</Text>
            <Text>• Get discovered by intended parents and agents</Text>
            <Text>• Receive personalized match suggestions</Text>
            <Text>• Accept or decline connection requests</Text>

            <Text>
              When there’s interest, you can chat, ask questions, and decide
              what feels right.
            </Text>

            <Text fontWeight="700">You choose who you move forward with.</Text>
          </Section>

          {/* Intended Parents */}
          <Section
            title="Intended Parents"
            icon={
              <Ionicons name="heart-outline" size={20} color={colors.white} />
            }
          >
            <Text>
              Tell us your preferences—what matters most to you in a surrogate,
              including location, experience, and expectations.
            </Text>

            <Text fontWeight="600">You can:</Text>
            <Text>• View recommended matches</Text>
            <Text>• Browse and shortlist profiles</Text>
            <Text>• Work with an agent for guided support</Text>

            <Text>
              When you find a good fit, start a conversation and build a
              connection before moving forward.
            </Text>

            <Text fontWeight="700">
              The right match is both practical and personal.
            </Text>
          </Section>

          {/* Agents */}
          <Section
            title="Agents"
            icon={
              <Ionicons name="people-outline" size={20} color={colors.white} />
            }
          >
            <Text>
              Set up your profile to reflect your expertise and the type of
              clients you support.
            </Text>

            <Text fontWeight="600">With SurroSantara, you can:</Text>
            <Text>• Receive parent requests</Text>
            <Text>• Access a pool of available surrogates</Text>
            <Text>• Facilitate and manage introductions</Text>

            <Text>
              You help both sides align and move forward with confidence.
            </Text>

            <Text fontWeight="700">
              Your efficiency and trust drive better matches.
            </Text>
          </Section>

          {/* After Match */}
          <Section
            title="After a Match"
            icon={
              <Ionicons
                name="checkmark-done-outline"
                size={20}
                color={colors.white}
              />
            }
          >
            <Text>• Conversations deepen</Text>
            <Text>• Expectations are aligned</Text>
            <Text>
              • The journey moves into next steps with professional support
            </Text>

            <Text>SurroSantara stays with you throughout the process.</Text>
          </Section>

          <PrimaryButton
            title={getButtonText()}
            onPress={handlePrimaryAction}
          />
        </YStack>
      </ScrollView>

      <BottomModal visible={showModal} onClose={() => setShowModal(false)}>
        <YStack gap="$4" padding="$4" alignItems="center">
          <Text
            color={colors.text}
            fontSize="$5"
            fontWeight="700"
            textAlign="center"
          >
            {role === "INTENDED_PARENT"
              ? "Find Your Match"
              : role === "AGENT"
                ? "Find Clients"
                : "What’s Next?"}
          </Text>

          <Text fontSize="$3" style={{ color: colors.text }} textAlign="center">
            {role === "SURROGATE"
              ? "Complete your profile to get matched with intended parents. "
              : role === "AGENT"
                ? "Complete your profile to get matched with intended parents. "
                : "Complete your profile or browse to find matches"}
          </Text>

          <PrimaryButton
            title="Complete My Profile"
            onPress={() => {
              setShowModal(false);
              router.replace("/profile");
            }}
          />

          <Text color={colors.text} fontSize={12} textAlign="center">
            Skip if you have already completed your profile
          </Text>

          {role === "INTENDED_PARENT" && (
            <>
              <PrimaryButton
                title="Find Surrogate"
                onPress={() => {
                  setShowModal(false);
                  router.push("/surrogate/surrogateList");
                }}
              />

              <PrimaryButton
                title="Find Agent"
                onPress={() => {
                  setShowModal(false);
                  router.push("/agent/agentsListScreen");
                }}
              />
            </>
          )}

          {role === "AGENT" && (
            <PrimaryButton
              title="Find Surrogates"
              onPress={() => {
                setShowModal(false);
                router.push("/surrogate/surrogateList");
              }}
            />
          )}

          <Button
            onPress={() => {
              setShowModal(false);
              router.replace("/(tabs)/home");
            }}
            backgroundColor="transparent"
            borderWidth={0}
          >
            <Text color={colors.primary}>Skip</Text>
          </Button>
        </YStack>
      </BottomModal>
    </SafeAreaView>
  );
}
