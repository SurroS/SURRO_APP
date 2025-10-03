import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import { useAuth } from "@/hooks/useAuth";
import { Toast } from 'toastify-react-native';
import { ToastType } from 'toastify-react-native/utils/interfaces';
import { InputField } from "../../components/auth/InputField";
import { OrDivider } from "../../components/auth/OrDivider";
import { PrimaryButton } from "../../components/auth/PrimaryButton";
import { ScreenHeader } from "../../components/auth/ScreenHeader";
import { SocialButton } from "../../components/auth/SocialButton";
import { useLoginForm } from "../../hooks/auth/useLoginForm";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

WebBrowser.maybeCompleteAuthSession();


export default function LoginScreen() {
  const router = useRouter();
  const { formData, errors, updateField, validateForm } = useLoginForm();
  const { login, googleLogin, appleLogin, isLoading, error } = useAuth();
 
 
  GoogleSignin.configure({
  iosClientId:
    "321354387399-u4qsn500nvnj8738hnr3imnpp7rkg7t4.apps.googleusercontent.com",
  webClientId:
    "321354387399-8mh3tsrl9ji8a6164si406unp6uilq52.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
});

const handleGoogleSignin = async () => {
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


  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      // await login(formData); // attempt registration
      // Alert.alert("Success", "Logged in successfully");
      Toast.show({
        text1: 'Logged in successfully',
        type: 'customSuccess' as ToastType,
        text2: 'Logged in successfully!',
      });
      router.push("/(tabs)/home"); // redirect to your home stack
    } catch (err) {
      console.error("login error:", err);
      Alert.alert("failed", `${err}`)
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

        <PrimaryButton title="Log in" onPress={handleLogin} />

        <OrDivider />

           <SocialButton
            title="Continue with Google"
            icon={require("../../assets/images/google.png")}
            onPress={() => handleGoogleSignin} 
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
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 50,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#0E0E55",
    fontWeight: "bold",
  },
  signupLink: {
    marginTop: 20,
    alignSelf: "center",
  },
  signupLinkText: {
    color: "#0E0E55",
    fontWeight: "bold",
  },
});
