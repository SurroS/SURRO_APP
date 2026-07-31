import { StyleSheet, TextInput, ActivityIndicator, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { YStack, XStack, Text } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import usechangePasswordForm from "@/hooks/auth/useChangePasswordForm";
import { PrimaryButton } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/navigation/ScreenHeader";
import { router } from "expo-router";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

export default function ChangePasswordScreen() {
  const { formData, errors, passwordRules, updateField, validateForm, resetForm } =
    usechangePasswordForm();
  const { changePassword, isLoading } = useAuth();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        text1: "Validation Error",
        type: "customError" as ToastType,
        text2: "Please fix the errors before continuing",
      });
      return;
    }

    try {
      await changePassword(formData);
      
      Toast.show({
        text1: "Password changed successfully",
        type: "customSuccess" as ToastType,
        text2: "Your password has been updated",
      });
      
      resetForm();
    } catch (error: any) {
      Toast.show({
        text1: "Password Change Failed",
        type: "customError" as ToastType,
        text2: error?.response?.data?.message || "Failed to change password. Please try again.",
      });
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Change Password"
          onBackPress={() => router.back()}
        />
        <YStack>
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            secureTextEntry={!showNewPassword}
            style={styles.input}
            value={formData.newPassword}
            onChangeText={(text) => updateField("newPassword", text)}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Ionicons
              name={showNewPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.newPassword && (
          <Text style={styles.error}>{errors.newPassword}</Text>
        )}

        {/* Password rules */}
        <YStack gap="$1" marginBottom={12}>
          {passwordRules.map((rule) => (
            <XStack key={rule.label} alignItems="center" gap="$2">
              <Text
                fontSize={12}
                color={rule.met ? "#22C55E" : "#9CA3AF"}
              >
                {rule.met ? "✓" : "○"}
              </Text>
              <Text
                fontSize={12}
                color={rule.met ? "#22C55E" : "#9CA3AF"}
              >
                {rule.label}
              </Text>
            </XStack>
          ))}
        </YStack>

        <Text style={styles.label}>Confirm New Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            value={formData.newPasswordConfirmation}
            onChangeText={(text) => updateField("newPasswordConfirmation", text)}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.newPasswordConfirmation && (
          <Text style={styles.error}>{errors.newPasswordConfirmation}</Text>
        )}

        <PrimaryButton
          title="Change Password"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        />
        </YStack>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
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
    color: colors.text,
  },
  input: {
    flex: 1,
    padding: 10,
    color: colors.text,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    marginBottom: 10,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
