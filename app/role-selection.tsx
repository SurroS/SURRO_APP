import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Button, Image, Text, XStack, YStack } from "tamagui";

const ROLE_ITEMS = [
  {
    key: "SURROGATE",
    label: "Surrogate",
    image: require("../assets/images/surrogate-icon.png"),
  },
  {
    key: "INTENDED_PARENT",
    label: "Intending parent",
    image: require("../assets/images/parent-icon.png"),
  },
  {
    key: "AGENT",
    label: "Agent",
    image: require("../assets/images/agent-icon.png"),
  },
  // { key: "intending-parent-individual", label: "Intending parent (Individual)", image: "#22B573" },
  // { key: "fertility-clinic", label: "Fertility clinic", image: "#082A9A" },
] as const;

// Map role keys to actual role values for auth store
const roleMapping = {
  "INTENDED_PARENT": "INTENDED_PARENT",
  "AGENT": "AGENT",
  "SURROGATE": "SURROGATE",
} as const;

type RoleKey = keyof typeof roleMapping;

export default function RoleSelection() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);
  const { setUser } = useAuth();

  const onSelect = (key: RoleKey) => {
    setSelectedRole(key);
  };

  const onNext = () => {
    if (!selectedRole) return;

    // Store the selected role in auth store
    const role = roleMapping[selectedRole];

    // Create a temporary user object with the selected role
    setUser({
      id: '',
      email: '',
      name: '',
      role: role,
      isVerified: false,
    });

    // Navigate to "how did you hear" page for all roles
    router.push("/how-did-you-hear");
  };

  return (
    <YStack flex={1} padding={"$4"} marginTop={"$5"} backgroundColor="$background">
      {/* Header */}
      <Text
        fontSize={22}
        marginTop={20}
        fontWeight={"800"}
        textAlign="center"
        color="$color.text" // resolves to black in light theme
      >
        Which of the following role best describes you
      </Text>

      {/* Roles container */}
      <YStack width={"100%"} alignSelf="center" gap="$4" marginTop="$4">
        {ROLE_ITEMS.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => onSelect(item.key as RoleKey)}
            style={styles.pressable}
            android_ripple={{ color: "rgba(0,0,0,0.04)" }}
          >
            <XStack
              width="100%"
              minHeight={40}
              borderRadius={8}
              style={styles.card}
              alignItems="center"
              justifyContent="space-between"
            >
              <XStack alignItems="center" gap={12} style={{ flex: 1 }}>
                <Image source={item.image} />
                <Text
                  fontSize={16}
                  fontWeight="500"
                  color="#111111"
                  style={{ flexShrink: 1 }}
                >
                  {item.label}
                </Text>
              </XStack>

              <YStack
                width={24}
                height={24}
                borderRadius={12}
                justifyContent="center"
                alignItems="center"
                borderWidth={2}
                borderColor={
                  selectedRole === item.key ? "$primary" : "#CFCFCF"
                }
                backgroundColor="#FFFFFF"
              >
                {selectedRole === item.key && (
                  <YStack
                    width={12}
                    height={12}
                    borderRadius={6}
                    backgroundColor="$primary"
                  />
                )}
              </YStack>
            </XStack>
          </Pressable>
        ))}
      </YStack>

      {/* Next button */}
      <Button
        width={"100%"}
        height={55}
        borderRadius={8}
        alignSelf="center"
        marginTop="$5"
        onPress={onNext}
        disabled={!selectedRole}
        backgroundColor={selectedRole ? "$primary" : "#EDEDEC"}
      >
        <Text
          fontSize={16}
          fontWeight="600"
          color={selectedRole ? "$background" : "#9E9E9E"}
        >
          Next
        </Text>
      </Button>
    </YStack>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9E9E9",
  },
});
