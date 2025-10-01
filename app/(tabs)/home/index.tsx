import AgentScreen from "@/components/roles/agent/agent";
import ParentScreen from "@/components/roles/parent/parent";
import SurrogateScreen from "@/components/roles/surrogate/surrogate";
import { useAuth } from "@/hooks/useAuth";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, YStack } from "tamagui";

export default function HomeIndex() {
  const Role = useAuth().user?.role?.trim(); // trim in case of trailing spaces

  return (
    <YStack flex={1} padding="$4">
      <SafeAreaView>

        <YStack justifyContent="center" alignItems="flex-end">
          <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
        </YStack>
        {
          Role === 'SURROGATE' ? (
            <>
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
          ) : null
        }
      </SafeAreaView>
    </YStack>
  );
}
