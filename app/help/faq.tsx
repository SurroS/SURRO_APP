import React, { useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  icon: string;
  items: FaqItem[];
}

const allCategories: FaqCategory[] = [
  {
    title: "General",
    icon: "information-circle-outline",
    items: [
      {
        id: "g1",
        question: "How secure is my data and personal information?",
        answer: "Very secure. We only share data based on roles and preferences. Surrogates cannot tell who you are unless you reveal yourself. Surrogate profiles are not visible to other users until they are verified. Your privacy and safety are our top priority.",
      },
      {
        id: "g2",
        question: "Can I delete my account and data permanently?",
        answer: "Yes, you can request permanent deletion of your account and all associated data at any time.",
      },
      {
        id: "g3",
        question: "How long does the matching process take?",
        answer: "Matching is instant. As soon as your profile is complete and you meet the requirements, you can start browsing and connecting with matches immediately.",
      },
      {
        id: "g4",
        question: "Can I use the platform without revealing my identity?",
        answer: "Yes. As an intended parent, you can use an agent to keep your identity anonymous. The agent will represent you throughout the process.",
      },
      {
        id: "g5",
        question: "What happens if I encounter inappropriate behavior?",
        answer: "You can report the user directly to customer service through the app. Please provide the name and email address of the user involved, and our team will investigate promptly.",
      },
      {
        id: "g6",
        question: "How do I contact customer support?",
        answer: "You can reach our customer service team through the Chat tab on the app. Select 'Customer Service' from the chat options to speak with a representative.",
      },
      {
        id: "g7",
        question: "Can I update my profile information after registration?",
        answer: "Yes. You can edit your profile information anytime from the profile settings section. Keep your details accurate to improve your match recommendations.",
      },
    ],
  },
  {
    title: "Payments & Wallet",
    icon: "wallet-outline",
    items: [
      {
        id: "p1",
        question: "How does the wallet system work?",
        answer: "Your wallet holds your account balance. You top it up from the Wallet screen on the Home tab, and funds are deducted when you unlock profiles or pay for services.",
      },
      {
        id: "p2",
        question: "What happens if I pay to unlock a surrogate's profile and they don't respond?",
        answer: "You can click the 'Surrogate not responding' button on their profile. We will investigate within 24 hours and provide that surrogate or another available surrogate for free.",
      },
      {
        id: "p3",
        question: "Can I get a refund if a match doesn't work out?",
        answer: "There are no refunds, but getting a surrogate or agent is guaranteed. If a match doesn't work out, we will make sure you are assigned someone else. All guarantees expire within 30 days — no support or return after that.",
      },
      {
        id: "p4",
        question: "Is there a limit on how many profiles I can unlock?",
        answer: "No, there is no limit. You can unlock as many profiles as you need, but you will be charged for each unlocked profile.",
      },
      {
        id: "p5",
        question: "What payment methods are accepted?",
        answer: "Topping up your wallet is done through secure payment methods available in your region. Available options will be shown when you make a top-up.",
      },
    ],
  },
  {
    title: "Surrogates",
    icon: "person-outline",
    items: [
      {
        id: "s1",
        question: "What medical or background checks are required?",
        answer: "You will need to provide your endometrium scan result and other relevant medical documents. Complete medical history, lifestyle information, and any previous surrogacy experience details will also be required during verification.",
      },
      {
        id: "s2",
        question: "Can I change my compensation after being matched?",
        answer: "No, compensation is set at the time of matching and cannot be changed afterward.",
      },
      {
        id: "s3",
        question: "What if I need to withdraw from a match?",
        answer: "You can withdraw within 30 days to remain relevant on the app. Withdrawing after this period may affect your standing.",
      },
      {
        id: "s4",
        question: "How are intended parents vetted before matching?",
        answer: "Intended parents provide their personal data and preferences, which are reviewed to ensure compatibility and safety before any match is suggested.",
      },
      {
        id: "s5",
        question: "How do I get verified as a surrogate?",
        answer: "Submit your valid ID, required medical documents, and complete your profile with accurate personal and lifestyle details. Verification builds trust and increases your visibility to potential matches.",
      },
    ],
  },
  {
    title: "Intended Parents",
    icon: "heart-outline",
    items: [
      {
        id: "ip1",
        question: "How do I find and connect with a surrogate?",
        answer: "Browse surrogates in the Network tab. Unlock their profiles to see full details including contact info and medical history. Once unlocked, you can reach out directly via chat or call.",
      },
      {
        id: "ip2",
        question: "How do I know a surrogate is verified and genuine?",
        answer: "Verified surrogates will have a verified badge on their profile. This badge indicates they have completed the verification process and their documents have been reviewed.",
      },
      {
        id: "ip3",
        question: "What if I'm not satisfied with the surrogates in my network?",
        answer: "We make sure you have the most important match details before you make your choice. Regardless, you have 30 days to cancel before committing.",
      },
      {
        id: "ip4",
        question: "Can I work with multiple surrogates at once?",
        answer: "Yes. You can unlock multiple surrogate profiles and reach out to them simultaneously to find the best match for your needs.",
      },
      {
        id: "ip5",
        question: "Should I use an agent?",
        answer: "Using an agent keeps you anonymous throughout the process. Agents can also help guide you through matching, coordination, and communication with surrogates.",
      },
    ],
  },
  {
    title: "Agents",
    icon: "people-outline",
    items: [
      {
        id: "a1",
        question: "How do I get verified as a legitimate agent?",
        answer: "The verification process for agents is the same as for surrogates. Submit your credentials, certification documents, and complete your profile to get verified.",
      },
      {
        id: "a2",
        question: "Can I represent surrogates and parents at the same time?",
        answer: "Yes, you can represent both surrogates and intended parents. This allows you to facilitate matches and manage the process from both sides.",
      },
      {
        id: "a3",
        question: "What happens if a client I introduced backs out?",
        answer: "It is your responsibility as an agent to manage and maintain your clients' interest throughout the process. Good communication and expectation-setting are key.",
      },
      {
        id: "a4",
        question: "How do I find clients?",
        answer: "Complete your profile to be discoverable. You can receive parent requests, access the pool of available surrogates, and facilitate introductions between parties.",
      },
    ],
  },
];

export default function FaqScreen() {
  const { user } = useAuth();
  const role = user?.role?.trim();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const roleOrder = role === "SURROGATE" ? ["General", "Payments & Wallet", "Surrogates", "Intended Parents", "Agents"]
    : role === "INTENDED_PARENT" ? ["General", "Payments & Wallet", "Intended Parents", "Surrogates", "Agents"]
    : role === "AGENT" ? ["General", "Payments & Wallet", "Agents", "Surrogates", "Intended Parents"]
    : ["General", "Payments & Wallet", "Surrogates", "Intended Parents", "Agents"];

  const sortedCategories = [...allCategories].sort(
    (a, b) => roleOrder.indexOf(a.title) - roleOrder.indexOf(b.title)
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScreenHeader title="FAQ" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {sortedCategories.map((category) => (
          <YStack key={category.title} marginBottom={24}>
            <XStack alignItems="center" gap={8} marginBottom={12}>
              <Ionicons name={category.icon as any} size={20} color={colors.primary} />
              <Text fontSize={18} fontWeight="700" color={colors.primary}>
                {category.title}
              </Text>
            </XStack>
            {category.items.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleExpand(item.id)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: "#F8F8FF",
                    borderRadius: 10,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: "#EAEAEA",
                    overflow: "hidden",
                  }}
                >
                  <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    padding={14}
                  >
                    <Text
                      fontSize={14}
                      fontWeight="500"
                      color="#222"
                      flex={1}
                      marginRight={8}
                    >
                      {item.question}
                    </Text>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#666"
                    />
                  </XStack>
                  {isExpanded && (
                    <YStack
                      paddingHorizontal={14}
                      paddingBottom={14}
                      backgroundColor="#FFF"
                    >
                      <Text fontSize={13} color="#444" lineHeight={20}>
                        {item.answer}
                      </Text>
                    </YStack>
                  )}
                </TouchableOpacity>
              );
            })}
          </YStack>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
