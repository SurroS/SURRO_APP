import { useProfile } from "@/hooks/useProfile";
import { StyleSheet, ViewStyle } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Card, Text, YStack } from "tamagui";

interface ProgressMeterProps {
  style?: ViewStyle; // allow styles from parent
}

const ProgressMeter = ({ style }: ProgressMeterProps) => {
  const { surrogateProfile } = useProfile();

  // Calculate profile completion percentage
  const calculateProgress = () => {
    if (!surrogateProfile) return 0;

    const fields = [
      'firstName', 'lastName', 'userName', 'countryOfOrigin', 'aboutMe',
      'dateOfBirth', 'maritalStatus', 'height', 'weight', 'profilePicture',
      'numberOfChildren', 'countryOfResidence', 'stateOfOrigin', 'address',
      'zipCode', 'phone1', 'phone2', 'emergencyContactPhone',
      'emergencyContactRelation', 'facebookProfile', 'instagramProfile',
      'twitterProfile', 'threadsProfile'
    ];

    const completedFields = fields.filter(field => {
      const value = surrogateProfile[field as keyof typeof surrogateProfile];
      return value !== null && value !== undefined && value !== '';
    });

    return Math.round((completedFields.length / fields.length) * 100);
  };

  const progress = calculateProgress();
  const label = progress < 100
    ? "Please complete your profile"
    : "Profile completed!";

  return (
    <Card
      bordered
      borderColor={"#E5E5E5"}
      padding="$2"
      borderRadius="$4"
      alignItems="center"
      justifyContent="center"
      style={[styles.card, style]} //  merge internal + external styles
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
