import React, { useEffect, useCallback } from "react";
import { Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSurrogateStore } from "@/store/surrogates";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useParentProfile } from "@/hooks/profile/useParentProfile";
import colors from "@/hooks/colors";
import CardStack from "@/components/cards/CardStack";

const cardImageSource = (avatar: any) =>
  typeof avatar === "number" ? avatar : { uri: avatar || undefined };

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
        {card.experienceLevel && card.experienceLevel !== "New" ? (
          <View
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
              {card.experienceLevel}
            </Text>
          </View>
        ) : null}
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

export default function SurrogateList() {
  const { surrogates, fetchSurrogates, isLoading } = useSurrogateStore();
  const { user } = useAuth();
  const { saveParentSurrogate } = useParentProfile();

  useEffect(() => {
    if (surrogates.length === 0) {
      fetchSurrogates(true).catch((err: any) => {
        Toast.show({
          text1: "Failed to load surrogates",
          type: "customError" as ToastType,
          text2: err?.response?.data?.message || "Please try again.",
        });
      });
    }
  }, [surrogates.length, fetchSurrogates]);

  const handleViewProfile = useCallback(
    async (card: any) => {
      if (user?.role?.trim() === "INTENDED_PARENT") {
        try {
          await saveParentSurrogate({ surrogateId: card.id });
        } catch {}
      }

      router.push({
        pathname: "/(tabs)/home/surrogate/surrogateProfileScreen",
        params: { id: card.id },
      });
    },
    [user, saveParentSurrogate],
  );

  return (
    <CardStack
      items={surrogates}
      isLoading={isLoading}
      title="Suggested Surrogate"
      entityName="surrogates"
      filterPlaceholder="Filter surrogates..."
      renderCardContent={(card) => <CardContent card={card} />}
      onViewProfile={handleViewProfile}
      onRefresh={() => fetchSurrogates(true)}
      fetchItems={fetchSurrogates}
    />
  );
}
