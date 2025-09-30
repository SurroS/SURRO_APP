<<<<<<< HEAD
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'
import { Spinner, Text, YStack } from 'tamagui'
=======
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Spinner, Text, YStack } from "tamagui";
>>>>>>> a7cf15627c1ea963fef0f43b0b932ac4467f981c

export default function HomeIndex() {
  const router = useRouter();
  const Role = useAuth().user?.role?.trim(); // trim in case of trailing spaces

<<<<<<< HEAD
  // Redirect immediately to Page1 when home is opened
  // useEffect(() => {
  //   router.replace(`/(roles)/surrogate/index`)
  // }, [])
=======
  const roleMapping = {
    "INTENDED_PARENT": "parent",
    "AGENT": "agent",
    "SURROGATE": "surrogate",
  } as const;

  type RoleKey = keyof typeof roleMapping;
const k = (Role && Role in roleMapping)
  useEffect(() => {console.log(Role)
    console.log(k)
    if (Role && Role in roleMapping) {
      const path = roleMapping[Role as RoleKey];
      router.replace(`/(roles)/${path}`);
      
    }
  }, [Role]);
>>>>>>> a7cf15627c1ea963fef0f43b0b932ac4467f981c

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Spinner size="large" />
<<<<<<< HEAD
      {/* <Text>Loading Home...</Text> */}
      {
        Role === 'SURROGATE' ? (
          <Text>Surrogate</Text>
        ) : Role === 'INTENDED_PARENT' ? (
          <Text>Intended Parent</Text>
        ) : Role === 'AGENT' ? (
          <Text>Agent</Text>
        ) : null
      }
=======
      <Text color={"black"}>Loading Home...</Text>
>>>>>>> a7cf15627c1ea963fef0f43b0b932ac4467f981c
    </YStack>
  );
}
