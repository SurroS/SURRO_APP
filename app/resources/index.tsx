import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, Pressable, Modal, TextInput, ActivityIndicator } from "react-native";
import { YStack, XStack, Text, View, Button } from "tamagui";
import { Search, Filter } from "@tamagui/lucide-icons";
import { ScreenHeader } from "@/components/auth";
import ResourceCard from "@/components/resources/ResourceCard";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import HelpServiceButton from "@/components/HelpServiceButton";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import colors from "@/hooks/colors";
import { getResources, toggleBookmark as toggleBookmarkApi } from "@/services/resourceApi";
import type { Resource } from "@/types/resources";

const TYPES = ["article", "video", "pdf"];

export default function ResourceCentre() {
  const [tab, setTab] = useState("general");
  const [search, setSearch] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarking, setBookmarking] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const json = await getResources();
        if (json.success) {
          setResources(json.data);
          setCategories(json.categories);
          setSelectedIds(new Set(json.data.filter((r) => r.isBookmarked).map((r) => r.id)));
        }
      } catch {
        // resources stay empty
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleBookmark = useCallback(async (id: string) => {
    setBookmarking(id);
    try {
      const res = await toggleBookmarkApi(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (res.bookmarked) next.add(id);
        else next.delete(id);
        return next;
      });
    } catch {
      // revert silently
    } finally {
      setBookmarking(null);
    }
  }, []);

  const filteredResources = resources.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesType = !selectedType || item.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const displayedResources =
    tab === "bookmarks"
      ? filteredResources.filter((item) => selectedIds.has(item.id))
      : filteredResources;

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <YStack paddingHorizontal={20} paddingTop={12} gap={16}>
          <ScreenHeader title="Resource centre" onBackPress={() => router.back()} />

          <XStack
            alignItems="center"
            borderWidth={1}
            borderColor="#E5E5E5"
            borderRadius={10}
            paddingHorizontal={12}
            height={44}
            backgroundColor="#FAFAFA"
            gap={8}
          >
            <Search size={18} color="#888" />
            <TextInput
              placeholder="Search by title or category"
              placeholderTextColor="#888"
              value={search}
              onChangeText={setSearch}
              style={{ flex: 1, color: "#000", fontSize: 14, padding: 0 }}
            />
            <Pressable onPress={() => setFilterVisible(true)} hitSlop={8}>
              <Filter size={20} color="#000" />
            </Pressable>
          </XStack>

          <XStack gap={24}>
            <Text
              color={tab === "general" ? colors.primary : "#888"}
              fontWeight={tab === "general" ? "700" : "500"}
              fontSize={15}
              onPress={() => setTab("general")}
              borderBottomWidth={tab === "general" ? 2 : 0}
              borderBottomColor={colors.primary}
              paddingBottom={4}
            >
              General
            </Text>
            <Text
              color={tab === "bookmarks" ? colors.primary : "#888"}
              fontWeight={tab === "bookmarks" ? "700" : "500"}
              fontSize={15}
              onPress={() => setTab("bookmarks")}
              borderBottomWidth={tab === "bookmarks" ? 2 : 0}
              borderBottomColor={colors.primary}
              paddingBottom={4}
            >
              Bookmarks
            </Text>
          </XStack>
        </YStack>

        {loading ? (
          <YStack flex={1} alignItems="center" justifyContent="center">
            <ActivityIndicator size="large" color={colors.primary} />
          </YStack>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            {displayedResources.map((item) => (
              <ResourceCard
                key={item.id}
                {...item}
                onBookmark={() => toggleBookmark(item.id)}
                bookmarked={selectedIds.has(item.id)}
              />
            ))}

            {displayedResources.length === 0 && (
              <YStack alignItems="center" marginTop={60} gap={8}>
                <Text fontSize={16} color="#888" fontWeight="600">
                  {tab === "bookmarks" ? "No bookmarks yet" : "No resources found"}
                </Text>
                <Text fontSize={13} color="#AAA">
                  {tab === "bookmarks"
                    ? "Tap the bookmark icon on a resource to save it here"
                    : "Try a different search or filter"}
                </Text>
              </YStack>
            )}
          </ScrollView>
        )}

        <HelpServiceButton />

        <Modal visible={filterVisible} transparent animationType="slide" onRequestClose={() => setFilterVisible(false)}>
          <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }} onPress={() => setFilterVisible(false)}>
            <Pressable style={{ flex: 1, justifyContent: "flex-end" }} onPress={() => {}}>
              <View backgroundColor="#FFF" borderTopLeftRadius={20} borderTopRightRadius={20} padding={24}>
                <XStack justifyContent="space-between" alignItems="center" marginBottom={16}>
                  <Text fontWeight="700" fontSize={17} color="#000">Filter by</Text>
                  <Pressable onPress={() => setFilterVisible(false)} hitSlop={8}>
                    <Text fontSize={22} color="#888">✕</Text>
                  </Pressable>
                </XStack>

                <Text fontSize={14} fontWeight="600" color="#444" marginBottom={8}>Category</Text>
                <XStack flexWrap="wrap" gap={8}>
                  {categories.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                    >
                      <View
                        backgroundColor={selectedCategory === cat ? colors.primary : "#F0F0F0"}
                        paddingHorizontal={14}
                        paddingVertical={6}
                        borderRadius={16}
                      >
                        <Text
                          color={selectedCategory === cat ? "#FFF" : "#555"}
                          fontWeight="600"
                          fontSize={13}
                        >
                          {cat}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </XStack>

                <Text fontSize={14} fontWeight="600" color="#444" marginTop={16} marginBottom={8}>Type</Text>
                <XStack flexWrap="wrap" gap={8}>
                  {TYPES.map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => setSelectedType(selectedType === t ? null : t)}
                    >
                      <View
                        backgroundColor={selectedType === t ? colors.primary : "#F0F0F0"}
                        paddingHorizontal={14}
                        paddingVertical={6}
                        borderRadius={16}
                      >
                        <Text
                          color={selectedType === t ? "#FFF" : "#555"}
                          fontWeight="600"
                          fontSize={13}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </XStack>

                <XStack marginTop={20} gap={12}>
                  <Button
                    flex={1}
                    backgroundColor="#E5E5E5"
                    color="#000"
                    onPress={() => { setSelectedCategory(null); setSelectedType(null); }}
                    height={44}
                    borderRadius={10}
                  >
                    Clear
                  </Button>
                  <Button
                    flex={1}
                    backgroundColor={colors.primary}
                    color="#FFF"
                    onPress={() => setFilterVisible(false)}
                    height={44}
                    borderRadius={10}
                  >
                    Apply
                  </Button>
                </XStack>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
