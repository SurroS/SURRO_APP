import React from "react";
import { XStack, Input, Image, Button } from "tamagui";
import { Image as RNImage } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onFilterPress: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterPress,
}) => {
  return (
    <XStack
      width={352}
      height={48}
      justifyContent="space-between"
      borderRadius={8}
      borderWidth={0.5}
      borderColor="#E6E5E5"
      backgroundColor="#FBFAFA"
      paddingHorizontal={14}
      paddingVertical={8}
      alignSelf="center"
      alignItems="center"
    >
      <XStack width={194} height={21} alignItems="center" gap={8}>
        <Input
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search by title or category"
          flex={1}
          borderWidth={0}
          backgroundColor="transparent"
          fontSize={14}
          padding={0}
        />
      </XStack>
      
      <Button
        width={36}
        height={32}
        borderRadius={4}
        paddingVertical={4}
        paddingHorizontal={6}
        backgroundColor="#FFFFFF"
        elevation={2}
        shadowColor="#E6E5E54D"
        shadowOffset={{ width: 0, height: 2 }}
        shadowRadius={20}
        onPress={onFilterPress}
      >
        <MaterialIcons
          name="filter-list"
          size={24}
          color="#000"
        />
      </Button>
    </XStack>
  );
};