import { useAuth } from "@/hooks/useAuth";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack } from "tamagui";
import { InputField } from '../../components/auth/InputField';
import { OrDivider } from '../../components/auth/OrDivider';
import { PrimaryButton } from '../../components/auth/PrimaryButton';
import { ScreenHeader } from '../../components/auth/ScreenHeader';
import { SocialButton } from '../../components/auth/SocialButton';
import { useSignupForm } from '../../hooks/auth/useSignupForm';

import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  iosClientId: "321354387399-u4qsn500nvnj8738hnr3imnpp7rkg7t4.apps.googleusercontent.com",
  webClientId: "321354387399-8mh3tsrl9ji8a6164si406unp6uilq52.apps.googleusercontent.com",
  scopes:['https://www.googleapis.com/auth/drive.readonly',],
  offlineAccess:true,
  forceCodeForRefreshToken:true
});

export default function SignupScreen() {
  const router = useRouter();
  const { formData, errors, updateField, validateForm } = useSignupForm();
  const { register, isLoading, error } = useAuth();

  const [userToken, setUserToken] = useState<any>(null);

  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const idToken = response.data?.idToken;
        setUserToken(idToken);
        console.log(userToken)

        // 🔑 Send token to backend
        const backendResponse = await fetch(
          "https://dev.surrosantara.space/api/v1/auth/google",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken,
              role: "INTENDED_PARENT", // or dynamic role
            }),
          }
        );

        if (!backendResponse.ok) {
          throw new Error("Backend auth failed");
        }

        const data = await backendResponse.json();
        console.log("Backend login success:", data);

        // Continue navigation
        router.push("/(auth)/otp");
      } else {
        console.log("Google auth was rejected by user");
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert("Sign-in already in progress...");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert("Play Services not available or outdated");
              console.log("Google auth was rejected by user");
            break;
          default:
            console.log("error", error);
        }
      } else {
        Alert.alert("Unknown error occurred during Google login");
      }
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    try {
      await register(formData);
      router.push("/(auth)/otp");
    } catch (err) {
      console.error("Signup error:", err);
      Alert.alert("Signup Failed", "Please try again.");
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
  errorText: { color: "red", marginTop: -10, marginBottom: 15, textAlign: "center" },
  loginLink: { marginTop: 20, alignSelf: "center" },
  loginLinkText: { color: "#0E0E55", fontWeight: "bold" },
});
