import { useSignupForm } from "@/hooks/auth";
import { useAuth } from "@/hooks/useAuth";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { InputField } from "../../components/auth/InputField";
import { OrDivider } from "../../components/auth/OrDivider";
import { PrimaryButton } from "../../components/auth/PrimaryButton";
import { ScreenHeader } from "../../components/navigation/ScreenHeader";
import { SocialButton } from "../../components/auth/SocialButton";
import { useLoginForm } from "../../hooks/auth/useLoginForm";

WebBrowser.maybeCompleteAuthSession();

GoogleSignin.configure({
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
});

export default function LoginScreen() {
  const router = useRouter();
  const { formData, errors, updateField, validateForm } = useLoginForm();
  const { signupFormData } = useSignupForm();
  const { login, googleLogin, isLoading } = useAuth();

  const handleGoogleSignin = async () => {
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

  // Regular email/password login
  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      await login(formData);
      Toast.show({
        text1: "Logged in successfully",
        type: "customSuccess" as ToastType,
        text2: "Welcome back!",
      });
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error("Login error:", err);
      Toast.show({
        text1: "Login Failed",
        type: "customError" as ToastType,
        text2: "Invalid credentials. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="Log in" onBackPress={() => router.back()} />

        <InputField
          label="Username/Email"
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

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => router.push("/forgot-password")}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Log in"
          onPress={handleLogin}
          loading={isLoading}
        />

        <OrDivider />

        <SocialButton
          title="Continue with Google"
          icon={require("../../assets/images/google.png")}
          onPress={handleGoogleSignin}
        />

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.signupLinkText}>
            Don&apos;t have an account? Sign up
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F7F7" },
  container: { flexGrow: 1, padding: 24, paddingTop: 50 },
  forgotPasswordButton: { alignSelf: "flex-end", marginBottom: 20 },
  forgotPasswordText: { color: "#0E0E55", fontWeight: "bold" },
  signupLink: { marginTop: 20, alignSelf: "center" },
  signupLinkText: { color: "#0E0E55", fontWeight: "bold" },
});
