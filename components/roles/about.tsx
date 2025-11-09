import { useProfile } from "@/hooks/useProfile";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { Pressable } from "react-native";
import { router } from "expo-router";

const About = () => {
  const { surrogateProfile } = useProfile()
  return (
    <YStack gap="$2" width={"100%"} flex={1}>
      <XStack alignItems="center" justifyContent="space-between" gap="$1">
        <Text fontSize="$4" fontWeight="bold" color="black">
          About
        </Text>
        <Pressable onPress={()=>router.push("/settings/profile")}>
        <Feather  name="edit-2" size={15} color="black" />
        </Pressable>
      </XStack>
      <Text fontSize="$3.2" color="black" textAlign="justify">{surrogateProfile ? surrogateProfile.aboutMe :
        ("No about, you can click on the pen icon to edit")
      }</Text>
    </YStack>
  );
};

export default About;

const styles = StyleSheet.create({});
