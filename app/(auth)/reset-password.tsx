import { useRouter } from 'expo-router';
import {
    Alert, 
    ScrollView,
    StyleSheet,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InputField } from '@/components/auth/InputField';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { ScreenHeader } from '@/components/auth/ScreenHeader';
import { useResetPasswordForm } from '@/hooks/auth/useResetPasswordForm';
import { useAuth } from '@/hooks/useAuth';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { formData, errors, updateField, validateForm } = useResetPasswordForm();
    const { resetPassword, tempEmail, isLoading } = useAuth();

    const handleResetPassword = async () => {
        if (!validateForm()) {
            return;
        }

        if (!tempEmail) {
            Alert.alert('Error', 'No email found. Please restart the process.');
            return;
        }

        try {
            await resetPassword({
                ...formData,
                email: tempEmail,
            });
            Alert.alert('Success', 'Password has been reset successfully.');
            // Navigation will be handled automatically by the auth store state changes
            // The index.tsx will detect authentication and navigate to the appropriate role dashboard
        } catch (err) {
            console.error('Reset password error:', err);
            // Error is already handled by the auth store
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <ScreenHeader title="Reset Password" onBackPress={() => router.back()} />

                <Text style={styles.infoText}>
                    Enter the OTP code sent to {tempEmail || 'your email'} and your new password.
                </Text>

                <InputField
                    label="OTP Code"
                    value={formData.otp}
                    onChangeText={(text) => updateField('otp', text)}
                    placeholder="Enter 6-digit OTP"
                    keyboardType="numeric"
                    error={!!errors.otp}
                    errorMessage={errors.otp}
                />

                <InputField
                    label="New Password"
                    value={formData.newPassword}
                    onChangeText={(text) => updateField('newPassword', text)}
                    placeholder="Enter new password"
                    secureTextEntry
                    showPasswordToggle
                    error={!!errors.newPassword}
                    errorMessage={errors.newPassword}
                />

                <InputField
                    label="Confirm New Password"
                    value={formData.newPasswordConfirmation}
                    onChangeText={(text) => updateField('newPasswordConfirmation', text)}
                    placeholder="Confirm new password"
                    secureTextEntry
                    showPasswordToggle
                    error={!!errors.newPasswordConfirmation}
                    errorMessage={errors.newPasswordConfirmation}
                />

                <PrimaryButton
                    title="Reset Password"
                    onPress={handleResetPassword}
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
