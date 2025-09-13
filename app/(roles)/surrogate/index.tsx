import React from 'react';
import { Text, YStack } from 'tamagui';
import ScreenContentWrapper from '../../../components/ScreenContentWrapper';

export default function SurrogateScreen() {
  return (
    <ScreenContentWrapper>
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text
          fontSize="$6" // Use Tamagui's fontSize tokens
          fontWeight="bold"
          marginBottom="$4" // Use Tamagui's space tokens
          color="$primary" // Use Tamagui's color tokens
        >
          Surrogate Dashboard
        </Text>
        <Text>This is the Surrogate dashboard screen.</Text>
      </YStack>
    </ScreenContentWrapper>
  );
}