import { useRouter } from 'expo-router';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputField } from '@/components/auth/InputField';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { ScreenHeader } from '@/components/auth/ScreenHeader';
import { useForgotPasswordForm } from '@/hooks/auth/useForgotPasswordForm';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { email, error, updateEmail, validateForm } = useForgotPasswordForm();
  const { forgotPassword, isLoading } = useAuth();

  const handleForgotPassword = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await forgotPassword({ email });
      Alert.alert('Success', 'Password reset instructions sent to your email.');
      console.error('Forgot password error:', err);
      console.log(updateEmail)
      console.log(validateForm)
      console.log(email)
      // Navigation will be handled by the auth store state changes
    } catch (err) {
      console.error('Forgot password error:', err);
      console.log(updateEmail)
      console.log(validateForm)
      console.log(email)
      // Error is already handled by the auth store
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="Forgot Password" onBackPress={() => router.back()} />

        <Text style={styles.infoText}>
          Enter your email address and we&apos;ll send you a code to reset your password.
        </Text>

        <InputField
          label="Email"
          value={email}
          onChangeText={updateEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={!!error}
          errorMessage={error!}
        />

        <PrimaryButton
          title="Send Code"
          onPress={handleForgotPassword}
          loading={isLoading}
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
  infoText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
});
