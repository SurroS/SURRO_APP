import React, { useState, useEffect, useRef } from "react";
import { Pressable, TextInput, View } from "react-native";
import { YStack, Button, ScrollView, XStack, Text, Popover } from "tamagui";
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
  const [allLanguages, setAllLanguages] = useState<string[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const triggerRef = useRef<View>(null);
  const [popoverWidth, setPopoverWidth] = useState(200);

  // Load languages from embedded dataset
  useEffect(() => {
    const sorted = [...languagesData].sort();
    setAllLanguages(sorted);
    setFilteredLanguages(sorted);
  }, []);

  // Filter languages
  useEffect(() => {
    if (!search) setFilteredLanguages(allLanguages);
    else
      setFilteredLanguages(
        allLanguages.filter((lang) =>
          lang.toLowerCase().includes(search.toLowerCase())
        )
      );
  }, [search, allLanguages]);

  const toggleLang = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
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
      Toast.show({
        text1: "Languages updated",
        type: "customSuccess" as ToastType,
      });
      router.back();
    } catch {
      Toast.show({
        text1: "Failed to update",
        type: "customError" as ToastType,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ScreenHeader title="Languages" onBackPress={() => router.back()} />

        <ScrollView>
        <YStack gap="$4">
          <Text fontWeight="600" fontSize={15} color={colors.text}>
            Languages Spoken
          </Text>

          <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <Popover.Trigger asChild>
              <Pressable
                ref={triggerRef}
                onLayout={(e) => setPopoverWidth(e.nativeEvent.layout.width)}
                style={{
                  borderWidth: 1,
                  borderColor: "#E6E6E6",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <Text fontSize={15} color={colors.gray}>
                  {languages.length > 0
                    ? languages.join(", ")
                    : "Select languages"}
                </Text>
              </Pressable>
            </Popover.Trigger>

            <Popover.Content
              style={{
                width: popoverWidth,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#E6E6E6",
                borderRadius: 8,
                padding: 10,
                maxHeight: 300,
              }}
            >
              <YStack gap="$2">
                {/* Search input */}
                <TextInput
                  placeholder="Search languages..."
                  value={search}
                  onChangeText={setSearch}
                  style={{
                    borderWidth: 1,
                    borderColor: "#E6E6E6",
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    height: 40,
                    marginBottom: 10,
                    color: colors.text,
                  }}
                  placeholderTextColor="#9B9B9B"
                />

                {/* Scrollable list */}
                <ScrollView style={{ maxHeight: 200 }}>
                  {filteredLanguages.map((lang) => (
                    <XStack
                      key={lang}
                      alignItems="center"
                      justifyContent="flex-start"
                      gap="$3"
                      paddingVertical={6}
                    >
                      <Pressable
                        onPress={() => toggleLang(lang)}
                        style={{
                          width: 20,
                          height: 20,
                          borderWidth: 1,
                          borderColor: "#E6E6E6",
                          borderRadius: 4,
                          backgroundColor: languages.includes(lang)
                            ? colors.primary
                            : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {languages.includes(lang) && (
                          <Text style={{ color: "white", fontSize: 14 }}>
                            ✓
                          </Text>
                        )}
                      </Pressable>
                      <Text fontSize={15} color={colors.text}>
                        {lang}
                      </Text>
                    </XStack>
                  ))}

                  {filteredLanguages.length === 0 && (
                    <Text fontSize={14} color={colors.gray} paddingVertical={6}>
                      No languages found
                    </Text>
                  )}
                </ScrollView>
              </YStack>
            </Popover.Content>
          </Popover>

          <Button backgroundColor="#0A043C" color="white" onPress={save} disabled={isSaving}>
            Save
          </Button>
        </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
