import React from "react";
import { View, Text, Image } from "react-native";
import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";

type CardProps = {
  card: any;
  cardHeight?:number;
  swipeX: Animated.SharedValue<number>;
  screenWidth: number;
};

export default function Card({ card, swipeX, screenWidth, cardHeight }: CardProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(swipeX.value, [-screenWidth, 0, screenWidth], [-15, 0, 15]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
<Animated.View
  key={card.id}
  style={[
    {
      height: cardHeight, // use passed prop
      width: "100%",
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: "#fafafa",
      justifyContent: "flex-end",
      alignSelf: "center",
    },
    animatedStyle,
  ]}
    >
      <Image
        source={{ uri: card.avatar }}
        style={{ width: "100%", height: "100%", position: "absolute" }}
        resizeMode="cover"
      />
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.35)",
          padding: 16,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
          {card.name}
        </Text>
        <Text style={{ color: "#eee", fontSize: 14 }}>
          {card.location || "Location not specified"}
        </Text>
      </View>
    </Animated.View>
  );
}
