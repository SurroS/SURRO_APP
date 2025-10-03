import { useAuth } from '@/hooks/useAuth';
import { Button, Text, YStack } from 'tamagui';

export default function AgentScreen() {
  const { user, logout } = useAuth();

  return (
    <YStack justifyContent="center" alignItems="center" padding="$4">
      <Text
        fontSize="$6"
        fontWeight="bold"
        marginBottom="$4"
        color="$primary"
      >
        Agent Dashboard
      </Text>

      {user && (
        <YStack alignItems="center" marginBottom="$4">
          <Text color={"balck"} fontSize="$4" marginBottom="$2">
            Welcome, {user.name}!
          </Text>
          <Text color={"balck"} fontSize="$3" >
            Email: {user.email}
          </Text>
          <Text color={"balck"} fontSize="$3">
            Role: {user.role}
          </Text>
          <Text color={"balck"} fontSize="$3" >
            Verified: {user.isVerified ? 'Yes' : 'No'}
          </Text>
        </YStack>
      )}

      <Text marginBottom="$4" textAlign="center" color={'black'}>
        This is the Agents dashboard screen. Here you can manage your Agent&apos;s journey.
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