import React from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/hooks/colors";

interface Props {
  children: React.ReactNode;
}

export default function SessionGate({ children }: Props) {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const sessionExpired = useAuthStore((s) => s.sessionExpired);
  const setSessionExpired = useAuthStore((s) => s.setSessionExpired);
  const setForceLogout = useAuthStore((s) => s.setForceLogout);

  // Still loading auth state from storage
  if (!hasHydrated) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Session expired — block the entire app
  if (sessionExpired) {
    const handleLogin = () => {
      setSessionExpired(false);
      setForceLogout(false);
      router.replace("/(auth)/login");
    };

    return (
      <View style={styles.screen}>
        <Ionicons name="timer-outline" size={56} color={colors.primary} />
        <Text style={styles.title}>Session Expired</Text>
        <Text style={styles.message}>
          Your session has expired. Please log in again to continue.
        </Text>
        <Text style={styles.note}>
          Session tokens expire frequently to protect your account. This is a
          security measure to keep your data safe.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
  },
  note: {
    fontSize: 12,
    color: colors.placeholderText,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 28,
    marginTop: -16,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 10,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
