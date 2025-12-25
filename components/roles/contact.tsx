import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";

const texthead = "$4";
const body = "$3.2";
const smallGap = "$2";
const bigGap = "$3";
const iconSize = 18;

type SocialLinks = {
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  tiktok?: string | null;
};

type ContactProps = {
  email?: string | null;
  phoneNumber?: string | null;
  socials?: SocialLinks;
};

const SOCIAL_ICONS = {
  facebook: require("../../assets/images/fb-icon.png"),
  instagram: require("../../assets/images/instagram-icon.png"),
  twitter: require("../../assets/images/x_icon.png"),
  tiktok: require("../../assets/images/tiktok-icon.png"),
};

const Contact = ({ email, phoneNumber, socials = {} }: ContactProps) => {
  const entries = Object.entries(socials).filter(([_, value]) => !!value);

  return (
    <YStack gap={smallGap} flex={1}>
      {/* CONTACT */}
      <YStack gap={smallGap}>
        <Text fontSize={texthead} fontWeight="bold" color="black">
          Contact
        </Text>

        <XStack flexWrap="wrap" gap={smallGap}>
          <XStack alignItems="center" gap={smallGap}>
            <Feather name="phone" size={iconSize} color="#000" />
            <Text fontSize={body} color="black">
              {phoneNumber || "Phone not provided"}
            </Text>
          </XStack>

          <XStack alignItems="center" gap={smallGap}>
            <Feather name="mail" size={iconSize} color="#000" />
            <Text fontSize={body} color="black">
              {email || "Email not provided"}
            </Text>
          </XStack>
        </XStack>
      </YStack>

      {/* SOCIALS */}
{/* SOCIALS */}
{entries.length > 0 && (
  <YStack gap={bigGap}>
    <Text fontSize={texthead} fontWeight="bold" color="black">
      Socials
    </Text>

    <YStack gap="$3">
      {entries.map(([platform, url]) => (
        <XStack
          key={platform}
          alignItems="center"
          gap="$2"
          maxWidth="100%"
        >
          <Image
            source={SOCIAL_ICONS[platform as keyof SocialLinks]}
            width={iconSize}
            height={iconSize}
            borderRadius={4}
          />

          <Text
            fontSize={body}
            color="black"
            numberOfLines={1}
            ellipsizeMode="tail"
            flex={1}
          >
            {url}
          </Text>
        </XStack>
      ))}
    </YStack>
  </YStack>
)}

    </YStack>
  );
};

export default Contact;

const styles = StyleSheet.create({});
