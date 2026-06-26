import { useState } from 'react';

export const useOtpForm = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
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
        if (code.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return false;
        }
        return true;
    };

    const getOtpCode = (): string => {
        return otp.join('');
    };

    const setOtpFromString = (digits: string) => {
        const arr = digits.split('').slice(0, 6);
        const newOtp = ['', '', '', '', '', ''];
        arr.forEach((d, i) => { newOtp[i] = d; });
        setOtp(newOtp);
        if (error) setError(null);
    };

    const resetOtp = () => {
        setOtp(['', '', '', '', '', '']);
        setError(null);
    };

    return {
        otp,
        error,
        updateOtpDigit,
        setOtpFromString,
        validateOtp,
        getOtpCode,
        resetOtp,
    };
};
