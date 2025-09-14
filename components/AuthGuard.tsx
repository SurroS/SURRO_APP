import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated && user?.role) {
                // User is authenticated, navigate to role-specific dashboard
                router.replace(`/(roles)/${user.role}`);
            } else if (!isAuthenticated) {
                // User is not authenticated, navigate to auth flow
                router.replace('/role-selection');
            }
        }
    }, [isAuthenticated, user?.role, isLoading]);

    // Show loading spinner while checking auth state
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0E0E55" />
            </View>
        );
    }

    // Don't render children if we're redirecting
    if (!isAuthenticated || !user?.role) {
        return null;
    }

    return <>{children}</>;
};
