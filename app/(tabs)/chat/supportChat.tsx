import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { YStack, Text } from "tamagui";
import { secureGet, secureSet } from "@/utils/storage";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ChatInput from "@/components/chat/ChatInput";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";

interface LocalMessage {
  id: string;
  from: "user" | "bot";
  text: string;
  suggestions?: string[];
}

type ChatStage = "ask_name" | "greet" | "showing_guide" | "ask_feedback" | "ask_next";

interface CategoryDef {
  label: string;
  keywords: string[];
  guide: string;
}

const SURROGATE_CATEGORIES: CategoryDef[] = [
  {
    label: "Profile & Account",
    keywords: ["profile", "account", "settings", "password", "logout", "bio", "picture", "username"],
    guide:
      "Here's how to set up your surrogate profile:\n\n" +
      "1. Go to your Profile tab and tap Edit Profile.\n" +
      "2. Fill in your personal details - name, age, location, and contact info.\n" +
      "3. Write a bio that highlights why you want to be a surrogate and what makes you a great match.\n" +
      "4. Upload a clear profile picture - tap the camera icon, choose from gallery, crop and save.\n" +
      "5. Set your password under Settings -> Security if you haven't already.\n" +
      "6. Keep your contact info and availability up to date so intended parents can reach you.\n\n" +
      "A complete profile gets more visibility from intended parents!",
  },
  {
    label: "Medical Info",
    keywords: ["medical", "health", "genotype", "blood", "pregnancy", "endometrium", "doctor"],
    guide:
      "Here's how to submit your medical information:\n\n" +
      "1. Go to your Profile tab and tap Medical Info.\n" +
      "2. Step 1 - Enter your blood type, genotype, RH factor, allergies, and any medical conditions.\n" +
      "3. Step 2 - Answer pregnancy history questions: previous pregnancies, C-sections, complications.\n" +
      "4. Upload Endometrium Report - select a clear image from your gallery, tap Continue to upload.\n" +
      "5. Review everything before submitting - you can go back to edit.\n" +
      "6. Tap Submit to save. Your medical info helps match you with the right intended parents.\n\n" +
      "Make sure your endometrium report is clear and legible!",
  },
  {
    label: "Surrogacy Experience",
    keywords: ["experience", "compensation", "survey", "first time", "been a surrogate", "level"],
    guide:
      "Here's how to share your surrogacy experience:\n\n" +
      "1. Go to your Profile and tap Surrogacy Experience.\n" +
      "2. Select Yes if you've been a surrogate before, or No if this is your first time.\n" +
      "3. If experienced, choose First-time or Experienced and answer the follow-up questions.\n" +
      "4. Set your compensation expectations - this helps match you with the right intended parents.\n" +
      "5. Use the 'Anything else you'd like to share?' box to add extra context about your journey.\n" +
      "6. Tap Save to submit.\n\n" +
      "Your experience level helps intended parents find the right match!",
  },
  {
    label: "KYC & Verification",
    keywords: ["kyc", "verify", "verification", "id", "document", "face scan", "selfie", "identity"],
    guide:
      "Here's how to get verified as a surrogate:\n\n" +
      "1. Go to Profile, then KYC Verification.\n" +
      "2. Step 1 - ID Upload: Choose your ID type (International Passport, Driver's License, or National ID). Take clear photos of the front and back, then upload.\n" +
      "3. Step 2 - Face Scan: Position your face within the frame in good lighting and follow the prompts.\n" +
      "4. Step 3 - Selfie with ID: Take a selfie holding your ID next to your face so both are clearly visible.\n" +
      "5. Review and submit - you'll receive a notification once verified (usually within 24-48 hours).\n\n" +
      "You must be KYC verified before you can match with intended parents or receive payments.",
  },
  {
    label: "Wallet & Payments",
    keywords: ["wallet", "payment", "money", "balance", "bank", "withdraw", "top up", "fund", "transaction"],
    guide:
      "Here's how to manage your wallet as a surrogate:\n\n" +
      "1. Go to your Home tab and tap the Wallet card.\n" +
      "2. Your balance shows at the top - tap the eye icon to toggle visibility.\n" +
      "3. Withdraw funds - tap Withdraw, select or add your bank account, enter the amount, and confirm.\n" +
      "4. Add a bank account - tap Add New Account, search for your bank, enter account number and holder name, then save.\n" +
      "5. Top up is available if you need to add funds (e.g., to unlock a profile).\n" +
      "6. Scroll down to see your transaction history.\n\n" +
      "Your wallet is where you'll receive compensation and manage payouts.",
  },
  {
    label: "Matching & Discovery",
    keywords: ["match", "matching", "find", "surrogate list", "unlock", "agent", "discovery"],
    guide:
      "Here's how matching works for surrogates:\n\n" +
      "1. Complete your profile, medical info, and KYC to become discoverable.\n" +
      "2. Intended parents and agents will be able to find you in search results.\n" +
      "3. When an intended parent is interested, you'll receive a match request in your notifications.\n" +
      "4. Accept or decline match requests from the Notifications or Chat tab.\n" +
      "5. Once matched, you can chat directly with the intended parent from the Chat tab.\n" +
      "6. You can also browse agents who can help facilitate the matching process.\n\n" +
      "The more complete your profile, the more likely you'll find the perfect match!",
  },
  {
    label: "Gallery & Photos",
    keywords: ["gallery", "photo", "image", "upload", "picture", "album", "delete photo"],
    guide:
      "Here's how to manage your photo gallery:\n\n" +
      "1. Go to Profile, then Gallery.\n" +
      "2. Tap Add Photo to upload images from your gallery or camera.\n" +
      "3. You can have up to 6 photos in your gallery.\n" +
      "4. To remove a photo, tap it and select the Delete option.\n" +
      "5. Your main profile picture is set separately from your profile edit screen.\n" +
      "6. Choose clear, warm photos that show your personality - intended parents love seeing genuine smiles!\n\n" +
      "A well-curated gallery helps intended parents connect with you.",
  },
  {
    label: "Notifications",
    keywords: ["notification", "alert", "reminder", "email", "sms", "push", "notify"],
    guide:
      "Here's how to stay updated as a surrogate:\n\n" +
      "1. Go to Settings, then Personalization or Notifications.\n" +
      "2. Toggle Push notifications to get alerts for new matches, messages, and updates.\n" +
      "3. Toggle Email notifications for important account updates and match activity.\n" +
      "4. Toggle SMS notifications for time-sensitive alerts.\n" +
      "5. Enable reminder preferences to get nudges about completing your profile or medical info.\n" +
      "6. Changes save automatically - customize so you never miss a match opportunity!\n\n" +
      "Stay on top of your surrogacy journey with the right notification mix.",
  },
];

const PARENT_CATEGORIES: CategoryDef[] = [
  {
    label: "Profile & Account",
    keywords: ["profile", "account", "settings", "password", "logout", "bio", "picture"],
    guide:
      "Here's how to set up your intended parent profile:\n\n" +
      "1. Go to your Profile tab and tap Edit Profile.\n" +
      "2. Fill in your personal details and preferences for a surrogate match.\n" +
      "3. Write about your journey and what you're looking for in a surrogate.\n" +
      "4. Upload a profile picture - tap the camera icon, choose from gallery, crop and save.\n" +
      "5. Set your password under Settings -> Security if you haven't already.\n\n" +
      "A warm, detailed profile helps surrogates feel connected to your journey!",
  },
  {
    label: "Finding a Surrogate",
    keywords: ["find", "surrogate", "browse", "search", "discover", "look"],
    guide:
      "Here's how to find a surrogate:\n\n" +
      "1. Go to the Surrogates section from your home screen.\n" +
      "2. Browse through profile cards - swipe to skip or tap View Profile for details.\n" +
      "3. Each card shows photos, age, location, experience level, and bio preview.\n" +
      "4. When you find someone who feels right, unlock their profile to see full contact and medical details.\n" +
      "5. After unlocking, you can send them a chat request to start the conversation.\n\n" +
      "Take your time - finding the right connection is the most important step!",
  },
  {
    label: "Matching Process",
    keywords: ["match", "matching", "unlock", "connect", "request", "chat"],
    guide:
      "Here's how the matching process works:\n\n" +
      "1. Browse available surrogates and find someone you connect with.\n" +
      "2. Pay a one-time unlock fee to view their full profile (contact + medical info).\n" +
      "3. After unlocking, send a chat request to start a conversation.\n" +
      "4. The surrogate can accept or decline your request.\n" +
      "5. Once connected, you can discuss next steps directly through the app.\n\n" +
      "You can also work with an agent to help guide you through the process.",
  },
  {
    label: "KYC & Verification",
    keywords: ["kyc", "verify", "verification", "id", "document", "face scan", "selfie", "identity"],
    guide:
      "Here's how to get verified as an intended parent:\n\n" +
      "1. Go to Profile, then KYC Verification.\n" +
      "2. Step 1 - ID Upload: Choose your ID type (International Passport, Driver's License, or National ID). Take clear photos of the front and back, then upload.\n" +
      "3. Step 2 - Face Scan: Position your face within the frame in good lighting and follow the prompts.\n" +
      "4. Step 3 - Selfie with ID: Take a selfie holding your ID next to your face so both are clearly visible.\n" +
      "5. Review and submit - you'll receive a notification once verified.\n\n" +
      "KYC verification helps build trust with surrogates and agents.",
  },
  {
    label: "Wallet & Payments",
    keywords: ["wallet", "payment", "money", "balance", "bank", "withdraw", "top up", "fund", "transaction"],
    guide:
      "Here's how to manage your wallet:\n\n" +
      "1. Go to your Home tab and tap the Wallet card.\n" +
      "2. Top up your wallet to pay for profile unlocks and other services.\n" +
      "3. Use Paystack to add funds - card, bank transfer, or USSD.\n" +
      "4. Track your spending in the transaction history section.\n\n" +
      "Your wallet is where you manage all payments related to your surrogacy journey.",
  },
  {
    label: "Notifications",
    keywords: ["notification", "alert", "reminder", "email", "sms", "push", "notify"],
    guide:
      "Here's how to stay updated:\n\n" +
      "1. Go to Settings, then Personalization or Notifications.\n" +
      "2. Toggle Push notifications for new surrogate matches and messages.\n" +
      "3. Toggle Email and SMS notifications as you prefer.\n" +
      "4. Customize so you never miss a potential match!\n\n" +
      "Stay on top of your journey with timely alerts.",
  },
];

const AGENT_CATEGORIES: CategoryDef[] = [
  {
    label: "Profile & Account",
    keywords: ["profile", "account", "settings", "password", "logout", "bio", "picture", "certification"],
    guide:
      "Here's how to set up your agent profile:\n\n" +
      "1. Go to your Profile tab and fill in your professional details.\n" +
      "2. Highlight your experience, certifications, and services you offer.\n" +
      "3. Add certifications to build trust with intended parents and surrogates.\n" +
      "4. Upload a professional profile picture.\n" +
      "5. Set your password under Settings -> Security.\n\n" +
      "A complete professional profile attracts more clients!",
  },
  {
    label: "Managing Surrogates",
    keywords: ["surrogate", "manage", "browse", "find", "discover", "pool", "available"],
    guide:
      "Here's how to manage surrogates:\n\n" +
      "1. Browse available surrogates from the Surrogates section.\n" +
      "2. View profile cards with photos, experience level, and bio.\n" +
      "3. Unlock a surrogate's full profile to access their contact and medical details.\n" +
      "4. Connect with surrogates to facilitate matches with intended parents.\n" +
      "5. Fast responses and good communication improve your ranking.\n\n" +
      "Build a strong network of surrogates to better serve your clients!",
  },
  {
    label: "Matching & Discovery",
    keywords: ["match", "matching", "connect", "parent", "intended parent", "request"],
    guide:
      "Here's how matching works for agents:\n\n" +
      "1. Receive requests from intended parents looking for surrogates.\n" +
      "2. Browse your pool of available surrogates to find good matches.\n" +
      "3. Facilitate introductions between intended parents and surrogates.\n" +
      "4. Track your active matches and communications in the Chat tab.\n" +
      "5. Get verified for more visibility and client trust.\n\n" +
      "Your expertise helps create successful surrogacy journeys!",
  },
  {
    label: "KYC & Verification",
    keywords: ["kyc", "verify", "verification", "id", "document", "face scan", "selfie", "identity"],
    guide:
      "Here's how to get verified as an agent:\n\n" +
      "1. Go to Profile, then KYC Verification.\n" +
      "2. Step 1 - ID Upload: Choose your ID type and upload clear photos.\n" +
      "3. Step 2 - Face Scan: Position your face within the frame in good lighting.\n" +
      "4. Step 3 - Selfie with ID: Take a selfie holding your ID.\n" +
      "5. Review and submit - verification helps build trust with clients.\n\n" +
      "Verified agents get higher visibility and ranking on the platform!",
  },
  {
    label: "Wallet & Payments",
    keywords: ["wallet", "payment", "money", "balance", "bank", "withdraw", "top up", "fund", "transaction"],
    guide:
      "Here's how to manage your wallet as an agent:\n\n" +
      "1. Go to your Home tab and tap the Wallet card.\n" +
      "2. Top up to pay for profile unlocks and other services.\n" +
      "3. Withdraw your earnings to your linked bank account.\n" +
      "4. Add a bank account for payouts.\n" +
      "5. Track all transactions in your history.\n\n" +
      "Your wallet keeps your business finances organized.",
  },
  {
    label: "Notifications",
    keywords: ["notification", "alert", "reminder", "email", "sms", "push", "notify"],
    guide:
      "Here's how to stay updated as an agent:\n\n" +
      "1. Go to Settings, then Personalization or Notifications.\n" +
      "2. Toggle Push notifications for new requests and messages.\n" +
      "3. Toggle Email and SMS for important client updates.\n" +
      "4. Stay responsive - quick replies improve your ranking!\n\n" +
      "Never miss an opportunity to connect with clients.",
  },
];

const getCategoriesForRole = (role?: string): CategoryDef[] => {
  if (role === "SURROGATE") return SURROGATE_CATEGORIES;
  if (role === "INTENDED_PARENT") return PARENT_CATEGORIES;
  if (role === "AGENT") return AGENT_CATEGORIES;
  return SURROGATE_CATEGORIES;
};

const matchCategory = (input: string, categories: CategoryDef[]): CategoryDef | null => {
  const lower = input.toLowerCase();
  for (const cat of categories) {
    if (cat.keywords.some((kw) => lower.includes(kw))) return cat;
    if (lower.includes(cat.label.toLowerCase())) return cat;
  }
  return null;
};

export default function SupportChatScreen() {
  const { user } = useAuth();
  const role = user?.role?.trim();
  const userName = user?.name || user?.username || user?.firstName;
  const categories = getCategoriesForRole(role);
  const categoryLabels = categories.map((c) => c.label);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex", borderTopWidth: 0, backgroundColor: "#FFFFFF" } });
    };
  }, [navigation]);

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [userName_, setUserName_] = useState(userName || "");
  const [stage, setStage] = useState<ChatStage>("ask_name");
  const [lastCategory, setLastCategory] = useState<string>("");
  const flatListRef = useRef<FlatList<LocalMessage>>(null);
  const persistTimer = useRef<ReturnType<typeof setTimeout>>();

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: false });
  }, []);

  // Start with greeting
  useEffect(() => {
    const start = async () => {
      const saved = await secureGet("support_chat_history");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setMessages(parsed.messages || []);
          setStage(parsed.stage || "main_menu");
          if (parsed.userName) setUserName_(parsed.userName);
          if (parsed.lastCategory) setLastCategory(parsed.lastCategory);
          return;
        } catch {
          // fall through to fresh start
        }
      }

      const hasName = Boolean(userName);
      const initialStage: ChatStage = hasName ? "greet" : "ask_name";
      setStage(initialStage);
      setUserName_(userName || "");
      const initialMessages: LocalMessage[] = hasName
        ? [
            {
              id: "welcome",
              from: "bot",
              text: `Hi I'm SurroBot! Great to see you, ${userName}! \n\nI can help you with:\n\n${categoryLabels.map((c) => `- ${c}`).join("\n")}\n\nJust type what you need or pick an option below!`,
              suggestions: categoryLabels,
            },
          ]
        : [
            {
              id: "welcome",
              from: "bot",
              text: "Hi I'm SurroBot! Your personal guide to everything SurroSantara.\n\nWhat's your name?",
            },
          ];
      setMessages(initialMessages);
    };
    start();
  }, []);

  // Debounced persist to avoid blocking scroll
  useEffect(() => {
    if (messages.length === 0) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      secureSet("support_chat_history", JSON.stringify({ messages, stage, userName: userName_, lastCategory }));
    }, 2000);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [messages, stage, userName_, lastCategory]);

  const addBotMessage = (text: string, suggestions?: string[]) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: "bot", text, suggestions },
    ]);
    scrollToBottom();
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: "user", text },
    ]);
    setIsBotTyping(true);
    scrollToBottom();
    setTimeout(() => handleBotReply(text), 800);
  };

  const handleBotReply = (text: string) => {
    setIsBotTyping(false);
    const trimmed = text.trim().toLowerCase();
    const displayName = userName_ || "friend";

    // ask_name: user tells us their name
    if (stage === "ask_name") {
      const name = trimmed.length > 0 && trimmed.length < 30 ? trimmed : displayName;
      setUserName_(name);
      setStage("greet");
      addBotMessage(
        `Nice to meet you, ${name}! \n\nI can help you with:\n\n${categoryLabels.map((c) => `- ${c}`).join("\n")}\n\nJust type what you need or pick an option below!`,
        categoryLabels,
      );
      return;
    }

    // greet: user picks a category
    if (stage === "greet") {
      const cat = matchCategory(trimmed, categories);
      if (cat) {
        setLastCategory(cat.label);
        setStage("showing_guide");
        addBotMessage(cat.guide);
        return;
      }
      addBotMessage(
        "Sorry I didn't get that, please select from the options below.",
        categoryLabels,
      );
      return;
    }

    // showing_guide: guide was just shown, now ask for feedback
    if (stage === "showing_guide") {
      setStage("ask_feedback");
      addBotMessage(
        `How helpful was that guide on ${lastCategory}?`,
        ["Very helpful", "Somewhat helpful", "Not helpful"],
      );
      return;
    }

    // ask_feedback: user gave feedback, ask what next
    if (stage === "ask_feedback") {
      if (trimmed.includes("very") || trimmed.includes("somewhat")) {
        addBotMessage("Glad I could help! \n\nIs there anything else you'd like to know, or would you like to speak to a customer agent?", ["Yes, something else", "Talk to a human", "No, I'm done"]);
      } else if (trimmed.includes("not")) {
        addBotMessage("I'm sorry about that. \n\nWould you like to try a different topic, or speak directly to a customer agent?", ["Try another topic", "Talk to a human"]);
      } else {
        addBotMessage("Thanks for letting me know!\n\nIs there anything else you'd like to know, or would you like to speak to a customer agent?", ["Yes, something else", "Talk to a human", "No, I'm done"]);
      }
      setStage("ask_next");
      return;
    }

    // ask_next: user decides next action
    if (stage === "ask_next") {
      if (trimmed.includes("yes") || trimmed.includes("something else") || trimmed.includes("another topic") || trimmed.includes("try another")) {
        setStage("greet");
        addBotMessage("Sure! What would you like help with?", categoryLabels);
        return;
      }

      if (trimmed.includes("talk") || trimmed.includes("human") || trimmed.includes("agent") || trimmed.includes("speak")) {
        addBotMessage("I'll connect you to a customer support agent. Please hold on while we find someone to help you.");
        return;
      }

      if (trimmed.includes("done") || trimmed.includes("no") || trimmed.includes("bye") || trimmed.includes("thanks")) {
        addBotMessage("Alright! If you ever need me again, just come back to SurroBot. Have a great day! \n\nFeel free to start over anytime.", ["Start over"]);
        return;
      }

      // Unrecognized
      addBotMessage(
        "Sorry I didn't get that, please select from the options below.",
        ["Yes, something else", "Talk to a human", "No, I'm done"],
      );
      return;
    }

    // fallback
    if (trimmed.includes("start over") || trimmed.includes("restart")) {
      setStage("ask_name");
      setMessages([
        {
          id: Date.now().toString(),
          from: "bot",
          text: "Sure, let's start fresh! \n\nHi I'm SurroBot! What's your name?",
        },
      ]);
      return;
    }

    setStage("greet");
    addBotMessage(
      "Sorry I didn't get that, please select from the options below.",
      categoryLabels,
    );
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} padding={20}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            removeClippedSubviews
            windowSize={5}
            maxToRenderPerBatch={10}
            renderItem={({ item }) => (
              <YStack
                alignSelf={item.from === "user" ? "flex-end" : "flex-start"}
                backgroundColor={item.from === "user" ? "#0E0E55" : "#f2f2f2"}
                borderRadius={16}
                padding={10}
                marginVertical={4}
                maxWidth="80%"
              >
                <Text color={item.from === "user" ? "#FFFFFF" : "#0E0E55"}>
                  {item.text}
                </Text>

                {item.from === "bot" && item.suggestions && (
                  <YStack style={{ marginTop: 8 }}>
                    {item.suggestions.map((suggestion, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleSuggestionPress(suggestion)}
                        style={{
                          backgroundColor: "#0E0E55",
                          borderRadius: 20,
                          paddingVertical: 6,
                          paddingHorizontal: 14,
                          marginTop: 6,
                        }}
                      >
                        <Text color="#FFFFFF" fontSize={13}>
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </YStack>
                )}
              </YStack>
            )}
            ListFooterComponent={
              isBotTyping ? (
                <YStack
                  alignSelf="flex-start"
                  backgroundColor="#f2f2f2"
                  borderRadius={16}
                  padding={10}
                  marginVertical={6}
                  maxWidth="60%"
                >
                  <TypingIndicator />
                </YStack>
              ) : null
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />

          <ChatInput onSend={sendMessage} disabled={isBotTyping} />
        </YStack>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
