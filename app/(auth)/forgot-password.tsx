import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import AlertModal from "@/components/modals/AlertModal";
import { InputField } from "@/components/auth/InputField";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { ScreenHeader } from "@/components/navigation/ScreenHeader";
import { useForgotPasswordForm } from "@/hooks/auth/useForgotPasswordForm";
import { useAuth } from "@/hooks/useAuth";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useResetPasswordForm } from "@/hooks/auth";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { email, error, updateEmail, validateForm } = useForgotPasswordForm();
  const { forgotPassword, isLoading, resetPassword} = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);

  const handleForgotPassword = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await forgotPassword({ email });
      setAlertVisible(true);
    } catch (err) {
      Toast.show({
        text1: "Password reset instructions sent to your email.",
        type: "customError" as ToastType,
        text2:
          "Password reset instructions sent to your email! Please try again.",
      });
      console.error("Forgot password error:", err);
      console.log(updateEmail);
      console.log(validateForm);
      console.log(email);
      // Error is already handled by the auth store
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="Forgot Password"
          style={{ size: "$4" }}
          onBackPress={() => router.back()}
        />

        <Text style={styles.infoText}>
          Enter your email address and we&apos;ll send you a code to reset your
          password.
        </Text>

        <InputField
          label="Email"
          value={email}
          onChangeText={updateEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!error}
          errorMessage={error!}
        />

        <PrimaryButton
          title="Send Code"
          onPress={handleForgotPassword}
          loading={isLoading}
        />
        </ScrollView>
        <AlertModal
          visible={alertVisible}
          title="Success"
          message="Password reset instructions sent to your email."
          onClose={() => {
            setAlertVisible(false);
            router.push("/otp");
          }}
        />
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 50,
  },
  infoText: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
});
