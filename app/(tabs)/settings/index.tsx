import React from "react";
import { Alert } from "react-native";
import { Button, XStack, Text } from "tamagui";
import { LogOut } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth";

const LogoutButton = () => {
  const { logout } = useAuthStore(); // your global store
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/login"); // redirect to login screen
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Button
      icon={LogOut}
      backgroundColor="#0E0E55"
      color="white"
      pressStyle={{ backgroundColor: "#8080FF" }}
      borderRadius="$4"
      onPress={handleLogout}
    >
      <XStack alignItems="center" gap="$2">
        <LogOut size={18} color="white" />
        <Text fontWeight="700" color="white">
          Log Out
        </Text>
      </XStack>
    </Button>
  );
};

export default LogoutButton;
