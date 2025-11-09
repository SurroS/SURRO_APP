import React from "react";
import { StyleSheet } from "react-native";
import { YStack, Text, Button } from "tamagui";  
import { useRouter } from "expo-router";
import { PrimaryButton } from "@/components/auth";

export default function ExperienceIntro() {
  const router = useRouter();

  const goToQuestions = () => {
    router.navigate("/settings/profile/experienceForm");
  };

  return (
    <YStack style={styles.container} space="$4" alignItems="center" justifyContent="center">
      <Text fontSize={24} fontWeight="700">Welcome to the Experience Survey</Text>
      <Text fontSize={16} textAlign="center">
        We’d love to hear about your experience. This will only take a few minutes.
      </Text>
      <PrimaryButton title="start survey"  onPress={goToQuestions}/>
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
});
