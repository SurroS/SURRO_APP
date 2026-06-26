import { LoginCredentials } from '@/types/auth';
import { useState, useMemo } from 'react';

export interface PasswordRule {
  label: string;
  met: boolean;
}

export const useLoginForm = () => {
    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

    const passwordRules: PasswordRule[] = useMemo(() => [
        { label: "At least 8 characters", met: formData.password.length >= 8 },
        { label: "At least one uppercase letter", met: /[A-Z]/.test(formData.password) },
        { label: "At least one lowercase letter", met: /[a-z]/.test(formData.password) },
        { label: "At least one number", met: /\d/.test(formData.password) },
        { label: "At least one special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
    ], [formData.password]);

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
        } else if (!passwordRules.every(r => r.met)) {
            newErrors.password = 'Password does not meet all requirements';
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
        passwordRules,
        updateField,
        validateForm,
        resetForm,
    };
};
