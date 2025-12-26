// components/guest/AboutSection.tsx
import colors from '@/hooks/colors';
import React from 'react';
import { YStack, Text } from 'tamagui';

interface AboutSectionProps {
  about?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  return (
    <YStack
      width="100%"
      borderTopWidth={0.5}      // subtle top border
      borderColor={colors.secondry}   // subtle separator color
      paddingBottom={20}
      gap="$2"
    >
      <Text fontSize={16} fontWeight="700" color={colors.text}>
        About
      </Text>

      <Text color={colors.text} fontSize={14} numberOfLines={3}>
        {about || "No about info available."}
      </Text>

      {about && about.length > 100 && (
        <Text
          color={colors.text}
          fontSize={16}
          style={{
            textDecorationLine: 'underline',
            alignSelf: 'flex-start',
          }}
        >
          Read more
        </Text>
      )}
    </YStack>
  );
};

export default AboutSection;
