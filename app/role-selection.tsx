import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet } from "react-native";
import { Button, Image, Text, XStack, YStack } from "tamagui";

const ROLE_ITEMS = [
  {
    key: "surrogate",
    label: "Surrogate",
    image: require("../assets/images/surrogate-icon.png"),
  },
  {
    key: "intending-parent",
    label: "Intending parent",
    image: require("../assets/images/parent-icon.png"),
  },
  {
    key: "agent",
    label: "Agent",
    image: require("../assets/images/agent-icon.png"),
  },
  // { key: "intending-parent-individual", label: "Intending parent (Individual)", image: "#22B573" },
  // { key: "fertility-clinic", label: "Fertility clinic", image: "#082A9A" },
] as const;

// Strongly typed role-to-route mapping
const roleRouteMap = {
  "intending-parent": "/(roles)/parent",
  // "intending-parent-individual": "/(roles)/parent",
  agent: "/(roles)/agent",
  // "fertility-clinic": "/(roles)/fertility-clinic",
} as const;

type RoleKey = keyof typeof roleRouteMap | "surrogate";

export default function RoleSelection() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);

  const onSelect = (key: RoleKey) => {
    setSelectedRole(key);
  };

  const onNext = () => {
    if (!selectedRole) return;

    // Special case for surrogate
    if (selectedRole === "surrogate") {
      router.push("/how-did-you-hear");
      return;
    }

    // All other roles use the route map
    const route = roleRouteMap[selectedRole as keyof typeof roleRouteMap];
    if (route) {
      router.push(route);
    }
  };

  return (
    <SafeAreaView>
      <YStack padding={"$4"} marginTop={"$5"} backgroundColor="$background">
        {/* Header */}
        <Text
          fontSize={20}
          marginTop={20}
          fontWeight={"500"}
          textAlign="center"
          color="$color.text" // resolves to black in light theme
        >
          Which of the following role best describes you
        </Text>

        {/* Roles container */}
        <YStack width={"100%"} alignSelf="center" space="$4" marginTop="$4">
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
    </SafeAreaView>
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
