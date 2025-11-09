import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { YStack, XStack, Text } from "tamagui";
import {
  Ionicons,
  MaterialCommunityIcons, 
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";

interface HelpTopic {
  id: string;
  title: string;
  icon: React.ReactNode;
  route: string;
}

interface ArticleItem {
  id: string;
  title: string;
  route: string;
}

const helpTopics: HelpTopic[] = [
  {
    id: "get-started",
    title: "Get started",
    icon: <MaterialCommunityIcons name="flag" size={22} color="#1E1E80" />,
    route: "/help/get-started",
  },
  {
    id: "payments",
    title: "Payments",
    icon: (
      <MaterialCommunityIcons
        name="credit-card-outline"
        size={22}
        color="#1E1E80"
      />
    ),
    route: "/help/payments",
  },
  {
    id: "getting-matched",
    title: "Getting matched",
    icon: (
      <MaterialCommunityIcons
        name="account-group-outline"
        size={22}
        color="#1E1E80"
      />
    ),
    route: "/help/getting-matched",
  },
];

const popularArticles: ArticleItem[] = [
  {
    id: "article1",
    title: "Getting the best representative as  a\n surrogate",
    route: "/help/articles/representative",
  },
  {
    id: "article2",
    title: "My experience as a surrogate",
    route: "/help/articles/experience",
  },
];

export default function HelpCentreScreen(): React.ReactElement {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={"Help center"} onBackPress={() => router.back()} />
      <ScrollView>
        <XStack style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search help centre"
            placeholderTextColor="#999"
          />
        </XStack>

        {/* Help Topics */}
        <YStack marginTop={25}>
          <Text style={styles.sectionTitle}>Help Topics</Text>
          {helpTopics.map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.itemCard}
              activeOpacity={0.7}
              onPress={() => router.push(topic.route)}
            >
              <XStack alignItems="center">
                <XStack style={styles.iconContainer}>{topic.icon}</XStack>
                <Text style={styles.itemTitle}>{topic.title}</Text>
              </XStack>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          ))}
        </YStack>

        {/* Popular Articles */}
        <YStack marginTop={25}>
          <Text style={styles.sectionTitle}>Popular articles</Text>
          {popularArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.articleCard}
              activeOpacity={0.7}
              onPress={() => router.push(article.route)}
            >
              <XStack alignItems="center">
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={22}
                  color="#1E1E80"
                  style={styles.articleIcon}
                />
                <Text style={styles.articleTitle}>{article.title}</Text>
              </XStack>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          ))}
        </YStack>

        {/* Contact Section */}
        <YStack alignItems="center" marginTop={40}>
          <Ionicons
            name="help-circle"
            size={28}
            color="#C71585"
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.contactTitle}>Need more help</Text>
          <Text style={styles.contactText}>
            You can chat with a customer care representative
          </Text>
          <TouchableOpacity style={styles.mailButton} activeOpacity={0.8} onPress={()=>router.push("/chat/supportChat")}> 
            <Text style={styles.mailButtonText}>Customer Service</Text>
          </TouchableOpacity>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginLeft: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#222",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  articleCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  articleIcon: {
    marginRight: 10,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  contactText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 30,
  },
  mailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6EBFF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  mailButtonText: {
    color: "#1E1E80",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
});
