import { useAuth } from '@/hooks/useAuth';
import { Button, Text, YStack } from 'tamagui';

export default function ParentScreen() {
  const { user, logout } = useAuth();

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      <Text
        fontSize="$6"
        fontWeight="bold"
        marginBottom="$4"
        color="$primary"
      >
        Parent Dashboard
      </Text>

      {user && (
        <YStack alignItems="center" marginBottom="$4">
          <Text fontSize="$4" marginBottom="$2">
            Welcome, {user.name}!
          </Text>
          <Text fontSize="$3" color="$gray10">
            Email: {user.email}
          </Text>
          <Text fontSize="$3" color="$gray10">
            Role: {user.role}
          </Text>
          <Text fontSize="$3" color="$gray10">
            Verified: {user.isVerified ? 'Yes' : 'No'}
          </Text>
        </YStack>
      )}

      <Text marginBottom="$4" textAlign="center">
        This is the Parent dashboard screen. Here you can manage your journey to parenthood.
      </Text>

      <Button
        onPress={logout}
        backgroundColor="$red10"
        color="white"
        marginTop="$4"
      >
        Logout
      </Button>
    </YStack>
  );
}