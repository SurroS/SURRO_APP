import { Gift } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { Button, Card, Text, XStack, YStack } from "tamagui";

const Referral = ({ style }: { style?: any }) => {
  const handleInvite = () => {
    // 👇 Navigate to your invite screen
    router.push("/home/inviteScreen");
  };

  return (
    <Card
      bordered
      borderColor="#E5E5E5"
      padding="$3"
      borderRadius="$4"
      style={[styles.card, style]}
    >
      {/* Header */}
      <XStack alignItems="center" gap="$2" marginBottom="$2">
        <Gift color="#0E0E55" size={18} />
        <Text fontSize="$3.5" fontWeight="600" color="#0E0E55" padding={2}>
          Invite your friends
        </Text>
      </XStack>

      {/* Content */}
      <YStack flex={1} justifyContent="center" alignItems="flex-start" gap="$3">
        <Text color="#333" fontSize="$3.5" lineHeight={18}>
          and get rewarded
        </Text>

        <Button
          backgroundColor="#0E0E55"
          color="white"
          borderRadius="$5"
          fontWeight="600"
          paddingHorizontal="$4"
          paddingVertical="$2"
          alignSelf="flex-start"
          onPress={handleInvite}
        >
          Refer now
        </Button>
      </YStack>
    </Card>
  );
};

export default Referral;

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 3,
    justifyContent: "space-between",
  },
});
