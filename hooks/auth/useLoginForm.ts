import { LoginCredentials } from '@/types/auth';
import { useState } from 'react';

export const useLoginForm = () => {
    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

    const updateField = (field: keyof LoginCredentials, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginCredentials> = {};

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({ email: '', password: '' });
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
