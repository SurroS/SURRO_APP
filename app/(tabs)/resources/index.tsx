import React, { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text } from "tamagui";
import { ScreenHeader } from "../../../components/navigation/ScreenHeader";
import { ResourceCard } from "../../../components/resources/ResourceCard";
import { SearchBar } from "../../../components/resources/SearchBar";
import { TabsBar } from "../../../components/resources/TabsBar";
import { dummyResources, Resource } from "../../../constants/ResourcesData";
import { router } from "expo-router";

export default function ResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("General");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredResources: Resource[] = dummyResources.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleFilterPress = () => {
    // Implement filter functionality
    console.log("Filter button pressed");
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FBFAFA" }}>
      <YStack flex={1} backgroundColor="#FBFAFA">
        <ScreenHeader
          title="Resource Center"
          onBackPress={handleBackPress}
        />

        <YStack padding="$4" gap="$4" flex={1} mt={-20}> {/* Adjusting for ScreenHeader's marginBottom */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterPress={handleFilterPress}
          />

          <TabsBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <ScrollView showsVerticalScrollIndicator={false} flex={1}>
            <YStack gap="$4" marginTop="$2">
              {filteredResources.map((res) => (
                <ResourceCard
                  key={res.id}
                  title={res.title}
                  author={res.author}
                  category={res.category}
                  image={res.image}
                  onPress={() => {
                    console.log("View resource:", res.title);
                  }}
                />
              ))}
            </YStack>
          </ScrollView>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
