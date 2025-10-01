import { useAuth } from "@/hooks/useAuth";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google"; 
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
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
 import Constants from "expo-constants";
 import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  statusCodes,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { Toast } from "toastify-react-native";


WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const router = useRouter();
  const { formData, errors, updateField, validateForm } = useSignupForm();
  const { register, googleLogin, appleLogin, isLoading, error } = useAuth();




GoogleSignin.configure({
  iosClientId: "321354387399-rnp7n1va8r5gqdohnboht72pcqu3et44.apps.googleusercontent.com", 
  webClientId: "321354387399-8mh3tsrl9ji8a6164si406unp6uilq52.apps.googleusercontent.com",
});

const isExpoGo = Constants.executionEnvironment === "storeClient";

const redirectUri = isExpoGo
  ? AuthSession.makeRedirectUri({}) // Expo Go uses proxy
  : AuthSession.makeRedirectUri({ scheme: "surro" }); // Dev/Prod build uses scheme

console.log("Redirect URI:", redirectUri);


const  {userToken, setUserToken} = useState<any>(null)


const handleGoogleSignup =async ()=>{
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (isSuccessResponse(response)) {
      setUserToken(response.data);
      console.log(userToken) //action
    } else {
      console.log("auth was rejected by user")
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          Alert.alert("wait...\n signing in progress")
          console.log("wait...\n signing in progress")
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert("play service not available")
          console.log("play service not available")
          break;
        default:
         console.log("something else happened")
      }
    } else {
       Alert.alert("something else stopped the process") 
    }
  }
};


  // const handleAppleAuth = async () => {
  //   try {
  //     const credential = await AppleAuthentication.signInAsync({
  //       requestedScopes: [
  //         AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
  //         AppleAuthentication.AppleAuthenticationScope.EMAIL,
  //       ],
  //     });

  //     if (credential.identityToken) {
  //       await appleLogin({
  //         idToken: credential.identityToken,
  //         role: formData.role,
  //       });
  //       Alert.alert("Success", "Signed in with Apple");
  //     }
  //   } catch (err: any) {
  //     if (err?.code === "ERR_CANCELED") return;
  //     console.error("Apple signup error:", err);
  //     Alert.alert("Apple Sign-in Failed", "Please try again.");
  //   }
  // };

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
              {/* <SocialButton
                title="Sign in with Apple"
                icon={require("../../assets/images/apple.png")}
                onPress={handleAppleAuth}
              />
              <SocialButton
                title="Sign in with Google"
                icon={require("../../assets/images/google.png")}
                onPress={() => promptAsync()}
                disabled={!request}
              /> */}
            </YStack>
          ) : (
            <SocialButton
              title="Sign in with Google"
              icon={require("../../assets/images/google.png")}
              onPress={() => {handleGoogleSignup}}
              // disabled={!request}
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
          {/* <TouchableOpacity
            style={[styles.loginLink, { marginTop: 10 }]}
            onPress={() => router.push('/(auth)/otp')}
          >
            <Text style={[styles.loginLinkText, { color: '#666' }]}>
              Debug: Go to OTP Screen
            </Text>
          </TouchableOpacity> */}
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

// const [request, response, promptAsync] = Google.useAuthRequest({
//   iosClientId: "321354387399-rnp7n1va8r5gqdohnboht72pcqu3et44.apps.googleusercontent.com",
//   androidClientId: "321354387399-8mh3tsrl9ji8a6164si406unp6uilq52.apps.googleusercontent.com",
//   webClientId: "321354387399-8mh3tsrl9ji8a6164si406unp6uilq52.apps.googleusercontent.com",
//    redirectUri
// });

// useEffect(() => {
//   const redirectUri = AuthSession.makeRedirectUri();
//   console.log("uri -", redirectUri)
//   if (response?.type === "success") {
//     // ✅ Use ID token (JWT) not accessToken
//     const idToken = response.params?.id_token;

//     if (idToken) {
//       handleGoogleAuth(idToken);
//     } else {
//       console.error("No id_token returned:", response);
//       Alert.alert("Google Sign-in Failed", "No ID token received.");
//     }
//   }
// }, [response]);

// const handleGoogleAuth = async (idToken: string) => {
//   try {
//     await googleLogin({ idToken, role: formData.role });
//     Alert.alert("Success", "Signed in with Google");
//   } catch (err) {
//     console.error("Google signup error:", err);
//     Alert.alert("Google Sign-in Failed", "Please try again.");
//   }
// };