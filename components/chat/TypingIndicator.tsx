import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";

export default function TypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      const animation = Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      animation.start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);

    return () => {
      dot1.stopAnimation();
      dot2.stopAnimation();
      dot3.stopAnimation();
    };
  }, [dot1, dot2, dot3]);

  const renderDot = (animatedValue: Animated.Value, key: string) => {
    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 1.2],
    });
    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    });

    return (
      <Animated.View
        key={key}
        style={[
          styles.dot,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderDot(dot1, "1")}
      {renderDot(dot2, "2")}
      {renderDot(dot3, "3")}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0E0E55", // your brand color
    marginHorizontal: 3,
  },
});
