import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { InputField } from "@/components/auth/InputField";
import { OrDivider } from "@/components/auth/OrDivider";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { ScreenHeader } from "@/components/navigation/ScreenHeader";
import { SocialButton } from "@/components/auth/SocialButton";
import { useSignupForm } from "@/hooks/auth/useSignupForm";

import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// Configure Google Sign-In
GoogleSignin.configure({
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
});

export default function SignupScreen() {
  const router = useRouter();
  const { signupFormData, errors, updateField, validateForm } = useSignupForm();
  const { register, googleLogin, isLoading } = useAuth();

  // Handle Google Sign-Up
  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      let idToken = userInfo.idToken;
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }
      if (!idToken) throw new Error("Google returned null idToken");

      console.log("====== GOOGLE SIGNUP SUCCESS ======");
      console.log("ID Token:", idToken);
      console.log("User Info:", userInfo.user);

      // Call your backend action
      await googleLogin({
        idToken,
        role: signupFormData?.role,
      });

      Toast.show({
        text1: "Google Sign-Up Success",
        type: "customSuccess" as ToastType,
        text2: "Welcome!",
      });
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Google Sign-In error:", error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({
          text1: "Sign-in cancelled",
          type: "customError" as ToastType,
          text2: "You cancelled the Google sign-in process.",
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          text1: "Google Sign-in in progress",
          type: "customWarning" as ToastType,
          text2: "Please wait while sign-in completes.",
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          text1: "Play Services not available",
          type: "customError" as ToastType,
          text2: "Your Google Play Services may be outdated.",
        });
      } else {
        Toast.show({
          text1: "Sign-in failed",
          type: "customError" as ToastType,
          text2: "An unexpected error occurred.",
        });
      }
    }
  };

  // Regular email/password signup
  const handleSignup = async () => {
    if (!validateForm()) return;
    try {
      await register(signupFormData);
      router.push("/(auth)/otp");
    } catch (err) {
      console.error("Signup error:", err);
      Toast.show({
        text1: "Signup Failed",
        type: "customError" as ToastType,
        text2: "Signup Failed! Please try again.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader title="Sign Up" onBackPress={() => router.back()} />

          <InputField
            label="Email"
            value={signupFormData.email}
            onChangeText={(text) => updateField("email", text)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            errorMessage={errors.email}
          />

          <InputField
            label="Password"
            value={signupFormData.password}
            onChangeText={(text) => updateField("password", text)}
            placeholder="Enter your password"
            secureTextEntry
            showPasswordToggle
            error={!!errors.password}
            errorMessage={errors.password}
          />

          <InputField
            label="Confirm Password"
            value={signupFormData.passwordConfirmation}
            onChangeText={(text) => updateField("passwordConfirmation", text)}
            placeholder="Confirm your password"
            secureTextEntry
            showPasswordToggle
            error={!!errors.passwordConfirmation}
            errorMessage={errors.passwordConfirmation}
          />

          {signupFormData.referralCode && (
            <InputField
              label="Referral Code"
              value={signupFormData.referralCode}
              onChangeText={(text) => updateField("referralCode", text)}
              placeholder="Enter referral code"
            />
          )}

          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => updateField("termsAccepted", !signupFormData.termsAccepted)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, signupFormData.termsAccepted && styles.checkboxChecked]}>
              {signupFormData.termsAccepted && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text style={styles.termsLink}>Terms of Service</Text>{" "}
              and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {errors.termsAccepted && (
            <Text style={styles.errorText}>{errors.termsAccepted}</Text>
          )}

          <PrimaryButton
            title="Sign up"
            onPress={handleSignup}
            loading={isLoading}
          />

          <OrDivider />

          <SocialButton
            title="Continue with Google"
            icon={require("../../assets/images/google.png")}
            onPress={handleGoogleSignup}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F7F7" },
  container: { flexGrow: 1, padding: 24, paddingTop: 50 },
  errorText: {
    color: "red",
    marginTop: -10,
    marginBottom: 15,
    textAlign: "center",
  },
  loginLink: { marginTop: 20, alignSelf: "center" },
  loginLinkText: { color: "#0E0E55", fontWeight: "bold" },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#0E0E55",
    borderColor: "#0E0E55",
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  termsLink: {
    color: "#0E0E55",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
