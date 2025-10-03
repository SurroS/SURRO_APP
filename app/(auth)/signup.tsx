import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { InputField } from "../../components/auth/InputField";
import { OrDivider } from "../../components/auth/OrDivider";
import { PrimaryButton } from "../../components/auth/PrimaryButton";
import { ScreenHeader } from "../../components/auth/ScreenHeader";
import { SocialButton } from "../../components/auth/SocialButton";
import { useSignupForm } from "../../hooks/auth/useSignupForm";

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  iosClientId:
    "321354387399-u4qsn500nvnj8738hnr3imnpp7rkg7t4.apps.googleusercontent.com",
  webClientId:
    "321354387399-8mh3tsrl9ji8a6164si406unp6uilq52.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export default function SignupScreen() {
  const router = useRouter();
  const { formData, errors, updateField, validateForm } = useSignupForm();
  const { register, googleLogin, appleLogin, isLoading, error, requiresOtp } =
    useAuth();

  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        let idToken = response.data?.idToken; 
        // If idToken is missing, fetch tokens manually
        if (!idToken) {
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens.idToken;
        }

        if (!idToken) {
          throw new Error("Google returned null idToken");
        }
          console.log( "google auth code",response.data?.serverAuthCode)
          console.log( "google Id token",response.data?.idToken)
          console.log( "google user",response.data?.user)
          console.log( "google auth scopes",response.data?.scopes)

        await googleLogin({ idToken: idToken, role: formData.role });
        Toast.show({
          text1: "Signed in with Google",
          type: "customSuccess" as ToastType,
          text2: "Signed in with Google successfully!",
        });
        
      } else {
        console.log("Google auth was rejected by user");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Toast.show({
              text1: "Google Sign-in in progress",
              type: "customError" as ToastType,
              text2: "Google Sign-in still in progress...",
            });
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Toast.show({
              text1: "Play Services not available or outdated",
              type: "customError" as ToastType,
              text2: "You cancelled, please use the signup form",
            });
            console.log("Play Services not available or outdated");
            break;
          default:
            console.log("Google Sign-In error:", error);
        }
      } else {
        Toast.show({
          text1: "Unknown error occurred during Google login",
          type: "customError" as ToastType,
          text2: "Unknown error occurred during Google login",
        });
        console.log("Unknown error occurred during Google login");
      }
    }
  };

const handleSignup = async () => {
    if (!validateForm()) return; // stop if form is invalid
    try {
      await register(formData); // attempt registration
      router.push("/(auth)/otp"); // replace with your actual OTP route
    } catch (err) {
      console.error("Signup error:", err);
      Toast.show({
        text1: 'Signup Failed',
        type: 'customError' as ToastType,
        text2: 'Signup Failed! Please try again.',
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
            value={formData.email}
            onChangeText={(text) => updateField("email", text)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            errorMessage={errors.email}
          />

          <InputField
            label="Password"
            value={formData.password}
            onChangeText={(text) => updateField("password", text)}
            placeholder="Enter your password"
            secureTextEntry
            showPasswordToggle
            error={!!errors.password}
            errorMessage={errors.password}
          />

          <InputField
            label="Confirm Password"
            value={formData.passwordConfirmation}
            onChangeText={(text) => updateField("passwordConfirmation", text)}
            placeholder="Confirm your password"
            secureTextEntry
            showPasswordToggle
            error={!!errors.passwordConfirmation}
            errorMessage={errors.passwordConfirmation}
          />

          {formData.referralCode && (
            <InputField
              label="Referral Code"
              value={formData.referralCode}
              onChangeText={(text) => updateField("referralCode", text)}
              placeholder="Enter referral code"
            />
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <PrimaryButton
            title="Sign up"
            onPress={handleSignup}
            loading={isLoading}
          />

          <OrDivider />

          <SocialButton
            title="Sign in with Google"
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
});
