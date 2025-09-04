import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const MailIcon = () => (
  <Image
    source={require('../../assets/images/mail_icon.png')} // placeholder for your image
    style={styles.mailIcon}
  />
);

export default function OTPScreen() {
  const [step, setStep] = useState(1); // 1 = OTP entry, 2 = success, 3 = reset password
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const userEmail = 'j***@gmail.com'; // replace with actual
  const API_BASE_URL = '';

  const handleOTPVerification = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL, {
        email: userEmail,
        otp: code,
      });

      if (response.data.success) {
        setStep(2); // go to success screen
      } else {
        Alert.alert('Verification Failed', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'An error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/resend`, {
        email: userEmail,
      });

      if (response.data.success) {
        Alert.alert('OTP Sent', 'A new OTP has been sent to your email.');
      } else {
        Alert.alert('Error', 'Failed to resend OTP.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'An error occurred while resending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email: userEmail,
        password: newPassword,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Password reset successfully!');
      } else {
        Alert.alert('Error', 'Failed to reset password.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert('Error', 'An error occurred while resetting your password.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      console.log('Go back to previous screen'); // replace with navigation.goBack()
    } else if (step === 2) {
      setStep(1); // back to OTP entry
    } else if (step === 3) {
      setStep(2); // back to success screen
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        {step === 1 && (
          <>
            <MailIcon />
            <Text style={styles.header}>Confirm email address</Text>
            <Text style={styles.subtitle}>
              We sent a code to <Text style={styles.emailText}>{userEmail}</Text>. Enter the code to reset your password.
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  maxLength={1}
                  keyboardType="numeric"
                  value={digit}
                  onChangeText={(text) => {
                    const newOtp = [...otp];
                    newOtp[index] = text;
                    setOtp(newOtp);
                  }}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleOTPVerification}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Verifying...' : 'Submit'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOTP}
              disabled={loading}
            >
              <Text style={styles.resendText}>
                Did not receive the verification code?{' '}
                <Text style={styles.resendLink}>Resend code</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <MailIcon />
            <Text style={styles.subtitle}>
              Your email has been successfully confirmed.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep(3)}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.header}>Reset password</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your 8-digit password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm new password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your 8-digit password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePasswordReset}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Saving...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  mailIcon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 20,
  },
  emailText: {
    fontWeight: 'bold',
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  otpInput: {
    width: 40,
    height: 50,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderColor: '#ccc',
    fontSize: 24,
  },
  primaryButton: {
    backgroundColor: '#0E0E55',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  resendText: {
    color: '#666',
  },
  resendLink: {
    color: '#0E0E55',
    fontWeight: 'bold',
  },
  inputGroup: {
    width: '100%',
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
});
