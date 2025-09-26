import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import {
  Alert, 
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InputField } from '../../components/auth/InputField';
import { OrDivider } from '../../components/auth/OrDivider';
import { PrimaryButton } from '../../components/auth/PrimaryButton';
import { ScreenHeader } from '../../components/auth/ScreenHeader';
import { SocialButton } from '../../components/auth/SocialButton';
import { useLoginForm } from '../../hooks/auth/useLoginForm';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { formData, errors, updateField, validateForm } = useLoginForm();

  // Google setup (kept in case you still want to use later)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '', // Add your Google client ID here if you enable it
  });

  useEffect(() => {
    if (response?.type === 'success') {
      Alert.alert('Success', 'Logged in with Google');
      router.replace('/(tabs)/home'); // go to home page
    }
  }, [response]);

  const handleAppleAuth = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        Alert.alert('Success', 'Logged in with Apple');
        router.replace('/(tabs)/home'); // go to home page
      }
    } catch (err: any) {
      if (err.code === 'ERR_CANCELED') return;
      Alert.alert('Apple Login Failed', 'Please try again.');
    }
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    // 🚀 Fake login: no backend, just navigate
    Alert.alert('Success', 'Logged in successfully');
    router.replace('/(tabs)/home'); // redirect to your home stack
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="Log in" onBackPress={() => router.back()} />

        <InputField
          label="Username/Email"
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!errors.email}
          errorMessage={errors.email}
        />

        <InputField
          label="Password"
          value={formData.password}
          onChangeText={(text) => updateField('password', text)}
          placeholder="Enter your password"
          secureTextEntry
          showPasswordToggle
          error={!!errors.password}
          errorMessage={errors.password}
        />

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => router.push('/forgot-password')}
        >
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <PrimaryButton title="Log in" onPress={handleLogin} />

        <OrDivider />

        <SocialButton
          title="Continue with Google"
          icon={require('../../assets/images/google.png')}
          onPress={() => promptAsync()}
          disabled={!request}
        />

        <SocialButton
          title="Continue with Apple"
          icon={require('../../assets/images/apple.png')}
          onPress={handleAppleAuth}
        />

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push('/signup')}
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
    backgroundColor: '#F7F7F7',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 50,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#0E0E55',
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
  signupLinkText: {
    color: '#0E0E55',
    fontWeight: 'bold',
  },
});
