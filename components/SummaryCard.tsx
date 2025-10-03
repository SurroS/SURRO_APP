import React from "react";
import { XStack, YStack, Text } from "tamagui";

type SummaryCardProps = {
  totalEarned: string;
  totalInvites: number;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ totalEarned, totalInvites }) => {
  return (
    <XStack width="100%" justifyContent="space-between" marginBottom={20}>
      <YStack flex={1} alignItems="center">
        <Text fontSize={14} color="$text">Total Earned</Text>
        <Text fontSize={22} fontWeight="700" color="$text">{totalEarned}</Text>
      </YStack>
      <YStack flex={1} alignItems="center">
        <Text fontSize={14} color="$text">Total Invites</Text>
        <Text fontSize={22} fontWeight="700" color="$primary">{totalInvites}</Text>
      </YStack>
    </XStack>
  );
};

export default SummaryCard;
