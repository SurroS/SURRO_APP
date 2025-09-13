import React from 'react'
import { Stack } from 'expo-router'
import colors from '../../../hooks/colors'

export default function SurrogateLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.secondary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown:false, title: 'Surrogate Dashboard' }} /> 
    </Stack>
  )
}
