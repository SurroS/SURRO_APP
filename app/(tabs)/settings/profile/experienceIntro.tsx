import React from "react";
import { StyleSheet } from "react-native";
import { YStack, Text, Button, View } from "tamagui";
import { useRouter } from "expo-router";
import { PrimaryButton, ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExperienceIntro() {
  const router = useRouter();

  const goToQuestions = () => {
    router.navigate("/settings/profile/experienceForm");
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.white, paddingTop: 20 }}
    >
      <View marginLeft={20}>
        <ScreenHeader
          onBackPress={() => router.back()}
          title="Surrogacy Experience"
        />
      </View>
      <YStack
        style={styles.container}
        gap="$4"
        alignItems="center"
        justifyContent="center"
      >
        <Text style={styles.title}>Welcome to the Experience Survey</Text>
        <View style={styles.instruction}>
          <Ionicons name="alert-circle" color={"blue"} size={35} />
          <Text style={styles.instructionText}>
            We’d love to hear about your surrogacy experience. Your experience
            helps us understand your journey and connect you with intended
            parents who align with your story. {"\n"}This will only take a few
            minutes.
          </Text>
        </View>
        <PrimaryButton title="start survey" onPress={goToQuestions} />
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E0E55",
    marginBottom: 14,
  },
  instruction: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    backgroundColor: colors.secondry,
    padding: 15,
    borderRadius: 10,
  },
  instructionText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginLeft: 10,
    flexShrink: 1,
  },
});
