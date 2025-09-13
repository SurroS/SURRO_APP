import React from 'react';
import { Stack } from 'expo-router';

export default function AgentLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Agent Dashboard' }} />
    </Stack>
  );
}