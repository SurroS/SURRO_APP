import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface PrimaryButtonProps {
    title?: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: any;
    icon?:any
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    style,
    icon
}) => {
    const [pressedOnce, setPressedOnce] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handlePress = () => {
        if (pressedOnce) return;
        setPressedOnce(true);
        onPress();
        timerRef.current = setTimeout(() => setPressedOnce(false), 500);
    };

    const isDisabled = loading || disabled || pressedOnce;

    return (
        <TouchableOpacity
            style={[styles.button, style, isDisabled && styles.disabled]}
            onPress={handlePress}
            disabled={isDisabled}
        >
            
            <Text style={styles.text}>
              {icon}  {loading ? 'Please wait...' : title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#0E0E55',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.6,
    },
});
