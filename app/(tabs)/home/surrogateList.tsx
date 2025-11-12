import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-deck-swiper";
import { Text, Button, YStack, XStack } from "tamagui";
import { useSurrogateStore } from "@/store/surrogates";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

const SurrogateList = () => {
  const { surrogates, isLoading, fetchSurrogates } = useSurrogateStore();
  const router = useRouter();
  const params = useLocalSearchParams();

  const initialSurrogates = params.surrogates
    ? JSON.parse(params.surrogates as string)
    : [];

  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (initialSurrogates.length) {
        setList(initialSurrogates);
      } else {
        try {
          await fetchSurrogates(true);
        } catch (err) {
          console.log("Failed to fetch surrogates:", err);
        }
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!initialSurrogates.length && surrogates.length) {
      setList(surrogates);
    }
  }, [surrogates]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading surrogates...</Text>
      </View>
    );
  }

  if (!list.length) {
    return (
      <View style={styles.center}>
        <Text>No surrogates available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={list}
        renderCard={(s: any) => (
          <View style={styles.card}>
            <Image
              source={{ uri: s.avatar }}
              style={styles.image}
              resizeMode="cover"
            />

            <YStack padding="$3" space="$2">
              <Text fontSize="$5" fontWeight="700">
                {s.name}
              </Text>

              <XStack alignItems="center" space="$2">
                <Text color="#666">📍 {s.location || "Unknown"}</Text>
                <Text color="#666">🎂 {s.age || "N/A"} years</Text>
              </XStack>

              {s.status && (
                <View style={styles.badge}>
                  <Text color="white" fontSize="$2">
                    {s.status}
                  </Text>
                </View>
              )}

              <XStack marginTop="$4" space="$3" justifyContent="center">
                <Button
                  size="$3"
                  backgroundColor="gray"
                  onPress={() => console.log("Ignored:", s.name)}
                >
                  Ignore
                </Button>
                <Button
                  size="$3"
                  backgroundColor="#000080"
                  color="white"
                  onPress={() =>
                    router.push(`/surrogateProfile/${s.id}`)
                  }
                >
                  View Profile
                </Button>
              </XStack>
            </YStack>
          </View>
        )}
        stackSize={3}
        backgroundColor="#fff"
        infinite={false}
        animateCardOpacity
        verticalSwipe={false}
        onSwipedLeft={(i:any) => console.log("Ignored:", list[i].name)}
        onSwipedRight={(i:any) => console.log("Liked:", list[i].name)}
        cardIndex={0}
      />
    </View>
  );
};

export default SurrogateList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 30,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    height: 520,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 350,
  },
  badge: {
    backgroundColor: "green",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
});
