import React from "react";
import { XStack, Text } from "tamagui";

interface TabsBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabsBar: React.FC<TabsBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <XStack
      width={353}
      height={52}
      justifyContent="space-between"
      paddingHorizontal={8}
      paddingVertical={8}
      alignSelf="center"
    >
      <Text
        onPress={() => onTabChange("General")}
        fontSize={16}
        fontWeight={activeTab === "General" ? "700" : "400"}
        color={activeTab === "General" ? "#080833" : "#737373"}
        borderBottomWidth={activeTab === "General" ? 1 : 0}
        borderBottomColor="#080833"
        paddingBottom={4}
      >
        General
      </Text>
      <Text
        onPress={() => onTabChange("Bookmarks")}
        fontSize={16}
        fontWeight={activeTab === "Bookmarks" ? "700" : "400"}
        color={activeTab === "Bookmarks" ? "#080833" : "#737373"}
        borderBottomWidth={activeTab === "Bookmarks" ? 1 : 0}
        borderBottomColor="#080833"
        paddingBottom={4}
      >
        Bookmarks
      </Text>
    </XStack>
  );
};