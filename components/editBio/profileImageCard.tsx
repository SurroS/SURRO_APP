// ProfileImageCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Camera, Pen } from "@tamagui/lucide-icons";
import colors from "@/hooks/colors";

const CARD_H = 156;

type Props = {
  onEditBio?: () => void;
  onChangePicture?: (uri?: string) => void;
  imageSrc?: { uri: string } | any;
};

export default function ProfileImageCard({
  onEditBio,
  onChangePicture,
  imageSrc,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Profile Image with Camera Overlay */}
      <Pressable onPress={() => onChangePicture?.()}>
        <View style={styles.imageWrapper}>
          {imageSrc ? (
            <Image source={imageSrc} style={styles.profileImage} />
          ) : (
            <View style={styles.fallbackBox}>
              <Text style={styles.fallbackText}>Profile Picture</Text>
            </View>
          )}
          <View style={styles.cameraOverlay}>
            <Camera size={24} color="#FFF" />
          </View>
        </View>
      </Pressable>

      {/* Edit Bio */}
      <TouchableOpacity
        style={styles.editBtn}
        onPress={onEditBio}
        accessibilityRole="button"
        accessibilityLabel="Edit bio"
      >
        <Text style={styles.editText}>Edit bio </Text>
        <Pen size={16} color={colors.text} style={{ marginLeft: 6 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: CARD_H,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#F6F4F4",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginTop: -60,
    zIndex: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  fallbackBox: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF4FE",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    elevation: 2,
  },
  editText: {
    fontSize: 14,
    fontWeight: "500",
    color: "$color",
  },
});
