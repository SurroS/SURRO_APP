import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { useRouter } from "expo-router";

const ROLE_ITEMS = [
  { key: "surrogate", label: "Surrogate", color: "#0FB1A6" },
  { key: "intending-parent", label: "Intending parent", color: "#9B1CA9" },
  // { key: "intending-parent-individual", label: "Intending parent (Individual)", color: "#22B573" },
  // { key: "fertility-clinic", label: "Fertility clinic", color: "#082A9A" },
  { key: "agent", label: "Agent", color: "#B71C1C" },
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
    <YStack flex={1} padding="$4" backgroundColor="$background">
      {/* Header */}
      <YStack
        width={317}
        height={150}
        alignSelf="center"
        justifyContent="center"
        marginTop="$5"
      >
        <Text
  fontWeight="600"
  fontSize={20}
  lineHeight={23}
  textAlign="center"
  color="$color.text" // resolves to black in light theme
>
  Which of the following role best describes you
</Text>

      </YStack>

      {/* Roles container */}
      <YStack width={352} alignSelf="center" space="$4" marginTop="$4">
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
              <XStack alignItems="center" space={12} style={{ flex: 1 }}>
                <YStack
                  width={36}
                  height={30}
                  borderRadius={18}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor={item.color}
                >
                  <Text fontSize={14} fontWeight="600" color="#FFFFFF">
                    {item.label
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </Text>
                </YStack>

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
                borderColor={selectedRole === item.key ? "$primary" : "#CFCFCF"}
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
        width={353}
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
