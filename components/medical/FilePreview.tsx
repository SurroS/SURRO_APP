import React from "react";
import { XStack, YStack, Text, View } from "tamagui";
import { X } from "@tamagui/lucide-icons";

type FilePreviewProps = {
  file: any;
  progress?: number;
  onRemove: () => void;
};

export const FilePreviewCard = ({
  file,
  progress = 50,
  onRemove,
}: FilePreviewProps) => {
  return (
    <YStack width="100%" gap="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" gap="$2">
          <Text fontWeight="700" color="#E63946">
            📄
          </Text>
          <Text color="#000" fontWeight="600">
            {file.name || "Report.pdf"}
          </Text>
          <Text color="#999" fontSize={12}>
            {file.size ? `${(file.size / 1024).toFixed(0)}kb` : "90kb"}
          </Text>
        </XStack>

        <X
          size={18}
          color="black"
          onPress={onRemove}
          style={{ marginLeft: 8 }}
        />
      </XStack>
      {progress < 100 && (
        <View
          height={6}
          backgroundColor="#EEE"
          borderRadius="$4"
          overflow="hidden"
        >
          <View
            height="100%"
            width={`${Math.min(progress, 100)}%`}
            backgroundColor="#007BFF"
            transition="width 0.3s ease"
          />
        </View>
      )}
    </YStack>
  );
};
