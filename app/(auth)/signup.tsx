import { useAuth } from "@/hooks/useAuth";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
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


WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const router = useRouter();
  const { formData, errors, updateField, validateForm } = useSignupForm();
  const { register, googleLogin, appleLogin, isLoading, error, requiresOtp } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "321354387399-pni8pf1pm86riopsg3ng2nlqoq4hmfjg.apps.googleusercontent.com", // Add your Google client ID here
  });

  useEffect(() => {
    if (response?.type === "success") {
      const token = response.authentication?.accessToken || "";
      handleGoogleAuth(token);
    }
  }, [response]);

  const handleGoogleAuth = async (accessToken: string) => {
    try {
      await googleLogin({ idToken: accessToken, role: formData.role });
      Alert.alert("Success", "Signed in with Google");
    } catch (err) {
      console.error("Google signup error:", err);
      Alert.alert("Google Sign-in Failed", "Please try again.");
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken || '';
      handleGoogleAuth(token);
    }
  }, [response, handleGoogleAuth]);

  // Navigate to OTP screen when signup is successful
  useEffect(() => {
    console.log('Signup useEffect - requiresOtp:', requiresOtp);
    if (requiresOtp) {
      console.log('Navigating to OTP screen...');
      router.push('/(auth)/otp');
    }
  }, [requiresOtp, router]);

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
        Alert.alert("Success", "Signed in with Apple");
      }
    } catch (err: any) {
      if (err?.code === "ERR_CANCELED") return;
      console.error("Apple signup error:", err);
      Alert.alert("Apple Sign-in Failed", "Please try again.");
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return; // stop if form is invalid
    try {
      await register(formData); // attempt registration
      router.push("/(auth)/otp"); // replace with your actual OTP route

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
        {/* Entire page scrollable */}
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
              onChangeText={(text) => updateField('referralCode', text)}
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
          {Platform.OS == "ios" ? (
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

          {/* Debug: Manual OTP navigation button */}
          <TouchableOpacity
            style={[styles.loginLink, { marginTop: 10 }]}
            onPress={() => router.push('/(auth)/otp')}
          >
            <Text style={[styles.loginLinkText, { color: '#666' }]}>
              Debug: Go to OTP Screen
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
  roleDisplay: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0E0E55",
    marginBottom: 20,
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
