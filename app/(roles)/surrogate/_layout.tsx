import React from 'react';
import { Stack } from 'expo-router';

export default function SurrogateLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Surrogate Dashboard' }} />
    </Stack>
  );
}