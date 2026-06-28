import React, { useState, useRef } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SocialButtonProps {
    title: string;
    icon: any;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    style?: any;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
    title,
    icon,
    onPress,
    loading = false,
    disabled = false,
    style,
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
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Image source={icon} style={styles.icon} />
                )}
                <Text style={styles.text}>{loading ? 'Please wait...' : title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#000',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginRight: 10,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
});
