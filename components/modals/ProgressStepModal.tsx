import React, { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import colors from "@/hooks/colors";
import { DimensionValue } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type Step = {
  label: string;
  route: string;
  done: boolean;
};

type ProgressStepsModalProps = {
  visible: boolean;
  onClose: () => void;
  steps: Step[];
};

export default function ProgressStepsModal({
  visible,
  onClose,
  steps,
}: ProgressStepsModalProps) {
  // Compute % done
  const progress= useMemo(() => {
    const total = steps.length;
    const completed = steps.filter((s) => s.done).length;
    return `${(completed / total) * 100}%`;
  }, [steps]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      {/* Dim background */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Bottom sheet */}
      <SafeAreaView style={styles.bottomSheet}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Finish setting up your account</Text>

          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: progress as DimensionValue }]} />
          </View>
        </View>

        {/* Steps List */}
        <View style={{ marginTop: 18 }}>
          {steps.map((step, i) => (
            <TouchableOpacity
              key={i}
              style={styles.stepRow}
              onPress={() => {
                onClose();
                router.push(step.route);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name={step.done ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={step.done ? "#0DA94A" : "#B0B0B0"}
              />
              <Text
                style={[
                  styles.stepLabel,
                  { color: step.done ? "#0E0E55" : "#777" },
                ]}
              >
                {step.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 34,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0E0E55",
    marginBottom: 10,
  },
  progressTrack: {
    height: 5,
    backgroundColor: "#E5E5E5",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  stepLabel: {
    fontSize: 15,
    marginLeft: 10,
  },
});
