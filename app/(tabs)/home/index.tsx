import AgentScreen from "@/components/roles/agent/agent";
import ParentScreen from "@/components/roles/parent/parent";
import SurrogateScreen from "@/components/roles/surrogate/surrogate";
import { useAuth } from "@/hooks/useAuth";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";
import { Spinner, Text, YStack } from "tamagui";

export default function HomeIndex() {
  // const router = useRouter();
  const Role = useAuth().user?.role?.trim(); // trim in case of trailing spaces

  // const roleMapping = {
  //   "INTENDED_PARENT": "parent",
  //   "AGENT": "agent",
  //   "SURROGATE": "surrogate",
  // } as const;

  // type RoleKey = keyof typeof roleMapping;
  // const k = (Role && Role in roleMapping)
  // useEffect(() => {
  //   console.log(Role)
  //   console.log(k)
  //   if (Role && Role in roleMapping) {
  //     const path = roleMapping[Role as RoleKey];
  //     router.replace(`/(roles)/${path}`);

  //   }
  // }, [Role]);

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Spinner size="large" />
      {/* <Text color={"black"}>Loading Home...</Text> */}
      {
        Role === 'SURROGATE' ? (
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
        ) : null
      }
    </YStack>
  );
}
