import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Mail, Phone } from '@tamagui/lucide-icons';
import colors from '@/hooks/colors';

const ContactSection = () => {
  return (
    <YStack
      width="100%"
      borderBottomWidth={1}
      borderColor="$secondary"
      paddingBottom={20}
      gap="$3"
    >
      <Text fontSize={16} fontWeight="700" color={colors.text}>
        Contact
      </Text>

      {/* Contact Info (Phone + Mail on the same row) */}
      <XStack alignItems="center" gap={16}>
        <Mail size={16} color={colors.text} />
        <Text color={colors.text}>michelle@example.com</Text>
        <Phone size={16} color={colors.text} />
        <Text color={colors.text}>+234 903 5567 890</Text>
      </XStack>
    </YStack>
  );
};

export default ContactSection;
