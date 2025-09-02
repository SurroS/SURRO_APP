import { YStack, Text, Button } from 'tamagui'
import { useState } from 'react'

// Temporary hardcoded role for demo (later, load from auth)
type Role = 'parent' | 'surrogate' | 'agent'

export default function HomeScreen() {
  // In real app, replace with auth context / user store
  const [role, setRole] = useState<Role>('agent')

  return (
    <YStack flex={1} justify="center" items="center" p="$4">
      {role === 'parent' && (
        <>
          <Text fontSize={24} fontWeight="600" color={"black"} >
            Intended Parent Dashboard
          </Text> 
        </>
      )}

      {role === 'surrogate' && (
        <>
          <Text fontSize={24} fontWeight="600" color={"black"}>
            Surrogate Dashboard
          </Text> 
        </>
      )}

      {role === 'agent' && (
        <>
          <Text fontSize={24} fontWeight="600" color={"black"} >
            Agent / Caregiver Dashboard
          </Text>
        </>
      )}
    </YStack>
  )
}
