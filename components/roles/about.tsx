import { Feather } from "@expo/vector-icons";
import { StyleSheet, Pressable } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { router } from "expo-router";

type AboutProps = {
  aboutMe?: string | null;
};

const About = ({ aboutMe }: AboutProps) => {
  const hasContent = typeof aboutMe === "string" && aboutMe.trim().length > 0;

  return (
    <YStack gap="$2" width="100%" flex={1}>
      <XStack alignItems="center" justifyContent="space-between">
        <Text fontSize="$4" fontWeight="bold" color="black">
          About
        </Text>

        <Pressable onPress={() => router.push("/profile")}>
          <Feather name="edit-2" size={15} color="black" />
        </Pressable>
      </XStack>

      <Text fontSize="$3.2" color="black" textAlign="justify">
        {hasContent
          ? aboutMe
          : "No bio yet. Tap the edit icon to add one."}
      </Text>
    </YStack>
  );
};

export default About;

const styles = StyleSheet.create({});
