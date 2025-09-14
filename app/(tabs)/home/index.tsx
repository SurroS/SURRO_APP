import React from 'react'
import { YStack, Text, Button } from 'tamagui'
import { useState } from 'react'
import { useRouter } from 'expo-router'

// We should use proper routing instead of direct component imports
// The role should be managed in a global store
const role: 'parent' | 'surrogate' | 'agent' = 'surrogate'

export default function Home() {
  const router = useRouter()
  
  // For now, we'll redirect to the appropriate role dashboard
  // In a real implementation, this would be handled by the app's state management
  React.useEffect(() => {
    if (role === 'parent') {
      router.replace('/(roles)/parent')
    } else if (role === 'surrogate') {
      router.replace('/(roles)/surrogate')
    } else {
      router.replace('/(roles)/agent')
    }
  }, [])

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Text>Loading dashboard...</Text>
    </YStack>
  )
}
