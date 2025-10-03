import { ResetPasswordConfirm } from '@/types/auth';
import { useState } from 'react';

export const useResetPasswordForm = () => {
    const [formData, setFormData] = useState<ResetPasswordConfirm>({
        email: '',
        otp: '',
        newPassword: '',
        newPasswordConfirmation: '',
    });
    const [errors, setErrors] = useState<Partial<ResetPasswordConfirm>>({});

    const updateField = (field: keyof ResetPasswordConfirm, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ResetPasswordConfirm> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.otp.trim()) {
            newErrors.otp = 'OTP code is required';
        } else if (formData.otp.length !== 6) {
            newErrors.otp = 'OTP must be 6 digits';
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }

        if (!formData.newPasswordConfirmation.trim()) {
            newErrors.newPasswordConfirmation = 'Password confirmation is required';
        } else if (formData.newPassword !== formData.newPasswordConfirmation) {
            newErrors.newPasswordConfirmation = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            email: '',
            otp: '',
            newPassword: '',
            newPasswordConfirmation: '',
        });
        setErrors({});
    };

    return {
        formData,
        errors,
        updateField,
        validateForm,
        resetForm,
    };
};
