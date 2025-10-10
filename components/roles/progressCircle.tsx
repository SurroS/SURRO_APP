import { StyleSheet, ViewStyle } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Card, Text, YStack } from "tamagui";

interface ProgressMeterProps {
  progress?: number;
  label?: string;
  style?: ViewStyle; // 👈 allow styles from parent
}

const ProgressMeter = ({
  progress = 100,
  label = "Please complete your profile",
  style,
}: ProgressMeterProps) => {
  return (
    <Card
      bordered
      borderColor={"#a5a5a6ff"}
      padding="$2"
      borderRadius="$4"
      alignItems="center"
      justifyContent="center"
      style={[styles.card, style]} // 👈 merge internal + external styles
    >
      <Text
        fontSize="$3"
        color={progress < 70 ? "#ce9505ff" : "#0E0E55"}
        textAlign="center"
        fontWeight="600"
        marginBottom="$2"
      >
        Profile completion
      </Text>
      <YStack alignItems="center" justifyContent="center" gap="$2">
        <AnimatedCircularProgress
          size={80}
          width={6}
          fill={progress}
          tintColor={progress < 100 ? "#ce9505ff" : "#0E0E55"}
          backgroundColor="#E5E5F9"
          rotation={0}
          style={styles.circle}
        >
          {() => (
            <Text
              fontSize="$5"
              fontWeight="700"
              color={progress < 100 ? "#ce9505ff" : "#0E0E55"}
              textAlign="center"
            >
              {progress}%
            </Text>
          )}
        </AnimatedCircularProgress>

        <Text
          fontSize="$3"
          color={progress < 100 ? "#ce9505ff" : "#0E0E55"}
          textAlign="center"
          fontWeight="600"
          marginTop="$2"
        >
          {label}
        </Text>
      </YStack>
    </Card>
  );
};

export default ProgressMeter;

const styles = StyleSheet.create({
  card: {
    width: "45%", // default layout
    height: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
  },
});
