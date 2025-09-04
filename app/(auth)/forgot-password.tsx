import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const MailIcon = () => (
    <Image 
        source={require('../../assets/images/mail_icon.png')}
        style={styles.mailIcon}
    />
);

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  
  const [currentStep, setCurrentStep] = useState('email');

  const renderContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <>
            <MailIcon />
            <Text style={styles.subtitle}>
              We sent a code to <Text style={styles.emailText}>****@gmail.com</Text>. Enter the code to reset your password.
            </Text>
            <View style={styles.otpContainer}>
              <TextInput style={styles.otpInput} maxLength={1} keyboardType="numeric" />
              <TextInput style={styles.otpInput} maxLength={1} keyboardType="numeric" />
              <TextInput style={styles.otpInput} maxLength={1} keyboardType="numeric" />
              <TextInput style={styles.otpInput} maxLength={1} keyboardType="numeric" />
            </View>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentStep('resetPassword')}>
              <Text style={styles.primaryButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resendButton}>
              <Text style={styles.resendText}>Did not receive the verification code? <Text style={styles.resendLink}>Resend code</Text></Text>
            </TouchableOpacity>
          </>
        );
      case 'resetPassword':
        return (
          <>
            <Text style={styles.header}>Reset password</Text>
            <TextInput
              style={styles.input}
              placeholder="New password"
              placeholderTextColor="#999"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Submit</Text>
            </TouchableOpacity>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderContent()}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mailIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    tintColor: '#4A4676',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
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
    color: '#333',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
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
    backgroundColor: '#4A4676',
    borderRadius: 8,
    width: '100%',
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 20,
  },
  resendText: {
    color: '#666',
  },
  resendLink: {
    color: '#4A4676',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#EBEBEB',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
    fontSize: 16,
    color: '#333',
  },
});