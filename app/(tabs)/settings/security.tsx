import React from "react";
import { StyleSheet, TextInput, Button, Alert } from "react-native";
import { YStack, Text } from "tamagui";
import usechangePasswordForm from "@/hooks/auth/useChangePasswordform";
import { PrimaryButton } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth/ScreenHeader";
import { router } from "expo-router";

export default function ChangePasswordScreen() {
  const { formData, errors, updateField, validateForm, resetForm } =
    usechangePasswordForm();
  const { isLoading } = useAuth();

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert("Success", "Password changed successfully!");
      resetForm();
    } else {
      Alert.alert("Error", "Please fix the errors before continuing");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Privacy and security" onBackPress={() => router.back()} />
    <YStack >
      <Text style={styles.label}>Current Password</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={formData.currentPassword}
        onChangeText={(text) => updateField("currentPassword", text)}
      />
      {errors.currentPassword && (
        <Text style={styles.error}>{errors.currentPassword}</Text>
      )}

      <Text style={styles.label}>New Password</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={formData.newPassword}
        onChangeText={(text) => updateField("newPassword", text)}
      />
      {errors.newPassword && (
        <Text style={styles.error}>{errors.newPassword}</Text>
      )}

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        secureTextEntry
        style={styles.input}
        value={formData.newPasswordConfirmation}
        onChangeText={(text) => updateField("newPasswordConfirmation", text)}
      />
      {errors.newPasswordConfirmation && (
        <Text style={styles.error}>{errors.newPasswordConfirmation}</Text>
      )}

      <PrimaryButton
        title="Change Password"
        onPress={handleSubmit}
        loading={isLoading}
      />
    </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, 
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color:colors.text
  },
  input: {
    borderWidth: 1,
    borderColor:colors.gray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color:colors.text
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
