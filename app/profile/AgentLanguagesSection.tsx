import React, { useState, useMemo } from "react";
import { Pressable, TextInput, View, ActivityIndicator, Keyboard } from "react-native";
import { YStack, Button, ScrollView, XStack, Text } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToastType } from "toastify-react-native/utils/interfaces";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import languagesData from "@/utils/languages.json";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";

export default function AgentLanguageSection() {
  const { agentProfile, updateAgentProfile } = useAgentProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [languages, setLanguages] = useState<string[]>(() => {
    return agentProfile?.languages || [];
  });
  const sortedLanguages = [...languagesData].sort();
  const [search, setSearch] = useState("");

  const languagesSet = useMemo(() => new Set(languages), [languages]);

  const filteredLanguages = useMemo(() => {
    if (!search) return sortedLanguages;
    return sortedLanguages.filter((lang) =>
      lang.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleLang = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
    setSearch("");
  };

  const save = async () => {
    if (isSaving) return;
    if (languages.length === 0) {
      Toast.show({
        text1: "Select at least one language",
        type: "customError" as ToastType,
      });
      return;
    }
    setIsSaving(true);
    try {
      await updateAgentProfile({ languages });
      setIsSaving(false);
      Toast.show({
        text1: "Languages updated",
        type: "customSuccess" as ToastType,
      });
      setTimeout(() => router.back(), 500);
    } catch {
      setIsSaving(false);
      Toast.show({
        text1: "Failed to update",
        type: "customError" as ToastType,
      });
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ScreenHeader title="Languages" onBackPress={() => router.back()} />

        <Pressable style={{ flex: 1 }} pointerEvents="box-none" onPress={Keyboard.dismiss}>
        <YStack gap="$4" flex={1}>
          <Text fontWeight="600" fontSize={15} color={colors.text}>
            Languages Spoken
          </Text>

          <TextInput
            placeholder="Search languages..."
            value={search}
            onChangeText={setSearch}
            editable={!isSaving}
            style={{
              borderWidth: 1,
              borderColor: "#E6E6E6",
              borderRadius: 8,
              paddingHorizontal: 10,
              height: 40,
              color: colors.text,
              opacity: isSaving ? 0.5 : 1,
            }}
            placeholderTextColor="#9B9B9B"
          />

          {languages.length > 0 && (
            <XStack flexWrap="wrap" gap="$2">
              {languages.map((lang) => (
                <XStack key={lang} backgroundColor={colors.primary} borderRadius={20} paddingHorizontal={14} paddingVertical={6} alignItems="center" gap="$2">
                  <Text color="white" fontSize={15}>{lang}</Text>
                  <Pressable onPress={() => toggleLang(lang)} hitSlop={10}>
                    <Text color="white" fontSize={20} fontWeight="700">×</Text>
                  </Pressable>
                </XStack>
              ))}
            </XStack>
          )}

          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
            {filteredLanguages.map((lang) => (
              <Pressable
                key={lang}
                onPress={() => !isSaving && toggleLang(lang)}
                disabled={isSaving}
                style={{ opacity: isSaving ? 0.5 : 1 }}
              >
                <XStack
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="$3"
                  paddingVertical={6}
                >
                  <View style={{
                    width: 28,
                    height: 28,
                    borderWidth: 2,
                    borderColor: "#E6E6E6",
                    borderRadius: 6,
                    backgroundColor: languagesSet.has(lang)
                      ? colors.primary
                      : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  >
                    {languagesSet.has(lang) && (
                      <Text style={{ color: "white", fontSize: 18 }}>
                        ✓
                      </Text>
                    )}
                  </View>
                  <Text fontSize={15} color={colors.text}>
                    {lang}
                  </Text>
                </XStack>
              </Pressable>
            ))}

            {filteredLanguages.length === 0 ? (
              <Text fontSize={14} color={colors.gray} paddingVertical={6}>
                No languages found
              </Text>
            ) : null}
          </ScrollView>

          <Button backgroundColor="#0A043C" color="white" onPress={save} disabled={isSaving} opacity={isSaving ? 0.7 : 1} marginTop={30}>
            {isSaving ? <XStack gap="$2" alignItems="center"><ActivityIndicator size="small" color="white" /><Text color="white">Saving...</Text></XStack> : "Save"}
          </Button>
        </YStack>
        </Pressable>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
