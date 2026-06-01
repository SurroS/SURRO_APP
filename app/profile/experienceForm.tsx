import React, { useState, useEffect } from "react";
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
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

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
    text: "Tell us what you enjoyed about the last process",
    type: "text",
  },
  {
    id: 4,
    text: "How much will you want to be compensated?",
    type: "number",
  },
  {
    id: 5,
    text: "Is this amount negotiable?",
    type: "select",
    options: ["Yes", "No"],
  },
  {
    id: 6,
    text: "Anything else you'd like to share?",
    type: "text",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function ExperienceForm() {
  const { surrogateProfile, fetchProfile, updateProfile, isLoading: profileLoading } = useSurrogateProfile();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questions, setQuestions] = useState<Question[]>([questionsForNo[0]]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const currentQuestion = questions[currentIndex];

  // Fetch profile on mount if not already loaded
  useEffect(() => {
    if (!surrogateProfile) {
      fetchProfile();
    }
  }, []);

  // Pre-fill answers from existing profile data
  useEffect(() => {
    if (!surrogateProfile) return;

    const prefill: Record<number, string> = {};

    const hasBeenSurrogate = surrogateProfile.experienceLevel === "experienced";
    const hasExperience = hasBeenSurrogate;

    if (hasExperience) {
      prefill[1] = "Yes";
      if (surrogateProfile.previousPregnancyType) {
        prefill[2] = surrogateProfile.previousPregnancyType;
      }
      if (surrogateProfile.enjoymentNotes) {
        prefill[3] = surrogateProfile.enjoymentNotes;
      }
      if (surrogateProfile.compensationAmount) {
        prefill[4] = String(surrogateProfile.compensationAmount);
      }
      if (surrogateProfile.compensationNegotiable !== undefined) {
        prefill[5] = surrogateProfile.compensationNegotiable ? "Yes" : "No";
      }
      if (surrogateProfile.experienceNotes) {
        prefill[6] = surrogateProfile.experienceNotes;
      }
    } else {
      prefill[1] = "No";
      if (surrogateProfile.compensationAmount) {
        prefill[2] = String(surrogateProfile.compensationAmount);
      }
      if (surrogateProfile.compensationNegotiable !== undefined) {
        prefill[3] = surrogateProfile.compensationNegotiable ? "Yes" : "No";
      }
      if (surrogateProfile.experienceNotes) {
        prefill[5] = surrogateProfile.experienceNotes;
      }
    }

    setAnswers(prefill);

    const qs = hasExperience ? questionsForYes : questionsForNo;
    setQuestions(qs);

    // Jump to the first UNANSWERED question, or start at 0
    const answeredIds = new Set(Object.keys(prefill).map(Number));
    const firstUnansweredIndex = qs.findIndex((q) => !answeredIds.has(q.id));
    setCurrentIndex(firstUnansweredIndex >= 0 ? firstUnansweredIndex : qs.length - 1);
  }, [surrogateProfile]);

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
    // Optional text questions: enjoyment (id:3), anything else (id:5 for no-path, id:6 for yes-path)
    const optionalTextIds = [3, 5, 6];
    const isOptionalNotes = optionalTextIds.includes(currentQuestion.id);
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
      const hasExperience = answers[1]?.toLowerCase() === "yes";
      
      // Build payload based on first-time or experienced
      const payload: any = {
        hasBeenSurrogate: hasExperience,
      };
      
      if (hasExperience) {
        payload.previousPregnancyType = answers[2] || "";
        payload.compensationAmount = answers[4] ? Number(answers[4]) : undefined;
        payload.compensationNegotiable = answers[5]?.toLowerCase() === "yes";
        payload.enjoymentNotes = answers[3] || "";
        payload.experienceNotes = answers[6] || "";
        payload.experienceLevel = "experienced";
      } else {
        payload.hasBeenSurrogate = false;
        payload.compensationAmount = answers[2] ? Number(answers[2]) : undefined;
        payload.compensationNegotiable = answers[3]?.toLowerCase() === "yes";
        payload.experienceNotes = answers[5] || "";
        payload.experienceLevel = "rookie";
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
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack style={styles.container}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        {/* TEXT */}
        {currentQuestion.type === "text" && (
          <TextInput
            style={styles.textInput}
            multiline
            placeholder={[3, 5, 6].includes(currentQuestion.id) ? "Share your thoughts (optional)" : "Type your answer here..."}
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
            {["Yes", "No"].map((opt) => {
              const selected = answers[currentQuestion.id] === opt;
              return (
                <Button
                  key={opt}
                  backgroundColor={selected ? colors.primary : colors.white}
                  borderColor={colors.primary}
                  borderWidth={1}
                  color={selected ? colors.white : colors.primary}
                  onPress={() => handleAnswerChange(opt)}
                >
                  {opt}
                </Button>
              );
            })}
          </XStack>
        )}

        {/* SELECT */}
        {currentQuestion.type === "select" && currentQuestion.options && (
          <XStack gap="$4" marginTop="$10" flexWrap="wrap">
            {currentQuestion.options.map((opt) => {
              const selected = answers[currentQuestion.id] === opt;
              return (
                <Button
                  key={opt}
                  backgroundColor={selected ? colors.primary : colors.white}
                  borderColor={colors.primary}
                  borderWidth={1}
                  color={selected ? colors.white : colors.primary}
                  onPress={() => {
                    handleAnswerChange(opt);
                    handleNext();
                  }}
                >
                  {opt}
                </Button>
              );
            })}
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
                  [3, 5, 6].includes(currentQuestion.id)
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
    </KeyboardAvoidingWrapper>
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
