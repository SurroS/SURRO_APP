import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height } = Dimensions.get("window");

interface ButtonConfig {
  label: string;
  color?: string;
  textColor?: string;
  onPress?: () => void;
}

export default function BottomModal({
  visible,
  image,
  icon,
  iconColor = "#0E0E55",
  title,
  message,
  buttons = [],
  orientation = "row",
  onClose,
  success = false,
}: {
  visible: boolean;
  image?: any;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  title?: string;
  message?: string;
  buttons?: ButtonConfig[];
  orientation?: "row" | "column";
  onClose?: () => void;
  success?: boolean;
}) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (visible) {
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ];

    if (success) {
      animations.push(
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  } else {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }
}, [visible]);


  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[styles.modalCard, { transform: [{ translateY: slideAnim }] }]}
        >
          {success ? (
            <Animated.View
              style={[
                styles.successWrap,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Ionicons name="checkmark-circle" size={64} color="#00724A" />
            </Animated.View>
          ) : image ? (
            <Image source={image} style={styles.iconImage} />
          ) : icon ? (
            <Ionicons name={icon} size={56} color={iconColor} />
          ) : null}

          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}

          <View
            style={[
              styles.buttonWrap,
              orientation === "column" && { flexDirection: "column" },
            ]}
          >
            {buttons.map((b, i) => (
              <TouchableOpacity
                key={i}
                onPress={b.onPress}
                style={[
                  styles.button,
                  {
                    backgroundColor: b.color || "#0E0E55",
                    marginBottom: orientation === "column" && i < buttons.length - 1 ? 10 : 0,
                  },
                ]}
              >
                <Text style={{ color: b.textColor || "#fff", fontWeight: "600" }}>
                  {b.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  successWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E9F8F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonWrap: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
});
