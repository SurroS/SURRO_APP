import { useAuth } from '@/hooks/useAuth';
import { RegisterCredentials } from '@/types/auth';
import { useState } from 'react';

export const useSignupForm = () => {
    const { user, referralCode } = useAuth();
    const [formData, setFormData] = useState<RegisterCredentials>({
        email: '',
        password: '',
        passwordConfirmation: '',
        role: user?.role || 'surrogate', // Use role from auth store
        refferalCode: referralCode || '', // Use referral code from auth store
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

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.passwordConfirmation.trim()) {
            newErrors.passwordConfirmation = 'Password confirmation is required';
        } else if (formData.password !== formData.passwordConfirmation) {
            newErrors.passwordConfirmation = 'Passwords do not match';
        }

        if (!formData.role.trim()) {
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
            role: user?.role || 'surrogate',
            refferalCode: referralCode || '',
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
