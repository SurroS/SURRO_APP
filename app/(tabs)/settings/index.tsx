import React from "react";
import { StyleSheet, TouchableOpacity} from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const settingsData: SettingItem[] = [
  {
    id: "profile",
    title: "Profile information",
    description: "Adjust your personal information",
    icon: <Ionicons name="person-circle" size={24} color="#1E90FF" />,
    route: "/(tabs)/settings/profile",
  },
  {
    id: "kyc",
    title: "KYC update",
    description: "Finish setup to get verified and visible",
    icon: <MaterialIcons name="verified-user" size={24} color="#8A2BE2" />,
    route: "/(tabs)/settings/kyc",
  },
  {
    id: "personalization",
    title: "Personalization",
    description: "Set your notification preference",
    icon: <Ionicons name="settings" size={24} color="#FFD700" />,
    route: "/(tabs)/settings/personalization",
  },
  // {
  //   id: "stats",
  //   title: "My stats",
  //   description: "View your record",
  //   icon: <FontAwesome5 name="chart-bar" size={22} color="#DC143C" />,
  //   route: "/(tabs)/settings/stats",
  // },
  {
    id: "security",
    title: "Privacy and security",
    description: "Update your password",
    icon: <Ionicons name="lock-closed" size={24} color="#2E8B57" />,
    route: "/(tabs)/settings/security",
  },
  {
    id: "help",
    title: "Help and support",
    description: "FAQs",
    icon: <Ionicons name="help-circle" size={24} color="#C71585" />,
    route: "/(tabs)/settings/help",
  },
];

export default function SettingsScreen():React.ReactNode{
  const router = useRouter();

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack>
        <Text style={styles.headerText}>Settings</Text>

        <YStack>
          {settingsData.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() => handleNavigate(item.route)}
            >
              <XStack alignItems="center">
                <XStack style={styles.iconContainer}>{item.icon}</XStack>
                <YStack>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </YStack>
              </XStack>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#999999"
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          ))}
        </YStack>
      </YStack>
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
    fontSize: 22,
    fontWeight: "800",
    color: "#111111",
    marginBottom: 25,
  },
  settingItem: {
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222222",
  },
  description: {
    fontSize: 13,
    color: "#777777",
  },
  arrowIcon: {
    alignSelf: "center",
  },
});
