import React, { useEffect, useCallback, useState } from "react";
import { Image, Text, View, Modal, TouchableOpacity, StyleSheet } from "react-native";
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
  const { surrogates, fetchSurrogates, fetchMatches, isLoading } = useSurrogateStore();
  const { user } = useAuth();
  const { saveParentSurrogate } = useParentProfile();
  const isParent = user?.role?.trim() === "INTENDED_PARENT";
  const [showModal, setShowModal] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (initialLoadDone || isLoading) return;
    if (surrogates.length > 0) return;

    const load = async () => {
      if (isParent) {
        try {
          await fetchMatches();
          const { surrogates: matches } = useSurrogateStore.getState();
          if (matches.length === 0) {
            setShowModal(true);
          }
        } catch {
          setShowModal(true);
        }
      } else {
        try {
          await fetchSurrogates();
        } catch {}
      }
      setInitialLoadDone(true);
    };
    load();
  }, [initialLoadDone, isLoading, surrogates.length, isParent, fetchMatches, fetchSurrogates]);

  const handleShowAll = useCallback(async () => {
    setShowModal(false);
    await fetchSurrogates();
  }, [fetchSurrogates]);

  const handleViewProfile = useCallback(
    async (card: any) => {
      if (isParent) {
        try {
          await saveParentSurrogate({ surrogateId: card.id });
        } catch {}
      }

      router.push({
        pathname: "/(tabs)/home/surrogate/surrogateProfileScreen",
        params: { id: card.id },
      });
    },
    [isParent, saveParentSurrogate],
  );

  const handleRefresh = useCallback(() => {
    setInitialLoadDone(false);
    useSurrogateStore.getState().setSurrogates([]);
    setShowModal(false);
  }, []);

  return (
    <>
      <CardStack
        items={surrogates}
        isLoading={isLoading}
        title="Suggested Surrogate"
        entityName="surrogates"
        filterPlaceholder="Filter surrogates..."
        renderCardContent={(card) => <CardContent card={card} />}
        onViewProfile={handleViewProfile}
        onRefresh={handleRefresh}
        fetchItems={isParent ? fetchMatches : fetchSurrogates}
        role="SURROGATE"
      />

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="search-outline" size={40} color={colors.primary} />
            <Text style={styles.modalTitle}>No Suggestions Yet</Text>
            <Text style={styles.modalText}>
              We couldn't find surrogates matching your preferences. Would you like to browse all available profiles?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnSecondary} onPress={() => setShowModal(false)}>
                <Text style={styles.modalBtnSecondaryText}>Not now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} onPress={handleShowAll}>
                <Text style={styles.modalBtnPrimaryText}>Show all</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    width: "100%",
    gap: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0E0E55",
  },
  modalText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    width: "100%",
  },
  modalBtnSecondary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0E0E55",
    alignItems: "center",
  },
  modalBtnSecondaryText: {
    color: "#0E0E55",
    fontWeight: "600",
  },
  modalBtnPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#0E0E55",
    alignItems: "center",
  },
  modalBtnPrimaryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
