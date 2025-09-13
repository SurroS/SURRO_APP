import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'tamagui';

const Container = styled(View, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
});

const Title = styled(Text, {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#0E0E55',
});

export default function AgentScreen() {
  return (
    <Container>
      <Title>Agent Dashboard</Title>
      <Text>This is the Agent dashboard screen.</Text>
    </Container>
  );
}