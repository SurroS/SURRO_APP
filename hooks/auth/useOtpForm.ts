import { useState } from 'react';

export const useOtpForm = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState<string | null>(null);

    const updateOtpDigit = (index: number, value: string) => {
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only allow 1 digit
        setOtp(newOtp);

        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
    };

    const validateOtp = (): boolean => {
        const code = otp.join('');
        if (code.length !== 4) {
            setError('Please enter the complete 4-digit code');
            return false;
        }
        return true;
    };

    const getOtpCode = (): string => {
        return otp.join('');
    };

    const resetOtp = () => {
        setOtp(['', '', '', '']);
        setError(null);
    };

    return {
        otp,
        error,
        updateOtpDigit,
        validateOtp,
        getOtpCode,
        resetOtp,
    };
};
