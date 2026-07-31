import { useAuth } from '@/hooks/useAuth';
import { RegisterCredentials } from '@/types/auth';
import { useState, useMemo } from 'react';

export interface PasswordRule {
  label: string;
  met: boolean;
}

interface SignupFormErrors {
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  role?: string;
  termsAccepted?: string;
}

export const useSignupForm = () => {
    const { user, referralCode } = useAuth();
    const [signupFormData, setFormData] = useState<RegisterCredentials>({
        email: '',
        password: '',
        passwordConfirmation: '',
        role: user?.role || 'SURROGATE',
        referralCode: referralCode || '',
        termsAccepted: false,
    });
    const [errors, setErrors] = useState<SignupFormErrors>({});

    const passwordRules: PasswordRule[] = useMemo(() => [
        { label: "At least 8 characters", met: signupFormData.password.length >= 8 },
        { label: "At least one uppercase letter", met: /[A-Z]/.test(signupFormData.password) },
        { label: "At least one lowercase letter", met: /[a-z]/.test(signupFormData.password) },
        { label: "At least one number", met: /\d/.test(signupFormData.password) },
        { label: "At least one special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(signupFormData.password) },
    ], [signupFormData.password]);

    const updateField = (field: keyof RegisterCredentials, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field as keyof SignupFormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: SignupFormErrors = {};

        if (!signupFormData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(signupFormData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!signupFormData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (!passwordRules.every(r => r.met)) {
            newErrors.password = 'Password does not meet all requirements';
        }

        if (!signupFormData.passwordConfirmation.trim()) {
            newErrors.passwordConfirmation = 'Password confirmation is required';
        } else if (signupFormData.password !== signupFormData.passwordConfirmation) {
            newErrors.passwordConfirmation = 'Passwords do not match';
        }

        if (!signupFormData.role.trim()) {
            newErrors.role = 'Role is required';
        }

        if (!signupFormData.termsAccepted) {
            newErrors.termsAccepted = 'You must agree to the Terms of Service';
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
            termsAccepted: false,
        });
        setErrors({});
    };

    return {
        signupFormData,
        errors,
        passwordRules,
        updateField,
        validateForm,
        resetForm,
    };
};
