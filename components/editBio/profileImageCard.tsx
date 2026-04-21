// ProfileImageCard.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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
      {/* Profile Image */}
      <Pressable onPress={() => onChangePicture?.()}>
        <View style={styles.imageWrapper}>
          <Image
            source={
              imageSrc
                ? imageSrc
                : require("@/assets/images/femaleAvatar.png")
            }
            style={styles.profileImage}
          />
        </View>
      </Pressable>
      {/* Change Picture */}
      <TouchableOpacity
        style={styles.changePic}
        onPress={() => onChangePicture?.()}
        accessibilityRole="button"
        accessibilityLabel="Change profile picture"
      >
        <Camera size={16} color={colors.text} />
        <Text style={styles.changeText}> Change profile picture</Text>
      </TouchableOpacity>

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
  changePic: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  changeText: {
    textDecorationLine: "underline",
    color: "$color",
    fontSize: 14,
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
