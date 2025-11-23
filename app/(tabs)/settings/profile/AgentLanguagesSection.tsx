import React, { useState, useEffect, useRef } from "react";
import { Pressable, TextInput, View } from "react-native";
import { YStack, Button, ScrollView, XStack, Text, Popover } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToastType } from "toastify-react-native/utils/interfaces";

export default function AgentLanguageSection() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [allLanguages, setAllLanguages] = useState<string[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");

  const triggerRef = useRef<View>(null);
  const [popoverWidth, setPopoverWidth] = useState(200);

  // Fetch languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data: any[] = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid API response");

        const langsSet = new Set<string>();
        data.forEach((country) => {
          if (country?.languages && typeof country.languages === "object") {
            Object.values(country.languages).forEach((lang) => {
              if (typeof lang === "string") langsSet.add(lang);
            });
          }
        });

        const langsArray = Array.from(langsSet).sort();
        setAllLanguages(langsArray);
        setFilteredLanguages(langsArray);
      } catch (err) {
        console.error("Error fetching languages:", err);
        const fallback = [
          "English",
          "French",
          "Spanish",
          "Arabic",
          "Yoruba",
          "Hausa",
          "Igbo",
        ];
        setAllLanguages(fallback);
        setFilteredLanguages(fallback);
      }
    };

    fetchLanguages();
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

  const save = () => {
    if (languages.length === 0) {
      Toast.show({
        text1: "Select at least one language",
        type: "customError" as ToastType,
      });
      return;
    }
    Toast.show({
      text1: "Languages updated",
      type: "customSuccess" as ToastType,
    });
    router.back();
  };

  return (
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

          <Button backgroundColor="#0A043C" color="white" onPress={save}>
            Save
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
