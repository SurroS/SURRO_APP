import { useState } from 'react';

export const useForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    const updateEmail = (value: string) => {
        setEmail(value);
        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
    };

    const validateForm = (): boolean => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setEmail('');
        setError(null);
    };

    return {
        email,
        error,
        updateEmail,
        validateForm,
        resetForm,
    };
};
