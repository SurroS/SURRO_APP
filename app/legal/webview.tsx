import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, router } from "expo-router";
import { ScreenHeader } from "@/components/navigation/ScreenHeader";

export default function LegalWebView() {
  const { url, title } = useLocalSearchParams();

  const cleanUrl = typeof url === "string" ? url : "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <ScreenHeader title={String(title || "")} onBackPress={() => router.back()} />
      <WebView
        source={{ uri: cleanUrl }}
        startInLoadingState
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}