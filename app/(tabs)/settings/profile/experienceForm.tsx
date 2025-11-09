import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { YStack, XStack, Text, Button, ScrollView } from "tamagui";
import BottomModal from "@/components/BottomModal";
import { experienceQuestions, Question } from "@/constants/ExperienceQuestions";

export default function ExperienceForm() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const currentQuestion = experienceQuestions[currentQuestionIndex];

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

    // Check if this is the first question and answer is "no" → finish
    if (currentQuestionIndex === 0 && answer.toLowerCase() === "no") {
      setShowSuccessModal(true);
      return;
    }

    // Move to next question
    if (currentQuestionIndex + 1 < experienceQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowSuccessModal(true);
    }
  };

  return (
    <YStack style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text fontSize={20} fontWeight="600">{currentQuestion.text}</Text>

        {currentQuestion.type === "yesno" && (
          <XStack gap="$4" marginTop="$4">
            <Button onPress={() => handleAnswer("Yes")}>Yes</Button>
            <Button onPress={() => handleAnswer("No")}>No</Button>
          </XStack>
        )}

        {currentQuestion.type === "text" && (
          <Button onPress={() => handleAnswer("Sample text answer")} style={{ marginTop: 20 }}>
            Submit Answer
          </Button>
        )}
      </ScrollView>

      {showSuccessModal && (
        <BottomModal
          visible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Thank you!"
          description="Your responses have been recorded."
        />
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
});
