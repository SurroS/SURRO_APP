import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    error?: boolean;
    errorMessage?: string;
    showPasswordToggle?: boolean;
    style?: any;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    error = false,
    errorMessage,
    showPasswordToggle = false,
    style,
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputContainer, error && styles.errorContainer]}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                />
                {showPasswordToggle && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                    >
                        <Ionicons
                            name={showPassword ? 'eye' : 'eye-off'}
                            size={24}
                            color="#666"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EBEBEB',
        borderRadius: 8,
        paddingRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333',
    },
    eyeButton: {
        marginLeft: 8,
    },
    errorContainer: {
        borderWidth: 1,
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginTop: 4,
        fontSize: 12,
    },
});
