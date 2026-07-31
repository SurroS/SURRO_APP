import React, { useState } from "react";
import { XStack, YStack, Text, Button, Dialog, Avatar } from "tamagui";
import colors from "@/hooks/colors";

export interface Referral {
  id: string; // unique per referral
  name: string;
  email: string;
  status: "redeem" | "pending";
}

interface Props {
  referral: Referral;
}

const ReferralCard: React.FC<Props> = ({ referral }) => {
  const [open, setOpen] = useState(false);

  const handleRedeem = () => {
    setOpen(false);
  };

  return (
    <XStack
      backgroundColor={colors.white}
      borderRadius="$4"
      padding="$3"
      justifyContent="space-between"
      alignItems="center"
      key={referral.id}
    >
      {/* Left: Avatar + Email */}
      <XStack alignItems="center" gap={12}>
        <Avatar circular size="$3">
          <Avatar.Fallback backgroundColor={colors.primary}>
            <Text fontSize={20} fontWeight="600">
              {referral.name[0]?.toUpperCase()}
            </Text>
          </Avatar.Fallback>
        </Avatar>
        <Text fontSize={14} color="$text">
          {referral.email}
        </Text>
      </XStack>

      {/* Right: Redeem button or Pending */}
      {referral.status === "redeem" ? (
        <Dialog open={open} onOpenChange={setOpen}>
          {/* Button triggers modal */}
          <Dialog.Trigger asChild>
            <Button
              size="$3"
              borderRadius={8}
              backgroundColor={colors.primary}
              key={`trigger-${referral.id}`}
            >
              <Text color="white">Redeem</Text>
            </Button>
          </Dialog.Trigger>

          {/* Portal for modal content */}
          <Dialog.Portal>
            <Dialog.Overlay
              key={`overlay-${referral.id}`}
              backgroundColor={colors.primary}
              opacity={0.5}
            />
            <Dialog.Content
              key={`content-${referral.id}`}
              width={300}
              padding={16}
              borderRadius={12}
              backgroundColor={colors.white}
              // No absolute positioning → stays under trigger button
            >
              <YStack gap={12} alignItems="center">
                <Text fontSize={16} fontWeight="600" color="$text">
                  Confirm Redeem
                </Text>
                <Text fontSize={14} color="$text" textAlign="center">
                  Are you sure you want to redeem this reward?
                </Text>

                <XStack width="100%" justifyContent="space-between" marginTop={8}>
                  <Button
                    size="$3"
                    borderRadius={8}
                    backgroundColor="$gray5"
                    onPress={() => setOpen(false)}
                    key={`cancel-${referral.id}`}
                  >
                    <Text color="white">Cancel</Text>
                  </Button>
                  <Button
                    size="$3"
                    borderRadius={8}
                    backgroundColor={colors.white}
                    onPress={handleRedeem}
                    key={`confirm-${referral.id}`}
                  >
                    <Text color="white">Confirm</Text>
                  </Button>
                </XStack>
              </YStack>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      ) : (
        <Text fontSize={14} color="$danger">
          Pending
        </Text>
      )}
    </XStack>
  );
};

export default ReferralCard;
