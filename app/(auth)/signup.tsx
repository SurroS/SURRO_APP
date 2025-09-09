import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

/** Reusable primary button */
const PrimaryButton = ({
  title,
  onPress,
  loading,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
}) => (
  <TouchableOpacity style={styles.primaryButton} onPress={onPress} disabled={loading}>
    <Text style={styles.primaryButtonText}>{loading ? 'Please wait...' : title}</Text>
  </TouchableOpacity>
);

/** Reusable social auth button (icon + text centered together) */
const SocialButton = ({
  title,
  icon,
  onPress,
  disabled,
}: {
  title: string;
  icon: any; // require('path/to/image.png')
  onPress: () => void;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.socialButton, disabled && { opacity: 0.5 }]}
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.socialInner}>
      <Image source={icon} style={styles.socialIcon} />
      <Text style={styles.socialButtonText}>{title}</Text>
    </View>
  </TouchableOpacity>
);

export default function SignupScreen() {
  const router = useRouter();

  // form
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirm] = useState('');

  // ui
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // API placeholders
  const API_BASE_URL = ''; // e.g. https://api.example.com

  // Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '', // <-- your Google client ID
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken || '';
      handleGoogleAuth(token);
    }
  }, [response]);

  const handleGoogleAuth = async (accessToken: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/auth/google`, { accessToken });
      if (res.data?.token) {
        Alert.alert('Success', 'Signed in with Google');
        // TODO: handle token (e.g., save & navigate)
      }
    } catch (err) {
      console.error('Google signup error:', err);
      Alert.alert('Google Sign-in Failed', 'Please try again.');
    }
  };

  // Apple OAuth
  const handleAppleAuth = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const res = await axios.post(`${API_BASE_URL}/api/v1/auth/apple`, {
        identityToken: credential.identityToken,
      });

      if (res.data?.token) {
        Alert.alert('Success', 'Signed in with Apple');
        // TODO: handle token (e.g., save & navigate)
      }
    } catch (err: any) {
      if (err?.code === 'ERR_CANCELED') return;
      console.error('Apple signup error:', err);
      Alert.alert('Apple Sign-in Failed', 'Please try again.');
    }
  };

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Example call:
      // const res = await axios.post(`${API_BASE_URL}/api/v1/auth/signup`, { username, email, password });
      // if (res.data?.success) { router.push('/otp'); }

      // Demo only:
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', 'Account created! Please verify your email.');
        router.push('/otp'); // go to OTP to confirm email
      }, 1200);
    } catch (e) {
      setLoading(false);
      Alert.alert('Signup Failed', 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>Sign Up</Text>
        </View>

        {/* Username */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, borderRadius: 0 }]}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="#666"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, borderRadius: 0 }]}
              placeholder="Confirm your password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirm}
            />
            <TouchableOpacity onPress={() => setShowConfirm((s) => !s)}>
              <Ionicons
                name={showConfirm ? 'eye' : 'eye-off'}
                size={24}
                color="#666"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit */}
        <PrimaryButton title="Sign up" onPress={handleSignup} loading={loading} />

        {/* OR */}
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        {/* Social sign-in (centered icon + text) */}
        <SocialButton
          title="Sign in with Google"
          icon={require('../../assets/images/google.png')}
          onPress={() => promptAsync()}
          disabled={!request}
        />
        <SocialButton
          title="Sign in with Apple"
          icon={require('../../assets/images/apple.png')}
          onPress={handleAppleAuth}
        />

        {/* Back to Login */}
        <TouchableOpacity
          style={{ marginTop: 20, alignSelf: 'center' }}
          onPress={() => router.push('/')}
        >
          <Text style={{ color: '#0E0E55', fontWeight: 'bold' }}>
            Already have an account? Log in
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 4,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    backgroundColor: '#EBEBEB',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    paddingRight: 10,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#0E0E55',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  /** OR divider */
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DEDEDE',
  },
  orText: {
    marginHorizontal: 10,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  /** Social buttons */
  socialButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  socialInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // center icon + text as a group
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
