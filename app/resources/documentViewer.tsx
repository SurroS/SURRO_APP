import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { ScreenHeader } from "@/components/auth";
import { Text, View, YStack } from "tamagui";

export default function PdfViewer() {
  const { url, title } = useLocalSearchParams();

  // Ensure it's a Google Drive "view" link or direct PDF URL
  const cleanUrl =
    typeof url === "string"
      ? url.replace("/view", "/preview") // Better embedding for Drive
      : "";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "center",
        paddingTop: 20,
      }}
    >
      <YStack marginLeft={20}>
        <ScreenHeader title={"Article"} onBackPress={() => router.back()} />
        <Text color="#1E1E1E" fontWeight={"400"}>
          {String(title)}
        </Text>
      </YStack>
      <WebView
        source={{ uri: cleanUrl }}
        startInLoadingState
        style={{ flex: 1, marginTop: 5 }}
      />
    </SafeAreaView>
  );
}
