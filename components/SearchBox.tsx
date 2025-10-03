import React from "react";
import { Input, XStack } from "tamagui";
import { Search } from "@tamagui/lucide-icons";

type SearchBoxProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChangeText, placeholder = "Search..." }) => (
  <XStack
    width="100%"
    height={44}
    borderRadius={10}
    backgroundColor="$grey"
    alignItems="center"
    paddingHorizontal={12}
    marginBottom={12}
    gap={8}
  >
    <Search size={18} color="$text" />
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      flex={1}
      unstyled
      borderWidth={0}
      backgroundColor="transparent"
      fontSize={15}
      color="$text"
    />
  </XStack>
);

export default SearchBox;
