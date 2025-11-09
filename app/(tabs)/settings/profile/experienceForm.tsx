import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput } from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomModal from "@/components/BottomModal";
import colors from "@/hooks/colors";
import { router } from "expo-router";
import { ActivityIndicator } from "react-native";

export interface Question {
  id: number;
  text: string;
  type: "yesno" | "text" | "number" | "select";
  options?: string[];
}

const questionsForNo: Question[] = [
  {
    id: 1,
    text: "Have you ever been a surrogate?",
    type: "yesno",
  },
  {
    id: 2,
    text: "How much will you want to be compensated for this process?",
    type: "number",
  },
  {
    id: 3,
    text: "Is this amount negotiable?",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    id: 5,
    text: "Anything else you'd like to share about your past surrogacy journey?",
    type: "text",
  },
];

const questionsForYes: Question[] = [
  {
    id: 1,
    text: "Have you ever been a surrogate?",
    type: "yesno",
  },
  {
    id: 2,
    text: "Did you carry single or multiple babies?",
    type: "select",
    options: ["Single", "Multiple"],
  },
  {
    id: 3,
    text: "Anything else you'd like to share about your past surrogacy journey?",
    type: "text",
  },
  {
    id: 4,
    text: "Tell us what you enjoyed about the last process",
    type: "text",
  },
  {
    id: 5,
    text: "How much will you want to be compensated for this process?",
    type: "number",
  },
  {
    id: 6,
    text: "Is this amount negotiable?",
    type: "select",
    options: ["Yes", "No"],
  },
];

export default function ExperienceForm() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questions, setQuestions] = useState<Question[]>([questionsForNo[0]]); // start only with the first question
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

    // If the first question (ID 1) is being answered, update question set
    if (currentQuestion.id === 1) {
      if (value.toLowerCase() === "yes") {
        setQuestions(questionsForYes);
      } else {
        setQuestions(questionsForNo);
      }
      // After setting, move to the next question automatically
      setTimeout(() => setCurrentIndex(1), 100);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // simulate upload
      setShowSuccessModal(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/settings/kyc/");
    } catch (error) {
      console.error("Error uploading ID:", error);
    } finally {
      setShowSuccessModal(false);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack style={styles.container}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        {/* Text Input */}
        {currentQuestion.type === "text" && (
          <TextInput
            style={styles.textInput}
            placeholder="Type your answer..."
            multiline
            value={answers[currentQuestion.id] || ""}
            onChangeText={handleAnswerChange}
          />
        )}

        {/* Number Input */}
        {currentQuestion.type === "number" && (
          <TextInput
            style={styles.textInput}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={answers[currentQuestion.id] || ""}
            onChangeText={handleAnswerChange}
          />
        )}

        {/* Yes / No Buttons */}
        {currentQuestion.type === "yesno" && (
          <XStack gap="$4" marginTop="$10">
            <Button
              style={{
                borderColor: colors.primary,
                border: 1,
                backgroundColor: colors.gray,
                color: colors.black,
              }}
              onPress={() => handleAnswerChange("Yes")}
            >
              Yes
            </Button>
            <Button
              style={{
                borderColor: colors.primary,
                border: 1,
                backgroundColor: colors.gray,
                color: colors.black,
              }}
              onPress={() => handleAnswerChange("No")}
            >
              No
            </Button>
          </XStack>
        )}

        {/* Select Buttons */}
        {currentQuestion.type === "select" && currentQuestion.options && (
          <XStack gap="$4" marginTop="$10" flexWrap="wrap">
            {currentQuestion.options.map((opt) => (
              <Button
                key={opt}
                style={{ backgroundColor: colors.gray }}
                onPress={() => {
                  handleAnswerChange(opt);
                  handleNext();
                }}
              >
                {opt}
              </Button>
            ))}
          </XStack>
        )}

        {/* Navigation */}

        {currentQuestion.id !== 1 && (
          <XStack gap="$10" marginTop="$12">
            {currentIndex > 0 && (
              <Button
                style={{ backgroundColor: colors.primary }}
                onPress={handlePrevious}
              >
                Previous
              </Button>
            )}

            {currentIndex === questions.length - 1 ? (
              <Button
                style={{ backgroundColor: colors.primary }}
                onPress={handleSubmit}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[styles.actionText, { color: "#fff" }]}>
                    Confirm & Continue
                  </Text>
                )}
              </Button>
            ) : !answers[currentQuestion.id] ? (
              ""
            ) : (
              <Button
                style={{
                  backgroundColor: colors.primary,
                }}
                onPress={handleNext}
                disabled={!answers[currentQuestion.id]}
              >
                Next
              </Button>
            )}
          </XStack>
        )}

        <BottomModal
          visible={showSuccessModal}
          success={true}
          title="Thank you! Your responses have been recorded."
        />
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: 20,
    color: "black",
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  textInput: {
    width: "100%",
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
