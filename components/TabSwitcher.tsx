import React from "react";
import { XStack, Button, Text } from "tamagui";

export type TabOption<T extends string> = { key: T; label: string };

type TabSwitcherProps<T extends string> = {
  tabs: TabOption<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  activeColor?: string;
  inactiveColor?: string;
  underlineColor?: string;
};

const TabSwitcher = <T extends string>({
  tabs,
  activeTab,
  onChange,
  activeColor = "$primary",
  inactiveColor = "$text",
  underlineColor = "$primary",
}: TabSwitcherProps<T>) => (
  <XStack width="100%" marginBottom={12}>
    {tabs.map((tab) => {
      const isActive = activeTab === tab.key;
      return (
        <Button
          key={tab.key}
          onPress={() => onChange(tab.key)}
          flex={1}
          chromeless
          borderBottomWidth={isActive ? 2 : 0}
          borderColor={isActive ? underlineColor : "transparent"}
          borderRadius={0}
        >
          <Text fontSize={14} fontWeight="600" color={isActive ? activeColor : inactiveColor}>
            {tab.label}
          </Text>
        </Button>
      );
    })}
  </XStack>
);

export default TabSwitcher;
