import { useAuth } from '@/hooks/useAuth';
import { RegisterCredentials } from '@/types/auth';
import { useState } from 'react';

export const useSignupForm = () => {
    const { user, referralCode } = useAuth();
    const [signupFormData, setFormData] = useState<RegisterCredentials>({
        email: '',
        password: '',
        passwordConfirmation: '',
        role: user?.role || 'SURROGATE', // Use role from auth store
        referralCode: referralCode || '', // Use referral code from auth store
    });
    const [errors, setErrors] = useState<Partial<RegisterCredentials>>({});

    const updateField = (field: keyof RegisterCredentials, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterCredentials> = {};

        if (!signupFormData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(signupFormData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!signupFormData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (signupFormData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!signupFormData.passwordConfirmation.trim()) {
            newErrors.passwordConfirmation = 'Password confirmation is required';
        } else if (signupFormData.password !== signupFormData.passwordConfirmation) {
            newErrors.passwordConfirmation = 'Passwords do not match';
        }

        if (!signupFormData.role.trim()) {
            newErrors.role = 'Role is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            passwordConfirmation: '',
            role: user?.role || 'SURROGATE',
            referralCode: referralCode || '',
        });
        setErrors({});
    };

    return {
        signupFormData,
        errors,
        updateField,
        validateForm,
        resetForm,
    };
};
