// app/(tabs)/referral/index.tsx
import React, { useState } from "react";
import { 
  LayoutChangeEvent, 
  useWindowDimensions 
} from "react-native";
import { 
  Image, 
  Paragraph, 
  Separator, 
  Text, 
  XStack, 
  YStack 
} from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";
import Button from "@/components/Button";
import RedeemPrizeModal from "@/components/RedeemPrizeModal";

// --- Types for HowItWorks ---
type HowItWorksStepProps = {
  number: string;
  title: string;
  children: React.ReactNode;
  marginTop?: number;
  marginBottom?: number;
};

// --- Reusable Component for "How it works" steps ---
const HowItWorksStep = ({
  number,
  title,
  children,
  marginTop = 0,
  marginBottom = 0,
}: HowItWorksStepProps) => (
  <XStack
    gap="$4"
    alignItems="flex-start"
    marginTop={marginTop}
    marginBottom={marginBottom}
  >
    <YStack
      width={20}
      height={20}
      borderRadius="$true"
      backgroundColor="$primary"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontWeight="bold" color="$background">
        {number}
      </Text>
    </YStack>
    <YStack flex={1} gap="$1">
      <Text fontSize={17} fontWeight="bold" color="$text">
        {title}
      </Text>
      <Paragraph color="$text">{children}</Paragraph>
    </YStack>
  </XStack>
);

// --- Dynamic Header ---
const Header = ({
  title,
  marginBottom = 0,
}: {
  title: string;
  marginBottom?: number;
}) => {
  const handleGoBack = () => console.log("Navigate back");

  return (
    <XStack
      alignItems="center"
      justifyContent="center"
      position="relative"
      height={40}
      marginBottom={marginBottom}
    >
      <ChevronLeft
        size={24}
        color="$text"
        onPress={handleGoBack}
        style={{ position: "absolute", left: 0 }}
      />
      <Text fontSize={18} fontWeight="bold" color="$text">
        {title}
      </Text>
    </XStack>
  );
};

// --- Dynamic Card Wrappers ---
const InviteCard = ({
  children,
  marginTop = 0,
  marginBottom = 0,
}: {
  children: React.ReactNode;
  marginTop?: number;
  marginBottom?: number;
}) => (
  <XStack
    backgroundColor="$background"
    borderRadius="$5"
    padding="$5"
    justifyContent="space-between"
    alignItems="center"
    gap="$4"
    marginTop={marginTop}
    marginBottom={marginBottom}
  >
    {children}
  </XStack>
);

const LinkCard = ({
  children,
  marginTop = 0,
  marginBottom = 0,
}: {
  children: React.ReactNode;
  marginTop?: number;
  marginBottom?: number;
}) => (
  <XStack
    borderWidth={1}
    borderColor="$border"
    borderRadius="$2"
    backgroundColor="$background"
    paddingVertical="$1"
    paddingHorizontal="$3.5"
    justifyContent="space-between"
    alignItems="center"
    marginTop={marginTop}
    marginBottom={marginBottom}
  >
    {children}
  </XStack>
);

const ShareCard = ({
  children,
  marginTop = 0,
  marginBottom = 0,
}: {
  children: React.ReactNode;
  marginTop?: number;
  marginBottom?: number;
}) => (
  <YStack gap="$2" marginTop={marginTop} marginBottom={marginBottom}>
    {children}
  </YStack>
);

// --- Main Referral Screen ---
export default function ReferralScreen() {
  const referralLink = "https://surro.com/invite/ih/michae...";
  const [open, setOpen] = useState(false); // now used for Dialog
  const [buttonY, setButtonY] = useState(0); 
  const { height: screenHeight } = useWindowDimensions();

  const handleCopyLink = () => console.log("Referral link copied!");
  const handleRedeemPrize = () => setOpen(true);

  const handleButtonLayout = (e: LayoutChangeEvent) => {
    const { y } = e.nativeEvent.layout;
    setButtonY(y);
  };

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
      {/* Header */}
      <Header title="Refer a friend" marginBottom={10} />

      {/* Invite + Gift Card */}
      <InviteCard marginTop={-20}>
        <Image
          source={require("@/assets/images/referral-giftIcon.png")}
          style={{ width: 180, height: 180 }}
        />
        <YStack flex={1} gap="$2" alignItems="flex-end">
          <Text fontSize={24} fontWeight="bold" textAlign="right" color="$text">
            INVITE AND{"\n"}GET $5
          </Text>
          {/* Capture Y position */}
          <YStack onLayout={handleButtonLayout}>
            <Button
              title="Redeem prize"
              onPress={handleRedeemPrize}
              variant="primary"
            />
          </YStack>
        </YStack>
      </InviteCard>

      {/* Invite Link Card */}
      <LinkCard marginTop={-30}>
        <Text flex={1} numberOfLines={1} color="$text">
          {referralLink}
        </Text>
        <Button title="Copy" variant="primary" onPress={handleCopyLink} />
      </LinkCard>

      {/* Share Card */}
      <ShareCard marginTop={-9}>
        <Text fontSize={16} fontWeight="bold" color="$text">
          Share to
        </Text>
        <XStack justifyContent="space-around" alignItems="center">
          <YStack alignItems="center" gap="$1">
            <Image
              source={require("@/assets/images/whatsapp-icon.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text color="$text" fontSize={14}>
              WhatsApp
            </Text>
          </YStack>
          <YStack alignItems="center" gap="$1">
            <Image
              source={require("@/assets/images/x-icon.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text color="$text" fontSize={14}>
              X
            </Text>
          </YStack>
          <YStack alignItems="center" gap="$1">
            <Image
              source={require("@/assets/images/fb-icon.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text color="$text" fontSize={14}>
              Facebook
            </Text>
          </YStack>
          <YStack alignItems="center" gap="$1">
            <Image
              source={require("@/assets/images/openemail.png")}
              style={{ width: 40, height: 40 }}
            />
            <Text color="$text" fontSize={14}>
              Mail
            </Text>
          </YStack>
        </XStack>
      </ShareCard>

      <Separator />

      {/* How It Works */}
      <YStack gap="$3">
        <Text fontSize={20} fontWeight="bold" color="$text">
          How it works
        </Text>
        <HowItWorksStep number="1" title="Invite a Friend">
          Share your referral link above with a friend.
        </HowItWorksStep>
        <HowItWorksStep number="2" title="They Join">
          Your friend registers and verifies their account.
        </HowItWorksStep>
        <HowItWorksStep number="3" title="They Take Action">
          <YStack gap="$2">
            <Paragraph color="$text">
              To activate your reward, your friend must do one of the following:
            </Paragraph>
            <YStack marginLeft={20} gap="$1">
              <Text color="$text">• Subscribe to a package, OR</Text>
              <Text color="$text">• Boost their profile, OR</Text>
              <Text color="$text">• Make a payment on the platform.</Text>
            </YStack>
          </YStack>
        </HowItWorksStep>
        <HowItWorksStep number="4" title="You Earn">
          Once all steps are completed, your reward is unlocked!
        </HowItWorksStep>
      </YStack>

      {/* Prize Redeem Modal (Dialog version) */}
      <RedeemPrizeModal
        visible={open}
        onClose={() => setOpen(false)}
        totalEarned="$0"   // placeholder
        totalInvites={0}   // placeholder
        referrals={[]}     // placeholder
      />
    </YStack>
  );
}
