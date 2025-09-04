import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();


const useNavigation = () => {
    return {
        navigate: (screenName) => console.log(`Navigating to: ${screenName}`),
    };
};

export default function SignupScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    
    const navigation = useNavigation();

   
    const API_BASE_URL = 'https://surrosantara-latest.onrender.com';

    const handlePasswordChange = (text) => {
        setPassword(text);
        if (text.length >= 8) {
            setIsPasswordValid(true);
        } else {
            setIsPasswordValid(false);
        }
    };

    
    const handleManualSignup = async () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, {
                email: username,
                password: password,
            });

            if (response.data && response.data.success) {
                Alert.alert('Success', 'User registered successfully! Please check your email for OTP.');
                navigation.navigate('otp');
            } else {
                Alert.alert('Registration Failed', 'An error occurred during registration. Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (error as any).response &&
                (error as any).response.status === 409
            ) {
                Alert.alert('Registration Failed', 'This email is already registered.');
            } else {
                Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

   
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: 'YOUR_GOOGLE_WEB_CLIENT_ID',
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            handleGoogleAuth(response.authentication.accessToken);
        }
    }, [response]);

    const handleGoogleAuth = async (accessToken: string) => {
        setLoading(true);
        try {
            const apiResponse = await axios.post(`${API_BASE_URL}/api/v1/auth/google`, {
                accessToken: accessToken,
            });
            if (apiResponse.data && apiResponse.data.token) {
                Alert.alert('Success', 'Logged in with Google!');
              
            } else {
                Alert.alert('Login Failed', 'Failed to authenticate with Google. Please try again.');
            }
        } catch (error) {
            console.error('Google Auth Error:', error);
            Alert.alert('Error', 'An error occurred during Google authentication.');
        } finally {
            setLoading(false);
        }
    };

 
    const handleAppleAuth = async () => {
        setLoading(true);
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            const apiResponse = await axios.post(`${API_BASE_URL}/api/v1/auth/apple`, {
                identityToken: credential.identityToken,
            });

            if (apiResponse.data && apiResponse.data.token) {
                Alert.alert('Success', 'Logged in with Apple!');
              
            } else {
                Alert.alert('Login Failed', 'Failed to authenticate with Apple.');
            }
        } catch (e) {
            if (e.code === 'ERR_CANCELED') {
                console.log('Apple Auth Canceled');
            } else {
                console.error('Apple Auth Error:', e);
                Alert.alert('Error', 'An error occurred during Apple authentication.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Sign up</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username/Email"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={password}
                    onChangeText={handlePasswordChange}
                />
                <View style={styles.validationRow}>
                    <AntDesign
                        name={isPasswordValid ? "checkcircle" : "closecircle"}
                        size={16}
                        color={isPasswordValid ? "green" : "red"}
                    />
                    <Text style={styles.validationText}>
                        Password must be 8 characters or more
                    </Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleManualSignup}
                    disabled={loading}>
                    <Text style={styles.primaryButtonText}>
                        {loading ? 'Registering...' : 'Continue'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.orContainer}>
                    <View style={styles.orLine} />
                    <Text style={styles.orText}>or</Text>
                    <View style={styles.orLine} />
                </View>

                <TouchableOpacity
                    style={styles.socialButton}
                    disabled={!request}
                    onPress={() => promptAsync()}>
                    <AntDesign name="google" size={20} color="#333" />
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.socialButton}
                    onPress={handleAppleAuth}>
                    <AntDesign name="apple1" size={20} color="#333" />
                    <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    container: {
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#EBEBEB',
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
    },
    validationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    validationText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#666',
    },
    primaryButton: {
        backgroundColor: '#4A4676',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#DEDEDE',
    },
    orText: {
        marginHorizontal: 10,
        color: '#999',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DEDEDE',
        padding: 16,
        marginBottom: 12,
    },
    socialButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});