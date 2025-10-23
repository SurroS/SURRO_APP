// app/(tabs)/home/index.tsx
import { useRouter } from "expo-router";
import AgentScreen from "@/components/roles/agent/agent";
import ParentScreen from "@/components/roles/parent/parent";
import SurrogateScreen from "@/components/roles/surrogate/surrogate";
import { useAuth } from "@/hooks/useAuth";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack, Button, Spinner } from "tamagui";

export default function HomeIndex() {
  const Role = useAuth().user?.role?.trim(); // trim in case of trailing spaces
  const router = useRouter();

  return (
    <YStack flex={1} padding="$4">
      <SafeAreaView>
        {/* Header */}
        <YStack justifyContent="center" alignItems="flex-end">
          <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
        </YStack>
       <SurrogateScreen />
        {/* Role-based content */}
        {Role === 'SURROGATE' ? (
          <>
            <Text>Surrogate</Text>
            <SurrogateScreen />
          </>
        ) : Role === 'INTENDED_PARENT' ? (
          <>
            <Text>Intended Parent</Text>
            <ParentScreen />
          </>
        ) : Role === 'AGENT' ? (
          <>
            <Text>Agent</Text>
            <AgentScreen />
          </>
        ) : (
          <YStack flex={1} justifyContent="center" alignItems="center">
            <Spinner size="large" />
          </YStack>
        )}

      </SafeAreaView>
    </YStack>
  );
}
