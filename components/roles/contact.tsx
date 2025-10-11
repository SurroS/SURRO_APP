import { Feather, Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Image, Text, XStack, YStack } from "tamagui";
import InstagramIcon from "../../assets/images/instagramsvg (1).svg";

const texthead = "$4";
const body = "$3.2";
const smallGap = "$2";
const bigGap = "$3";
const iconSize = 18;
const addIcon = 25;

const Contact = () => {
  const socials = [
    {
      icon: require("../../assets/images/fb-icon.png"),
      label: "@mich123",
      type: "png",
    },
    { icon: InstagramIcon, label: "@mich123", type: "svg" },
  ];
  return (
    <YStack gap={smallGap} flex={1}>
      <YStack gap={smallGap}>
        <Text fontSize={texthead} fontWeight="bold" color="black">
          Contact
        </Text>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" flexWrap="wrap" gap={smallGap}>
            <XStack alignItems="center" gap={smallGap}>
              <Feather name="phone" size={iconSize} color="#000" />
              <Text fontSize={body} color="black">
                237650810984
              </Text>
            </XStack>
            <XStack alignItems="center" gap={smallGap}>
              <Feather name="mail" size={iconSize} color="#000" />
              <Text fontSize={body} color="black">
                surrogate@gmail.com
              </Text>
            </XStack>
          </XStack>
        </XStack>
      </YStack>

      <YStack gap={bigGap}>
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={texthead} fontWeight="bold" color="black">
            Socials
          </Text>
        </XStack>
        <XStack
          alignItems="center"
          justifyContent="space-between"
          gap={smallGap}
        >
          {/* social */}

          <XStack gap="$4" width={'90%'} flexGrow={1} flexWrap={"wrap"}>
            {socials.map((item, idx) => (
              <XStack key={idx} alignItems="center" gap="$2">
                {item.type === "png" ? (
                  <Image
                    source={item.icon}
                    width={iconSize}
                    height={iconSize}
                    borderRadius={4}
                  />
                ) : (
                  <InstagramIcon width={iconSize} height={iconSize} />
                )}
                <Text color="$text" fontSize={body}>
                  {item.label}
                </Text>
              </XStack>
            ))}
          </XStack>

        </XStack>
      </YStack>
    </YStack>
  );
};

export default Contact;

const styles = StyleSheet.create({});
