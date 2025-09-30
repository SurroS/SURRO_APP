import { useRouter } from 'expo-router';
import { useRef } from 'react';
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

import { useAuth } from '@/hooks/useAuth';
import { PrimaryButton } from '../../components/auth/PrimaryButton';
import { ScreenHeader } from '../../components/auth/ScreenHeader';
import { useOtpForm } from '../../hooks/auth/useOtpForm';

export default function OTPScreen() {
  const router = useRouter();
  const { otp, error, updateOtpDigit, validateOtp, getOtpCode } = useOtpForm();
  const { verifyOtp, resendOtp, tempEmail, isLoading, clearError } = useAuth();

  // Refs for focusing inputs
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    updateOtpDigit(index, text);

    // Auto focus next input if not last
    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!validateOtp()) {
      return;
    }

    if (!tempEmail) {
      Alert.alert('Error', 'No email found. Please restart the process.');
      return;
    }

    try {
      await verifyOtp({
        email: tempEmail,
        code: getOtpCode(),
      });
      // Navigation will be handled automatically by the auth store state changes
      // The index.tsx will detect authentication and navigate to the appropriate role dashboard
    } catch (err) {
      console.error('OTP verification error:', err);
      // Error is already handled by the auth store
    }
  };

  const handleResendOtp = async () => {
    if (!tempEmail) {
      Alert.alert('Error', 'No email found. Please restart the process.');
      return;
    }

    try {
      await resendOtp(tempEmail);
      Alert.alert('Success', 'OTP code has been resent to your email.');
    } catch (err) {
      console.error('Resend OTP error:', err);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="Enter OTP" onBackPress={() => router.back()} />

        <Image
          source={require('../../assets/images/openemail.png')}
          style={styles.image}
        />

        <Text style={styles.infoText}>
          We&apos;ve sent a 6-digit verification code to {tempEmail || 'your email'}.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) {
                  inputs.current[index] = ref;
                }
              }}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <PrimaryButton
          title="Verify"
          onPress={handleVerify}
          loading={isLoading}
        />

        <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp}>
          <Text style={styles.resendText}>
            Didn&apos;t get the code? <Text style={styles.resendLink}>Resend</Text>
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
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 30,
    width: '100%',
  },
  otpInput: {
    width: 50,
    height: 50,
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    fontSize: 22,
    textAlign: 'center',
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 15,
    textAlign: 'center',
  },
  resendButton: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  resendLink: {
    color: '#0E0E55',
    fontWeight: 'bold',
  },
});
