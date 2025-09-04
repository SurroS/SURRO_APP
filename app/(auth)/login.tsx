import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
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


const SocialButton = ({
  title,
  icon,
  onPress,
  disabled,
}: {
  title: string;
  icon: any;
  onPress: () => void;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.socialButton, disabled && { opacity: 0.5 }]}
    onPress={onPress}
    disabled={disabled}
  >
    <Image source={icon} style={styles.socialIcon} />
    <Text style={styles.socialButtonText}>{title}</Text>
  </TouchableOpacity>
);


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


const useAuth = () => {
  const login = (token: string) => {
    console.log('Login successful! Token received:', token);
  };
  return { login };
};

const useNavigation = () => {
  return {
    goBack: () => console.log('Going back to the previous screen.'),
    navigate: (screenName: string) =>
      console.log(`Navigating to: ${screenName}`),
  };
};

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const { login } = useAuth();
  const navigation = useNavigation();

  const API_BASE_URL = '';

  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleAuth(response.authentication?.accessToken || '');
    }
  }, [response]);

  const handleGoogleAuth = async (accessToken: string) => {
    try {
      const res = await axios.post(``, { accessToken });
      if (res.data?.token) {
        login(res.data.token);
        Alert.alert('Success', 'Logged in with Google');
      }
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

      const res = await axios.post(``, {
        identityToken: credential.identityToken,
      });

      if (res.data?.token) {
        login(res.data.token);
        Alert.alert('Success', 'Logged in with Apple');
      }
    } catch (err: any) {
      if (err.code === 'ERR_CANCELED') return;
      console.error('Apple login error:', err);
      Alert.alert('Apple Login Failed', 'Please try again.');
    }
  };

  
  const handleLogin = async () => {
    if (!username || !password) {
      setError(true);
      Alert.alert('Error', 'Please enter your username and password.');
      return;
    }

    if (password.length < 8) {
      setError(true);
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const API_ENDPOINT = ``;
      const response = await axios.post(API_ENDPOINT, {
        username: username,
        password: password,
      });

      if (response.data && response.data.token) {
        login(response.data.token);
      } else {
        setError(true);
        Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(true);
      Alert.alert(
        'Login Failed',
        'An error occurred during login. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>Log in</Text>
        </View>

        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username / Email</Text>
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            placeholder="Enter your username or email"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.passwordContainer, error && styles.errorInput]}>
            <TextInput
              style={[styles.input, { flex: 1, borderRadius: 0 }]}
              placeholder="Enter your 8-digit password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="#666"
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        
        {error && <Text style={styles.errorText}>Invalid username or password</Text>}

        
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        
        <PrimaryButton title="Log in" onPress={handleLogin} loading={loading} />

        
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#0E0E55',
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#0E0E55',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 40,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorInput: {
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 15,
  },
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
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    justifyContent: 'center',
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
