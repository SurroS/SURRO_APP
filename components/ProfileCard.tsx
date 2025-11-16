import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, interpolate, SharedValue } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

type CardProps = {
  card: any;
  cardHeight: number;
  swipeX: SharedValue<number>;
  screenWidth: number;
};

export default function Card({ card, swipeX, screenWidth, cardHeight }: CardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      swipeX.value,
      [-screenWidth, 0, screenWidth],
      [-10, 0, 10]
    );
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <Animated.View style={[styles.card, { height: cardHeight }, animatedStyle]}>
      <Image
        source={{ uri: card.avatar }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{card.name}</Text>
        <Text style={{ color: "#eee", fontSize: 16  }}>
          <Ionicons name="location" size={16} />{" "}
          {card.location || "country"}{" "}
          <Ionicons name="calendar"size={16}/>{" "}
          {card.age || "age years"}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fafafa",
    justifyContent: "flex-end",
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  info: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 20,
  },
  name: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  details: {
    color: "#eee",
    fontSize: 16,
    marginTop: 4,
  },
});
