import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { YStack, Text, XStack, Input } from 'tamagui';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  prefix?: string;
  multiline?: boolean;
  numberOfLines?: number;
};

export default function FieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  prefix,
  multiline = false,
  numberOfLines = 1,
}: Props) {
  return (
    <YStack gap="$2">
      <Text fontSize={13} fontWeight="600">
        {label}
      </Text>

      {multiline ? (
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline
          numberOfLines={numberOfLines}
          style={{
            backgroundColor: '#F8F8FA',
            borderColor: '#E6E6E6',
            borderWidth: 1,
            borderRadius: 8,
            minHeight: 88,
            padding: 12,
            textAlignVertical: 'top',
            color: '#0E0E55',
          }}
        />
      ) : (
        <XStack
          borderRadius={8}
          height={44}
          backgroundColor="#F8F8FA"
          borderWidth={1}
          borderColor="#E6E6E6"
          alignItems="center"
          paddingHorizontal={12}
          gap={8}
        >
          {prefix && <Text color="#0E0E55">{prefix}</Text>}
          <Input
            flex={1}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            borderWidth={0} // remove border inside Input because XStack handles it
            backgroundColor="transparent"
          />
        </XStack>
      )}
    </YStack>
  );
}
