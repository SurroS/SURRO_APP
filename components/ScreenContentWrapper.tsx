import colors from "@/hooks/colors";
import React, { ReactNode } from "react";
import { SafeAreaView } from "react-native";
import { ScrollView, YStack } from "tamagui";

interface Props {
  children: ReactNode;
}

export default function ScreenContentWrapper({ children }: Props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false} // optional: cleaner UI
      >
        <YStack
          flex={1}
          padding="$4"            // ✅ valid Tamagui token (not inside RN style)
          backgroundColor={colors.white} 
          space="$4"
        >
          {children}
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
