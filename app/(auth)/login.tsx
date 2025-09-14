import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import { useAuth } from '@/hooks/useAuth';
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
  const { login, googleLogin, appleLogin, isLoading, error, clearError } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '', // Add your Google client ID here
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuth(response.authentication?.accessToken || '');
    }
  }, [response]);

  const handleGoogleAuth = async (accessToken: string) => {
    try {
      await googleLogin({ idToken: accessToken, role: 'surrogate' });
      Alert.alert('Success', 'Logged in with Google');
    } catch (err) {
      console.error('Google login error:', err);
      Alert.alert('Google Login Failed', 'Please try again.');
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
        await appleLogin({ idToken: credential.identityToken, role: 'surrogate' });
        Alert.alert('Success', 'Logged in with Apple');
      }
    } catch (err: any) {
      if (err.code === 'ERR_CANCELED') return;
      console.error('Apple login error:', err);
      Alert.alert('Apple Login Failed', 'Please try again.');
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      // Navigation will be handled by the auth store state changes
    } catch (err) {
      console.error('Login error:', err);
      // Error is already handled by the auth store
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="Log in" onBackPress={() => router.back()} />

        <InputField
          label="Email"
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

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={() => router.push('/forgot-password')}
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
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 15,
    textAlign: 'center',
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
