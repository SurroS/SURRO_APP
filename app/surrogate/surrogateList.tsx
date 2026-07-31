import React, { useEffect, useCallback, useState } from "react";
import { Image, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSurrogateStore } from "@/store/surrogates";
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

type ViewMode = "all" | "matches" | "saved";

export default function SurrogateList() {
  const { surrogates, fetchSurrogates, fetchMatches, isLoading, setSurrogates, setLoading, clearSurrogates, savedIds, setSavedIds, addSavedId, removeSavedId } = useSurrogateStore();
  const { user } = useAuth();
  const { saveParentSurrogate, removeSavedSurrogate, fetchSavedSurrogates } = useParentProfile();
  const isParent = user?.role?.trim() === "INTENDED_PARENT";
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  useEffect(() => {
    if (!isParent || initialLoadDone) return;
    fetchSavedSurrogates().then((saved) => {
      const ids = saved.map((s: any) => (s.surrogate ?? s).id ?? s.surrogateId).filter(Boolean);
      setSavedIds(ids);
    }).catch((e) => console.warn("[SurrogateList] Failed to fetch saved:", e));
  }, [isParent]);

  useEffect(() => {
    if (initialLoadDone || isLoading || surrogates.length > 0) return;
    const load = async () => {
      try {
        if (isParent) await fetchMatches();
        else await fetchSurrogates();
      } catch (e) { console.warn("[SurrogateList] Initial load failed:", e); }
      setInitialLoadDone(true);
    };
    load();
  }, [isParent]);

  const handleModeChange = useCallback(async (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "all") {
      clearSurrogates();
      fetchSurrogates();
    } else if (mode === "matches" && isParent) {
      clearSurrogates();
      fetchMatches();
    } else if (mode === "saved") {
      clearSurrogates();
      setLoading(true);
      try {
        const saved = await fetchSavedSurrogates();
        const mapped = saved.map((item: any) => {
          const s = item.surrogate ?? item;
          return {
            id: s.id ?? item.surrogateId ?? "",
            firstName: s.firstName ?? "",
            lastName: s.lastName ?? "",
            userName: s.userName ?? s.username ?? "unknown",
            age: s.age?.toString() ?? "?",
            countryOfResidence: s.countryOfResidence ?? "",
            stateOfResidence: s.stateOfResidence ?? s.state ?? "",
            lga: s.lga ?? "",
            profilePicture: s.profilePicture ?? null,
            aboutMe: s.aboutMe ?? s.bio ?? "",
            experienceLevel: s.experienceLevel ?? "New",
            image: s.profilePicture ?? "",
            avatar: s.profilePicture ?? "",
            bio: s.aboutMe ?? s.bio ?? "",
            country: s.countryOfResidence ?? s.country ?? "",
            contactPhone: s.phone1 ?? s.phone ?? "",
            contactEmail: s.user?.email ?? s.email ?? "",
            genotype: s.medical?.genotype ?? s.genotype,
            bloodGroup: s.medical?.bloodGroup ?? s.bloodGroup,
          };
        });
        setSurrogates(mapped);
        const ids = mapped.map((p: any) => p.id).filter(Boolean);
        setSavedIds(ids);
      } catch (e) {
        console.error("[SurrogateList] Failed to load saved:", e);
      } finally {
        setLoading(false);
      }
    }
  }, [fetchSurrogates, fetchMatches, isParent, fetchSavedSurrogates, clearSurrogates, setSurrogates, setLoading]);

  const handleSaveProfile = useCallback(async (surrogateId: string) => {
    try {
      if (savedIds?.has(surrogateId)) {
        await removeSavedSurrogate(surrogateId);
        removeSavedId(surrogateId);
      } else {
        await saveParentSurrogate({ surrogateId });
        addSavedId(surrogateId);
      }
      } catch (e) { console.warn("[SurrogateList] Save/remove failed:", e); }
  }, [savedIds, saveParentSurrogate, removeSavedSurrogate, addSavedId, removeSavedId]);

  const handleViewProfile = useCallback(
    async (card: any) => {
      router.push({
        pathname: "/surrogate/surrogateProfileScreen",
        params: { id: card.id },
      });
    },
    [],
  );

  const handleRefresh = useCallback(async () => {
    if (viewMode === "all") {
      clearSurrogates();
      await fetchSurrogates();
    } else if (viewMode === "matches" && isParent) {
      clearSurrogates();
      await fetchMatches();
    } else if (viewMode === "saved") {
      clearSurrogates();
      setLoading(true);
      try {
        const saved = await fetchSavedSurrogates();
        const mapped = saved.map((item: any) => {
          const s = item.surrogate ?? item;
          return {
            id: s.id ?? item.surrogateId ?? "",
            firstName: s.firstName ?? "",
            lastName: s.lastName ?? "",
            userName: s.userName ?? s.username ?? "unknown",
            age: s.age?.toString() ?? "?",
            countryOfResidence: s.countryOfResidence ?? "",
            stateOfResidence: s.stateOfResidence ?? s.state ?? "",
            lga: s.lga ?? "",
            profilePicture: s.profilePicture ?? null,
            aboutMe: s.aboutMe ?? s.bio ?? "",
            experienceLevel: s.experienceLevel ?? "New",
            image: s.profilePicture ?? "",
            avatar: s.profilePicture ?? "",
            bio: s.aboutMe ?? s.bio ?? "",
            country: s.countryOfResidence ?? s.country ?? "",
            contactPhone: s.phone1 ?? s.phone ?? "",
            contactEmail: s.user?.email ?? s.email ?? "",
            genotype: s.medical?.genotype ?? s.genotype,
            bloodGroup: s.medical?.bloodGroup ?? s.bloodGroup,
          };
        });
        setSurrogates(mapped);
        const ids = mapped.map((p: any) => p.id).filter(Boolean);
        setSavedIds(new Set(ids));
      } catch (e) {
        console.error("[SurrogateList] Failed to load saved:", e);
      } finally {
        setLoading(false);
      }
    }
  }, [viewMode, isParent, fetchMatches, fetchSurrogates, clearSurrogates, fetchSavedSurrogates, setSurrogates, setLoading]);

  return (
    <CardStack
      key={viewMode}
      items={surrogates}
      isLoading={isLoading}
      title="Suggested Surrogate"
      entityName="surrogates"
      filterPlaceholder="Filter surrogates..."
      renderCardContent={(card) => <CardContent card={card} />}
      onViewProfile={handleViewProfile}
      onRefresh={handleRefresh}
      fetchItems={viewMode === "all" ? fetchSurrogates : isParent ? fetchMatches : fetchSurrogates}
      role="SURROGATE"
      onSaveProfile={isParent ? handleSaveProfile : undefined}
      savedIds={savedIds}
      viewMode={viewMode}
      isParent={isParent}
      onViewModeChange={handleModeChange}
    />
  );
}
