import React from 'react';
import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Parent Dashboard' }} />
    </Stack>
  );
}