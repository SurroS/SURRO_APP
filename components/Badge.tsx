import colors from "@/hooks/colors";
import React from "react";
import { YStack, Text } from "tamagui";

export type BadgeProps = {
  label: string;
  variant: "Guide" | "Video" | "Template" | "FAQ";
};

const badgeColors: Record<BadgeProps["variant"], string> = {
  Guide: "$primary",
  Video: "$secondary",
  Template: "$success",
  FAQ: "$warning",
};

export const Badge: React.FC<BadgeProps> = ({ label, variant }) => {
  return (
    <YStack
      paddingHorizontal="$2"
      paddingVertical="$1"
      borderRadius="$2"
      backgroundColor={badgeColors[variant]}
    >
      <Text color={colors.background} fontWeight="$semibold" fontSize={12}>
        {label}
      </Text>
    </YStack>
  );
};

export default Badge;
