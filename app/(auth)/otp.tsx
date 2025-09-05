import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

export default function OTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1); // allow only 1 digit
    setOtp(newOtp);

    // Auto focus next input if not last
    if (text && index < otp.length - 1) {
      const nextInput = `otp-${index + 1}`;
      // @ts-ignore
      inputs[nextInput]?.focus();
    }
  };

  // Refs for focusing inputs
  const inputs: { [key: string]: TextInput | null } = {};

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 4) {
      Alert.alert('Error', 'Please enter the 4-digit OTP code.');
      return;
    }
    Alert.alert('Success', `OTP Verified: ${code}`);
    router.push('/reset-password'); // go to reset password page
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.header}>Enter OTP</Text>
        </View>

        {/* Image */}
        <Image
          source={require('../../assets/images/openemail.png')}
          style={styles.image}
        />

        {/* Info text */}
        <Text style={styles.infoText}>
          We’ve sent a 4-digit verification code to your email.
        </Text>

        {/* OTP input fields */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs[`otp-${index}`] = ref)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        {/* Verify button */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleVerify}>
          <Text style={styles.primaryButtonText}>Verify</Text>
        </TouchableOpacity>

        {/* Resend */}
        <TouchableOpacity style={{ marginTop: 20 }}>
          <Text style={styles.resendText}>
            Didn’t get the code? <Text style={{ color: '#0E0E55', fontWeight: 'bold' }}>Resend</Text>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    position: 'relative',
    alignSelf: 'stretch',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 4,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
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
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '80%',
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    fontSize: 22,
    textAlign: 'center',
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#0E0E55',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
