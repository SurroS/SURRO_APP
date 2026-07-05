import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface AuthGuardProps {
    children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    // Check if user is accessing the editBio route immediately after onboarding
    const isAccessingEditBio = segments.some(segment => segment.includes('editBio'));

    useEffect(() => {
        if (!isLoading) {
            // If user is authenticated and has a role, but is accessing editBio specifically after onboarding,
            // we should allow the navigation without redirecting to /(tabs)/home
            if (isAuthenticated && user?.role && !isAccessingEditBio) {
                // User is authenticated, navigate to role-specific dashboard
                router.replace(`/(tabs)/home`);
            } else if (!isAuthenticated && !isAccessingEditBio) {
                // User is not authenticated, navigate to auth flow
                // Only redirect if not accessing the editBio route (which could be part of onboarding completion)
                router.replace('/onboarding/role-selection');
            }
        }
    }, [isAuthenticated, user?.role, isLoading, isAccessingEditBio]);

    // Show loading spinner while checking auth state
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0E0E55" />
            </View>
        );
    }

    // Allow post-onboarding users to access editBio route before being redirected
    if (!isAuthenticated && isAccessingEditBio) {
        // Allow access to editBio for users who just completed onboarding but might not be fully authenticated yet
        return <>{children}</>;
    }

    // Don't render children if we're redirecting
    if (!isAuthenticated || !user?.role) {
        return null;
    }

    return <>{children}</>;
};
