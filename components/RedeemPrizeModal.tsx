import React, { useState, useEffect } from "react";
import {
  YStack,
  XStack,
  Text,
  Button,
  Dialog,
  ScrollView,
  View,
} from "tamagui";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";

import ReferralCard, { Referral } from "./ReferralCard";
import SearchBox from "./SearchBox";
import TabSwitcher from "./TabSwitcher";
import SummaryCard from "./SummaryCard";

interface Props {
  visible: boolean;
  onClose: () => void;
  totalEarned?: string;
  totalInvites?: number;
  referrals?: Referral[];
}

const FOOTER_HEIGHT = 72;

// --- Dummy data for testing
const dummyReferrals: Referral[] = [
  { id: "1", name: "Alice", email: "alice@example.com", status: "redeem" },
  { id: "2", name: "Bob", email: "bob@example.com", status: "pending" },
  { id: "3", name: "Charlie", email: "charlie@example.com", status: "redeem" },
];

const RedeemPrizeModal: React.FC<Props> = ({
  visible,
  onClose,
  totalEarned = "$0",
  totalInvites = 0,
  referrals = dummyReferrals,
}) => {
  const [activeTab, setActiveTab] = useState<"redeem" | "pending">("redeem");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!visible) {
      setSearchQuery("");
      setActiveTab("redeem");
    }
  }, [visible]);

  const filteredList = referrals.filter(
    (r) =>
      r.status === activeTab &&
      r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={visible} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay key="overlay" backgroundColor="$gray2" opacity={0.5} />

        {/* Modal Content */}
        <Dialog.Content
          key="content"
          width="100%"
          maxHeight={Dimensions.get("window").height * 0.9}
          backgroundColor="$background"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          position="absolute"
          bottom={0}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <YStack flex={1}>
                {/* Handle Bar */}
                <XStack justifyContent="center" paddingVertical={8}>
                  <View
                    style={{
                      width: 40,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: "#ccc",
                    }}
                  />
                </XStack>

                {/* Header */}
                <YStack gap={12} paddingHorizontal={20} paddingTop={8}>
                  <SummaryCard totalEarned={totalEarned} totalInvites={totalInvites} />

                  <TabSwitcher
                    tabs={[
                      { key: "redeem", label: "Redeem" },
                      { key: "pending", label: "Pending" },
                    ]}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                  />

                  <SearchBox
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search by email"
                  />
                </YStack>

                {/* Scrollable list */}
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 12,
                    paddingBottom: FOOTER_HEIGHT,
                  }}
                  showsVerticalScrollIndicator
                >
                  <YStack gap={16}>
                    {filteredList.length === 0 ? (
                      <Text
                        fontSize={14}
                        color="$text"
                        textAlign="center"
                        marginTop={40}
                      >
                        No referrals yet
                      </Text>
                    ) : (
                      filteredList.map((ref) => (
                        <ReferralCard key={ref.id} referral={ref} />
                      ))
                    )}
                  </YStack>
                </ScrollView>

                {/* Sticky Done button */}
                <YStack
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  height={FOOTER_HEIGHT}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="$background"
                  padding={12}
                >
                  <Button
                    onPress={onClose}
                    width="100%"
                    height={48}
                    borderRadius={12}
                    backgroundColor="$primary"
                  >
                    <Text fontSize={16} color="white" fontWeight="700">
                      Done
                    </Text>
                  </Button>
                </YStack>
              </YStack>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default RedeemPrizeModal;