import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import { YStack, XStack, Text } from "tamagui";
import {
  Ionicons,
  MaterialCommunityIcons, 
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import { useAuth } from "@/hooks/useAuth";

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
    route: "/help/getStarted",
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
    route: "/help/payment",
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
    route: "/help/gettingmatched",
  },
];

const surrogateFaqs: ArticleItem[] = [
  { id: "sf1", title: "How secure is my data?", route: "/help/faq" },
  { id: "sf2", title: "What medical checks are required?", route: "/help/faq" },
  { id: "sf3", title: "How do I get verified?", route: "/help/faq" },
  { id: "sf4", title: "What if I need to withdraw from a match?", route: "/help/faq" },
];

const parentFaqs: ArticleItem[] = [
  { id: "pf1", title: "How do I find a surrogate?", route: "/help/faq" },
  { id: "pf2", title: "What if a surrogate doesn\u2019t respond?", route: "/help/faq" },
  { id: "pf3", title: "How do I top up my wallet?", route: "/help/faq" },
  { id: "pf4", title: "Can I get a refund?", route: "/help/faq" },
];

const agentFaqs: ArticleItem[] = [
  { id: "af1", title: "How do I get verified as an agent?", route: "/help/faq" },
  { id: "af2", title: "Can I represent both sides?", route: "/help/faq" },
  { id: "af3", title: "How do I find clients?", route: "/help/faq" },
  { id: "af4", title: "What if a client backs out?", route: "/help/faq" },
];

export default function HelpCentreScreen(): React.ReactElement {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.role?.trim();
  const [refreshing, setRefreshing] = useState(false);

  const faqs = role === "SURROGATE" ? surrogateFaqs
    : role === "INTENDED_PARENT" ? parentFaqs
    : role === "AGENT" ? agentFaqs
    : surrogateFaqs;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={styles.container}>
        <ScreenHeader title={"Help center"} onBackPress={() => router.back()} />
        <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#0E0E55"]}
          />
        }
      >
        {/* <XStack style={styles.searchContainer}>
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
        </XStack> */}

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

        {/* FAQ */}
        <YStack marginTop={25}>
          <Text style={styles.sectionTitle}>FAQ</Text>
          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.articleCard}
              activeOpacity={0.7}
              onPress={() => router.push(faq.route)}
            >
              <XStack alignItems="center">
                <Ionicons
                  name="help-circle-outline"
                  size={22}
                  color="#1E1E80"
                  style={styles.articleIcon}
                />
                <Text style={styles.articleTitle}>{faq.title}</Text>
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
          <TouchableOpacity style={styles.mailButton} activeOpacity={0.8} onPress={()=>router.push("/(tabs)/chat/supportChat")}> 
            <Text style={styles.mailButtonText}>Customer Service</Text>
          </TouchableOpacity>
        </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
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
