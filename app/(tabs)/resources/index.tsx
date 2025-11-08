import React, { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text } from "tamagui";
import { ResourceCard } from "../../../components/resources/ResourceCard";
import { CategoryFilter } from "../../../components/resources/CategoryFilter";
import { categories, dummyResources, Resource } from "../../../constants/ResourcesData";

export default function ResourcesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredResources: Resource[] =
    selectedCategory === "All"
      ? dummyResources
      : dummyResources.filter((res) => res.type === selectedCategory);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
        <Text fontSize="$6" fontWeight="700">
          Resources
        </Text>

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack gap="$4" marginTop="$2">
            {filteredResources.map((res) => (
              <ResourceCard
                key={res.id}
                title={res.title}
                description={res.description}
                type={res.type}
                thumbnail={res.thumbnail}
                onPress={() => {
                  console.log("View resource:", res.title);
                }}
              />
            ))}
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
}
