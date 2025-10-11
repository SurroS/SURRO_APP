import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

export default function InviteScreen() {
  const router = useRouter();
  const [inviteLink] = useState("https://surrosantara.com/invite/12345");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      Alert.alert("Copied", "Invite link copied to clipboard");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to copy link");
    }
  };

  const handleShare = (mode: "whatsapp" | "facebook" | "mail" | "x") => {
    const encoded = encodeURIComponent(inviteLink);
    switch (mode) {
      case "whatsapp":
        Linking.openURL(`whatsapp://send?text=${encoded}`).catch(() =>
          Alert.alert("Unable", "WhatsApp not available")
        );
        break;
      case "facebook":
        Linking.openURL(
          `https://www.facebook.com/sharer/sharer.php?u=${encoded}`
        );
        break;
      case "mail":
        Linking.openURL(`mailto:?subject=Join%20me&body=${encoded}`);
        break;
      case "x":
        Linking.openURL(`https://twitter.com/intent/tweet?text=${encoded}`);
        break;
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      contentContainerStyle={{ padding: 16, alignItems: "stretch" }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <XStack
        alignItems="center"
        justifyContent="space-between"
        marginBottom={18}
      >
        <Button
          size="$3"
          backgroundColor="transparent"
          onPress={() => router.back()}
          pressStyle={{ opacity: 0.8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#0E0E55" />
        </Button>

        <Text fontSize={18} fontWeight="700" color="#0E0E55">
          Refer a friend
        </Text>

        <YStack width={36} />
      </XStack>

      {/* Hero Section */}
      <XStack alignItems="center" gap={12} marginBottom={18}>
        <YStack
          width={120}
          height={120}
          borderRadius={12}
          overflow="hidden"
          justifyContent="center"
          alignItems="center"
          style={{ transform: [{ rotate: "-3deg" }] }}
          backgroundColor="#FFF"
          shadowColor="#000"
          shadowOpacity={0.1}
          shadowOffset={{ width: 0, height: 2 }}
          elevation={3}
        >
          <Image
            source={require("@/assets/images/gift.png")}
            style={{ width: 100, height: 100, resizeMode: "contain" }}
          />
        </YStack>

        <YStack flex={1} justifyContent="center" gap={8}>
          <Text fontSize={20} fontWeight="800" color="#0E0E55">
            INVITE AND{"\n"}GET $5
          </Text>

          <Button
            size="$4"
            backgroundColor="#EBF4FE"
            borderRadius={12}
            alignSelf="flex-start"
            onPress={() => Alert.alert("Redeem", "Redeem flow placeholder")}
          >
            <Text color="#0E0E55" fontWeight="600">
              Redeem prize
            </Text>
          </Button>
        </YStack>
      </XStack>

      {/* Invite link box */}
      <YStack
        backgroundColor="#F7F7FA"
        borderRadius={12}
        padding={12}
        marginBottom={14}
        justifyContent="center"
      >
        <XStack alignItems="center" gap={10} justifyContent="space-between">
          <Text numberOfLines={1} ellipsizeMode="middle" flex={1} color="#333">
            {inviteLink}
          </Text>

          <Button
            size="$3"
            backgroundColor="#0E0E55"
            borderRadius={8}
            onPress={handleCopy}
          >
            <Text color="white" fontWeight="600">
              {copied ? "Copied" : "Copy"}
            </Text>
          </Button>
        </XStack>
      </YStack>

      {/* Share buttons */}
      <YStack marginBottom={35}>
        <Text fontSize={14} fontWeight="600" color="#0E0E55" marginBottom={8}>
          Share to
        </Text>

        <XStack 
          justifyContent="space-around"
          alignItems={"center"}
          height={40}
        >
          <Pressable
            style={styles.pressable}
            onPress={() => handleShare("whatsapp")}
          >
            <Image
              source={require("@/assets/images/whatsapp1.png")}
              style={styles.socialIcon}
            />
            <Text color="$text" fontSize={14}>
              WhatsApp
            </Text>
          </Pressable>

          <Pressable
          style={styles.pressable}
            onPress={() => handleShare("x")} 
          >
            <Image source={require("@/assets/images/x_icon1.png")} 
            style={styles.socialIcon}
            />
            
            <Text color="$text" fontSize={14}>
              X
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleShare("facebook")} 
            style={styles.pressable}
          >
            <Image
              source={require("@/assets/images/facebook1.png")}
              style={styles.socialIcon}

            />
            <Text color="$text" fontSize={14}>
              Facebook
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleShare("mail")}
            style={styles.pressable}
          >
            <Image
              source={require("@/assets/images/mail.png")}
              style={styles.socialIcon}
            />
            <Text color="$text" fontSize={14}>
              Mail
            </Text>
          </Pressable>
        </XStack>
      </YStack>

      {/* How it works */}
      <YStack marginBottom={24} gap={12}>
        <Text fontSize={16} fontWeight="700" color="#0E0E55">
          How it works
        </Text>

        {[
          {
            step: 1,
            title: "Invite a Friend",
            desc: "Share your referral link above with a friend.",
          },
          {
            step: 2,
            title: "They Join",
            desc: "Your friend registers and verifies their account.",
          },
          {
            step: 3,
            title: "They Take Action",
            desc: "They complete any of the following qualifying action to unlock your reward. \n* Subscribe to a package. \n*  Boost their profile \n*  Makes a purchase on the platform.",
          },
          {
            step: 4,
            title: "You Earn",
            desc: "Your reward becomes available once all steps are done.",
          },
        ].map(({ step, title, desc }) => (
          <XStack key={step} gap={10} alignItems="flex-start">
            <YStack
              width={28}
              height={28}
              borderRadius={14}
              backgroundColor="#0E0E55"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="#fff" fontSize={12} fontWeight="700">
                {step}
              </Text>
            </YStack>
            <YStack flex={1}>
              <Text fontSize={14} fontWeight="600" color="#111">
                {title}
              </Text>
              <Text color="#666" fontSize={13}>
                {desc}
              </Text>
            </YStack>
          </XStack>
        ))}
      </YStack>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  socialIcon: { width: 30, height: 30, margin: "auto" },
  pressable:{ justifyContent: "center", alignItems:"center", margin:"auto" }
});
