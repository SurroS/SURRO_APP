import React, { useState } from "react";
import { ScrollView, TextInput, Pressable } from "react-native";
import { YStack, XStack, Text, View, Button } from "tamagui";
import { Search, Filter, Bookmark } from "@tamagui/lucide-icons";
import { ScreenHeader } from "@/components/auth";
import ResourceCard from "@/components/resources/ResourceCard";
import { router } from "expo-router";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import HelpServiceButton from "@/components/HelpServiceButton";

export default function ResourceCentre() {
  const [tab, setTab] = useState("general");
  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const resources = [
    {
      title: "How to protect your mental health as a surrogate",
      author: "Lindy John",
      category: "Mental wellness",
      categoryColor: "#F8E8FF",
      thumbnail: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
      type: "article",
    },
    {
      title: "Getting the best representative as a surrogate",
      author: "News Network",
      category: "Legal",
      categoryColor: "#E6E9FF",
      thumbnail: "https://images.unsplash.com/photo-1556742400-b5b7c5121f9a",
      type: "article",
    },
    {
      title: "My experience as a surrogate",
      author: "Jennie Ma",
      category: "Health tips",
      categoryColor: "#D6F9F0",
      type: "video",
      videoId: "dQw4w9WgXcQ",
    },
    {
      title: "5 things to note when meeting intending parents",
      author: "Lindy John",
      category: "Guidelines",
      categoryColor: "#E8F4FF",
      type: "pdf",
      sourceUrl: "https://drive.google.com/file/d/1jKEhRmNlbjfukYIJJVpfqdPzutDZKS2O/view?usp=sharing",
    },
  ] as const;

  // Search + filter logic
  const filteredResources = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesType = !selectedType || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const displayedResources =
    tab === "bookmarks"
      ? filteredResources.filter((item) => bookmarks.includes(item.title))
      : filteredResources;

  const handleBookmark = (item: any) => {
    setBookmarks((prev) =>
      prev.includes(item.title)
        ? prev.filter((t) => t !== item.title)
        : [...prev, item.title]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingTop: 20 }}>
      <View marginLeft={28}>
        <ScreenHeader
          title="Resource centre"
          onBackPress={() => router.back()}
        />
      </View>

      {/* Search bar */}
      <XStack
        alignItems="center"
        borderWidth={1}
        borderColor="#E5E5E5"
        borderRadius="$6"
        marginHorizontal="$4"
        paddingHorizontal="$3"
        paddingVertical="$2"
        backgroundColor="#FAFAFA"
        marginTop="$3"
        justifyContent="space-between"
      >
        <XStack alignItems="center" flex={1} gap="$2">
          <Search size={18} color="#888" />
          <TextInput
            placeholder={
              selectedCategory ? `${selectedCategory}` : "Search by title or category"
            }
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: "#000" }}
          />
        </XStack>
        <Pressable onPress={() => setFilterVisible(true)}>
          <Filter size={20} color="#000" />
        </Pressable>
      </XStack>

      {/* Tabs */}
      <XStack marginHorizontal="$4" marginTop="$4" gap="$6">
        <Text
          color={tab === "general" ? "#0A043C" : "#888"}
          fontWeight={tab === "general" ? "700" : "500"}
          onPress={() => setTab("general")}
        >
          General
        </Text>
        <Text
          color={tab === "bookmarks" ? "#0A043C" : "#888"}
          fontWeight={tab === "bookmarks" ? "700" : "500"}
          onPress={() => setTab("bookmarks")}
        >
          Bookmarks
        </Text>
      </XStack>

      {/* Resources */}
      <ScrollView
        style={{ flex: 1, marginTop: 10 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {displayedResources.map((item, index) => (
          <ResourceCard
            key={index}
            {...item}
            onBookmark={() => handleBookmark(item)}
            bookmarked={bookmarks.includes(item.title)}
          />
        ))}

        {displayedResources.length === 0 && (
          <Text textAlign="center" color="#888" marginTop="$10">
            No resources found.
          </Text>
        )}
        
      </ScrollView>
    {/* Floating Customer Support Button */}
      <HelpServiceButton />
      {/* Filter modal */}
      {filterVisible && (
        <>
          <Pressable
            onPress={() => setFilterVisible(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          />

          <View
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            backgroundColor="#FFF"
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            padding={20}
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom={10}>
              <Text fontWeight="700" fontSize={16}>
                Filter by
              </Text>
              <Pressable onPress={() => setFilterVisible(false)}>
                <Text fontSize={20} color="#888">
                  ✕
                </Text>
              </Pressable>
            </XStack>

            <Text fontSize={14} marginBottom={6}>
              Category
            </Text>
            {["Mental wellness", "Legal", "Guidelines", "Health tips"].map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={{ paddingVertical: 6 }}
              >
                <Text color={selectedCategory === cat ? "#0A043C" : "#555"} fontWeight={selectedCategory === cat ? "700" : "400"}>
                  {cat}
                </Text>
              </Pressable>
            ))}

            <Text fontSize={14} marginTop={10} marginBottom={6}>
              Type
            </Text>
            {["article", "video", "pdf"].map((t) => (
              <Pressable
                key={t}
                onPress={() => setSelectedType(t)}
                style={{ paddingVertical: 6 }}
              >
                <Text color={selectedType === t ? "#0A043C" : "#555"} fontWeight={selectedType === t ? "700" : "400"}>
                  {t}
                </Text>
              </Pressable>
            ))}

            <XStack marginTop={15} justifyContent="space-between" gap="$3">
              <Button
                flex={1}
                backgroundColor="#E5E5E5"
                color="#000"
                onPress={() => {
                  setSelectedCategory(null);
                  setSelectedType(null);
                }}
              >
                Clear
              </Button>
              <Button
                flex={1}
                backgroundColor="#0A043C"
                color="#FFF"
                onPress={() => setFilterVisible(false)}
              >
                Apply
              </Button>
            </XStack>
          </View>
        </>

      )}
    </SafeAreaView>
  );
}
