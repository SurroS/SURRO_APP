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
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
});


export default function SignupScreen() {
  const router = useRouter();
  const { signupFormData, errors, updateField, validateForm } = useSignupForm();
  const { register, googleLogin, appleLogin, isLoading, error, requiresOtp } =
    useAuth();

  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        let idToken = response.data?.idToken;

        // Sometimes idToken isn’t directly included
        if (!idToken) {
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens.idToken;
        }

        if (!idToken) {
          throw new Error("Google returned null idToken");
        }

        console.log("====== GOOGLE LOGIN SUCCESS ======");
        console.log("ID Token:", idToken);
        console.log("User Info:", response.data?.user);

        // Call the store action (handles backend + state)
        await googleLogin({
          idToken,
          role: signupFormData?.role, // Only used if signing up
        });

        Toast.show({
          text1: "Google Sign-In Success",
          type: "customSuccess" as ToastType,
          text2: "Welcome back!",
        });

        router.replace("/(tabs)/home");
      } else {
        console.log("Google auth was rejected by user");
        Toast.show({
          text1: "Sign-in cancelled",
          type: "customError" as ToastType,
          text2: "You cancelled the Google sign-in process.",
        });
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Toast.show({
              text1: "Google Sign-in in progress",
              type: "customWarning" as ToastType,
              text2: "Please wait while sign-in completes.",
            });
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Toast.show({
              text1: "Play Services not available",
              type: "customError" as ToastType,
              text2: "Your Google Play Services may be outdated.",
            });
            break;
          default:
            console.log("Google Sign-In error:", error);
            Toast.show({
              text1: "Google Sign-in failed",
              type: "customError" as ToastType,
              text2: "An unexpected error occurred.",
            });
        }
      } else {
        console.log("Unknown Google Sign-In error:", error);
        Toast.show({
          text1: "Sign-in failed",
          type: "customError" as ToastType,
          text2: "Unknown error occurred during Google login",
        });
      }
    }
  };

const handleSignup = async () => {
    if (!validateForm()) return; // stop if form is invalid
    try {
      await register(signupFormData); // attempt registration
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
});
