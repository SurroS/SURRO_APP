import React, { useEffect, useCallback, useMemo } from "react";
import { Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAgentListStore } from "@/store/agents";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { router } from "expo-router";
import CardStack from "@/components/cards/CardStack";

const getAge = (dob?: string | null): string => {
  if (!dob) return "?";
  const date = new Date(dob);
  return Math.floor(
    (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365),
  ).toString();
};

const cardImageSource = (avatar: any) =>
  typeof avatar === "number" ? avatar : { uri: avatar || undefined };

const normalizeAgent = (a: any): any => ({
  id: a.id || "",
  userName:
    a.userName ?? a.username ?? a.user?.userName ?? a.firstName
      ? `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim()
      : "",
  avatar: a.avatar ?? a.profilePicture ?? a.profilePictureUrl ?? "",
  age: a.age ? a.age.toString() : getAge(a.dateOfBirth ?? a.dob),
  stateOfResidence: a.stateOfResidence ?? a.state ?? "",
  country: a.countryOfResidence ?? a.country ?? "",
  bio: a.aboutMe ?? a.bio ?? "",
});

const CardContent = ({ card }: { card: any }) => (
  <>
    <Image
      source={cardImageSource(card.avatar)}
      style={{ width: "100%", height: "100%", position: "absolute" }}
      resizeMode="cover"
    />

    <View
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
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800", flex: 1 }}>
          {card.userName || "N/A"}, {card.age || "?"}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginTop: 4,
        }}
      >
        <Ionicons name="location-outline" size={14} color="#ccc" />
        <Text style={{ color: "#ccc", fontSize: 14 }}>
          {card.stateOfResidence || card.country || "N/A"}
        </Text>
      </View>

      {card.bio ? (
        <Text
          style={{ color: "#ddd", fontSize: 13, marginTop: 8 }}
          numberOfLines={2}
        >
          {card.bio}
        </Text>
      ) : null}
    </View>
  </>
);

export default function AgentsListScreen() {
  const { agents, fetchAgents, isLoading } = useAgentListStore();

  const normalizedAgents = useMemo(() => agents.map(normalizeAgent), [agents]);

  useEffect(() => {
    if (agents.length === 0) {
      fetchAgents(true).catch((err: any) => {
        Toast.show({
          text1: "Failed to load agents",
          type: "customError" as ToastType,
          text2: err?.response?.data?.message || "Please try again.",
        });
      });
    }
  }, [agents.length, fetchAgents]);

  const handleViewProfile = useCallback(
    (card: any) => {
      router.push({
        pathname: "/(tabs)/home/agent/agentsProfileScreen",
        params: { id: card.id },
      });
    },
    [],
  );

  return (
    <CardStack
      items={normalizedAgents}
      isLoading={isLoading}
      title="Suggested Agent"
      entityName="agents"
      filterPlaceholder="Filter agents..."
      renderCardContent={(card) => <CardContent card={card} />}
      onViewProfile={handleViewProfile}
      onRefresh={() => fetchAgents(true)}
      fetchItems={fetchAgents}
    />
  );
}
