import React, { useEffect, useCallback, useState } from "react";
import { Image, Text, View } from "react-native";
import { router } from "expo-router";
import { useParentProfile } from "@/hooks/profile/useParentProfile";
import CardStack from "@/components/cards/CardStack";
import { useAuth } from "@/hooks/useAuth";

export default function SavedSurrogatesScreen() {
  const { fetchSavedSurrogates, removeSavedSurrogate } = useParentProfile();
  const { user } = useAuth();
  const isParent = user?.role?.trim() === "INTENDED_PARENT";
  const [savedProfiles, setSavedProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    try {
      setLoading(true);
      const raw = await fetchSavedSurrogates();
      const items = Array.isArray(raw) ? raw : [];
      const profiles = items.map((item: any) => {
        const s = item.surrogate ?? {};
        return {
          ...s,
          id: s.id ?? item.surrogateId,
          _savedId: item.id,
        };
      });
      setSavedProfiles(profiles);
      const ids = profiles.map((p: any) => p.id).filter(Boolean);
      setSavedIds(new Set(ids));
    } catch {
      setSavedProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = useCallback((card: any) => {
    router.push({
      pathname: "/surrogate/surrogateProfileScreen",
      params: { id: card.id },
    });
  }, []);

  const handleSaveProfile = useCallback(async (surrogateId: string) => {
    try {
      await removeSavedSurrogate(surrogateId);
      setSavedIds(prev => { const next = new Set(prev); next.delete(surrogateId); return next; });
      setSavedProfiles(prev => prev.filter((p: any) => p.id !== surrogateId));
    } catch {}
  }, [removeSavedSurrogate]);

  const handleRefresh = useCallback(async () => {
    await loadSaved();
  }, []);

  const handleFetchItems = useCallback(async () => {
    await loadSaved();
  }, []);

  return (
    <CardStack
      items={savedProfiles}
      isLoading={loading}
      title="Saved Surrogates"
      entityName="saved surrogates"
      filterPlaceholder="Filter saved..."
      renderCardContent={(card) => {
        const age = card.age ?? "?";
        const location = card.countryOfResidence || card.country || "";
        const bio = card.aboutMe || card.bio || "";
        const avatarUrl = card.profilePicture || card.avatar || "";
        return (
          <>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: "100%", height: "100%", position: "absolute" }}
                resizeMode="cover"
              />
            ) : null}
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
              <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>
                {card.userName || `User#${card.id?.slice(0, 4) || ""}`}, {age}
              </Text>
              {location ? (
                <Text style={{ color: "#ccc", fontSize: 14, marginTop: 4 }}>
                  {location}
                </Text>
              ) : null}
              {bio ? (
                <Text style={{ color: "#ddd", fontSize: 13, marginTop: 8 }} numberOfLines={2}>
                  {bio}
                </Text>
              ) : null}
            </View>
          </>
        );
      }}
      onViewProfile={handleViewProfile}
      onRefresh={handleRefresh}
      fetchItems={handleFetchItems}
      role="SURROGATE"
      onSaveProfile={isParent ? handleSaveProfile : undefined}
      savedIds={savedIds}
    />
  );
}
