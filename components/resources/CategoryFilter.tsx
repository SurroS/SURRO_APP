// components/CategoryFilter.tsx
import React from "react";
import { XStack, Text, useTheme } from "tamagui";
import { ScrollView } from "react-native";

type CategoryFilterProps = {
  categories: readonly string[];
  selected: string;
  onSelect: (category: string) => void;
};

// Constants for spacing and dimensions
const GAP = 12;
const PADDING_VERTICAL = 12;
const PADDING_HORIZONTAL = 12;
const BORDER_RADIUS = 20;
const TEXT_PADDING_VERTICAL = 6;

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onSelect,
}) => {
  const theme = useTheme(); // Access current Tamagui theme

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <XStack gap={GAP} paddingVertical={PADDING_VERTICAL}>
        {categories.map((cat) => {
          const isSelected = selected === cat;

          return (
            <XStack
              key={cat}
              onPress={() => onSelect(cat)}
              paddingHorizontal={PADDING_HORIZONTAL}
              paddingVertical={TEXT_PADDING_VERTICAL}
              borderRadius={BORDER_RADIUS}
              backgroundColor={isSelected ? theme.primary : theme.backgroundAlt || "#f0f0f0"}
              cursor="pointer"
              hoverStyle={{ opacity: 0.8 }}
            >
              <Text
                color={isSelected ? theme.colorInverted || "#fff" : theme.color}
                fontWeight="600"
              >
                {cat}
              </Text>
            </XStack>
          );
        })}
      </XStack>
    </ScrollView>
  );
};
