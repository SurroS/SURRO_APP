import React from 'react';
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
}) => (
    <TouchableOpacity
        style={[styles.button, style, (loading || disabled) && styles.disabled]}
        onPress={onPress}
        disabled={loading || disabled}
    >
        
        <Text style={styles.text}>
          {icon}  {loading ? 'Please wait...' : title}
        </Text>
    </TouchableOpacity>
);

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
