import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomModal from "@/components/modals/BottomModal";
import colors from "@/hooks/colors";
import { router } from "expo-router";
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";

export interface Question {
  id: number;
  text: string;
  type: "yesno" | "text" | "number" | "select";
  options?: string[];
}

/* ---------------- QUESTIONS ---------------- */

const questionsForNo: Question[] = [
  { id: 1, text: "Have you ever been a surrogate?", type: "yesno" },
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
    text: "Anything else you'd like to share?",
    type: "text",
  },
];

const questionsForYes: Question[] = [
  { id: 1, text: "Have you ever been a surrogate?", type: "yesno" },
  {
    id: 2,
    text: "Did you carry single or multiple babies?",
    type: "select",
    options: ["Single", "Multiple"],
  },
  {
    id: 3,
    text: "Anything else you'd like to share?",
    type: "text",
  },
  {
    id: 4,
    text: "Tell us what you enjoyed about the last process",
    type: "text",
  },
  {
    id: 5,
    text: "How much will you want to be compensated?",
    type: "number",
  },
  {
    id: 6,
    text: "Is this amount negotiable?",
    type: "select",
    options: ["Yes", "No"],
  },
];

/* ---------------- COMPONENT ---------------- */

export default function ExperienceForm() {
  const { updateProfile } = useSurrogateProfile();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questions, setQuestions] = useState<Question[]>([questionsForNo[0]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const currentQuestion = questions[currentIndex];

  /* ---------------- ANSWER HANDLING ---------------- */

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

    if (currentQuestion.id === 1) {
      if (value.toLowerCase() === "yes") {
        setQuestions(questionsForYes);
      } else {
        setQuestions(questionsForNo);
      }
      setTimeout(() => setCurrentIndex(1), 100);
    }
  };

  const handleNext = () => {
    // For text inputs, require some input unless it's the "anything else" optional question
    const isOptionalNotes = currentQuestion.id === 3 || currentQuestion.id === 5;
    const hasInput = answers[currentQuestion.id]?.trim().length > 0;
    
    // Allow next if: has input OR it's optional notes OR not a text field
    if (isOptionalNotes || hasInput || currentQuestion.type === "yesno" || currentQuestion.type === "select" || currentQuestion.type === "number") {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const isFirstTime = answers[1]?.toLowerCase() === "yes" ? false : true;
      
      // Build payload based on first-time or experienced
      const payload: any = {};
      
      if (isFirstTime) {
        payload.compensationAmount = answers[2] ? Number(answers[2]) : undefined;
        payload.compensationNegotiable = answers[3]?.toLowerCase() === "yes";
        payload.experienceNotes = answers[5] || "";
      } else {
        payload.previousPregnancyType = answers[2] || "";
        payload.compensationAmount = answers[5] ? Number(answers[5]) : undefined;
        payload.compensationNegotiable = answers[6]?.toLowerCase() === "yes";
        payload.experienceNotes = answers[3] || "";
        payload.enjoymentNotes = answers[4] || "";
      }

      console.log("Submitting payload:", JSON.stringify(payload, null, 2));
      await updateProfile(payload);

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        router.push("/kyc");
      }, 1500);
    } catch (err) {
      console.error("Failed to update surrogate profile", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack style={styles.container}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        {/* TEXT */}
        {currentQuestion.type === "text" && (
          <TextInput
            style={styles.textInput}
            multiline
            placeholder={currentQuestion.id === 3 || currentQuestion.id === 5 ? "Share your thoughts (optional)" : "Type your answer here..."}
            placeholderTextColor="#999"
            value={answers[currentQuestion.id] || ""}
            onChangeText={handleAnswerChange}
          />
        )}

        {/* NUMBER */}
        {currentQuestion.type === "number" && (
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder="Enter amount in Naira"
            placeholderTextColor="#999"
            value={answers[currentQuestion.id] || ""}
            onChangeText={handleAnswerChange}
          />
        )}

        {/* YES / NO */}
        {currentQuestion.type === "yesno" && (
          <XStack gap="$4" marginTop="$10">
            {["Yes", "No"].map((opt) => (
              <Button
                key={opt}
                backgroundColor={colors.gray}
                borderColor={colors.primary}
                borderWidth={1}
                onPress={() => handleAnswerChange(opt)}
              >
                {opt}
              </Button>
            ))}
          </XStack>
        )}

        {/* SELECT */}
        {currentQuestion.type === "select" && currentQuestion.options && (
          <XStack gap="$4" marginTop="$10" flexWrap="wrap">
            {currentQuestion.options.map((opt) => (
              <Button
                key={opt}
                backgroundColor={colors.gray}
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

        {/* NAVIGATION */}
        {currentQuestion.id !== 1 && (
          <XStack gap="$8" marginTop="$12">
            {currentIndex > 0 && (
              <Button backgroundColor={colors.primary} onPress={handlePrevious}>
                Previous
              </Button>
            )}

            {currentIndex === questions.length - 1 ? (
              <Button backgroundColor={colors.primary} onPress={handleSubmit}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text color="#fff" fontWeight="700">
                    Confirm & Continue
                  </Text>
                )}
              </Button>
            ) : (
              <Button
                backgroundColor={colors.primary}
                onPress={handleNext}
                disabled={
                  // For optional notes (id 3 or 5), allow next even when empty
                  (currentQuestion.id === 3 || currentQuestion.id === 5) 
                    ? false 
                    : !answers[currentQuestion.id]
                }
              >
                Next
              </Button>
            )}
          </XStack>
        )}

        <BottomModal
          visible={showSuccessModal}
          success
          title="Thank you! Your responses have been saved."
        />
      </YStack>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  textInput: {
    width: "100%",
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
});
