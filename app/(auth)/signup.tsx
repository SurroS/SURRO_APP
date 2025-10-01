import { useAuth } from "@/hooks/useAuth";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { InputField } from "../../components/auth/InputField";
import { OrDivider } from "../../components/auth/OrDivider";
import { PrimaryButton } from "../../components/auth/PrimaryButton";
import { ScreenHeader } from "../../components/auth/ScreenHeader";
import { SocialButton } from "../../components/auth/SocialButton";
import { useSignupForm } from "../../hooks/auth/useSignupForm";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const router = useRouter();
  const { formData, errors, updateField, validateForm } = useSignupForm();
  const { register, googleLogin, appleLogin, isLoading, error } = useAuth();


const isExpoGo = Constants.executionEnvironment === "storeClient";

const redirectUri = isExpoGo
  ? AuthSession.makeRedirectUri({ useProxy: true })
  : AuthSession.makeRedirectUri({ scheme: "surro" }); // must match app.json

console.log("Redirect URI:", redirectUri);

const [request, response, promptAsync] = Google.useAuthRequest({
  iosClientId:
    "321354387399-u4qsn500nvnj8738hnr3imnpp7rkg7t4.apps.googleusercontent.com",
  androidClientId:
    "321354387399-t6ahu1dmgjm7gcfi1p90leteos4bpqp8.apps.googleusercontent.com",
  webClientId:
    "321354387399-8mh3tsrl9ji8a6164si406unp6uilq52.apps.googleusercontent.com",
  redirectUri,
});

// ✅ Handle Google response ONCE
useEffect(() => {
  if (response?.type === "success") {
    const idToken = response.authentication?.idToken;

    if (idToken) {
      handleGoogleAuth(idToken);
    } else {
      console.error("No idToken returned:", response);
      Toast.show({
        text1: "Google Sign-in Failed",
        type: "customError" as ToastType,
        text2: "No ID token received.",
      });
    }
  }
}, [response]);

// --- Google handler ---
const handleGoogleAuth = async (idToken: string) => {
  try {
    await googleLogin({ idToken, role: formData.role });

    Toast.show({
      text1: "Signed in with Google",
      type: "customSuccess" as ToastType,
      text2: "Google signup successful!",
    });

    router.push("/(auth)/otp");
  } catch (err) {
    console.error("Google signup error:", err);
    Toast.show({
      text1: "Google Sign-in Failed",
      type: "customError" as ToastType,
      text2: "Please try again.",
    });
  }
};
  // -------- Handlers -------- //

  const handleSignup = async () => {
    if (!validateForm()) return;
    try {
      await register(formData);
      router.push("/(auth)/otp"); // Always go to OTP after signup
    } catch (err) {
      console.error("Signup error:", err);
      Toast.show({
        text1: "Signup Failed",
        type: "customError" as ToastType,
        text2: "Signup Failed! Please try again.",
      });
    }
  };


  const handleAppleAuth = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        await appleLogin({
          idToken: credential.identityToken,
          role: formData.role,
        });
        Toast.show({
          text1: "Signed in with Apple",
          type: "customSuccess" as ToastType,
          text2: "Apple signup successful!",
        });
        router.push("/(auth)/otp");
      }
    } catch (err: any) {
      if (err?.code === "ERR_CANCELED") return;
      console.error("Apple signup error:", err);
      Toast.show({
        text1: "Apple Sign-in Failed",
        type: "customError" as ToastType,
        text2: "Please try again.",
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

          {Platform.OS === "ios" ? (
            <YStack>
              <SocialButton
                title="Sign in with Apple"
                icon={require("../../assets/images/apple.png")}
                onPress={handleAppleAuth}
              />
              <SocialButton
                title="Sign in with Google"
                icon={require("../../assets/images/google.png")}
                onPress={() => promptAsync()}
                disabled={!request}
              />
            </YStack>
          ) : (
            <SocialButton
              title="Sign in with Google"
              icon={require("../../assets/images/google.png")}
              onPress={() => promptAsync()}
              disabled={!request}
            />
          )}

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
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 50,
  },
  errorText: {
    color: "red",
    marginTop: -10,
    marginBottom: 15,
    textAlign: "center",
  },
  loginLink: {
    marginTop: 20,
    alignSelf: "center",
  },
  loginLinkText: {
    color: "#0E0E55",
    fontWeight: "bold",
  },
});
