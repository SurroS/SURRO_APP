import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text as RNText,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomModal from "@/components/modals/BottomModal";
import { useGallery } from "@/hooks/useGallery";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageCropperModal from "@/components/ImageCropperModal";

export default function GalleryScreen() {
  const router = useRouter();
  const {
    images: galleryImages,
    isLoading,
    isUploading,
    uploadImage,
    fetchImages,
    deleteImage,
  } = useGallery();

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [cropperImageUri, setCropperImageUri] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const safeGalleryImages = Array.isArray(galleryImages)
    ? galleryImages.filter((img) => img && img.url)
    : [];

  useEffect(() => {
    fetchImages(true);
  }, [fetchImages]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchImages(false);
    setRefreshing(false);
  }, [fetchImages]);

  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedIndices([]);
  }, []);

  const pickImage = async () => {
    if (safeGalleryImages.length >= 4) return;

    const perms = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!perms.granted) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!res.canceled && res.assets?.length) {
      setCropperImageUri(res.assets[0].uri);
      setShowCropper(true);
    }
  };

  const handleCropComplete = async (croppedUri: string) => {
    try {
      const formData = new FormData();
      formData.append("files", {
        uri: croppedUri,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);

      await uploadImage(formData);
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 1500);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setShowCropper(false);
      setCropperImageUri(null);
    }
  };

  const handleCropperCancel = () => {
    setShowCropper(false);
    setCropperImageUri(null);
  };

  const handleLongPress = (index: number) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedIndices([index]);
    } else {
      toggleSelect(index);
    }
  };

  const toggleSelect = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const confirmDelete = async () => {
    if (selectedIndices.length === 0) {
      setShowDeleteConfirm(false);
      return;
    }

    try {
      const selectedImages = selectedIndices
        .map((index) => safeGalleryImages[index])
        .filter((img) => img && img.id);

      for (const image of selectedImages) {
        await deleteImage(image.id);
      }

      setSelectedIndices([]);
      setSelectionMode(false);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 1500);
    } catch (error) {
      console.error("Error deleting images:", error);
      setShowDeleteConfirm(false);
    }
  };

  const renderCard = (imageOrAdd: any | "add", idx: number) => {
    if (imageOrAdd === "add") {
      return (
        <TouchableOpacity
          key={"add"}
          style={[styles.card, styles.addCard]}
          activeOpacity={0.8}
          onPress={pickImage}
          disabled={isUploading}
        >
          <Ionicons name="add-circle" size={44} color="#0E0E55" />
          <RNText style={styles.addText}>
            {isUploading ? "Uploading..." : "Add image"}
          </RNText>
        </TouchableOpacity>
      );
    }

    if (!imageOrAdd || !imageOrAdd.url) return null;

    const isSelected = selectedIndices.includes(idx);

    return (
      <TouchableOpacity
        key={imageOrAdd.id || idx}
        activeOpacity={0.9}
        onLongPress={() => handleLongPress(idx)}
        onPress={() => {
          if (selectionMode) toggleSelect(idx);
        }}
        style={styles.card}
      >
        <Image source={{ uri: imageOrAdd.url }} style={styles.image} />
        {selectionMode && (
          <View style={styles.checkboxWrap} pointerEvents="none">
            <Ionicons
              name={isSelected ? "checkmark-circle" : "ellipse-outline"}
              size={26}
              color={isSelected ? "#09d814ff" : "#fff"}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const itemsToShow = [
    ...safeGalleryImages,
    ...(safeGalleryImages.length < 4 && !selectionMode ? (["add"] as const) : []),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0E0E55" />
          </TouchableOpacity>
          <RNText style={styles.headerTitle}>
            {selectionMode ? `Select (${selectedIndices.length})` : "Gallery"}
          </RNText>
          {!selectionMode && (
            <TouchableOpacity onPress={pickImage} style={styles.addBtn}>
              <Ionicons name="add" size={28} color="#0E0E55" />
            </TouchableOpacity>
          )}
          {selectionMode && (
            <TouchableOpacity onPress={exitSelectionMode}>
              <RNText style={styles.cancelText}>Cancel</RNText>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.gridWrap}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0E0E55"]}
            />
          }
        >
          {isLoading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <RNText style={styles.loadingText}>Loading gallery...</RNText>
            </View>
          ) : (
            <View style={styles.grid}>
              {itemsToShow.map((item, i) =>
                item === "add" ? renderCard("add", i) : renderCard(item, i)
              )}
            </View>
          )}
        </ScrollView>

        {selectionMode && (
          <View style={styles.selectionBar}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#BB2D21" }]}
              onPress={() => setShowDeleteConfirm(true)}
              disabled={selectedIndices.length === 0}
            >
              <Ionicons name="trash" size={20} color="#fff" />
              <RNText style={styles.actionText}>Delete</RNText>
            </TouchableOpacity>
          </View>
        )}

        <BottomModal
          visible={showDeleteConfirm}
          icon="trash"
          iconColor="#BB2D21"
          title="Delete images"
          message="Confirm that you want to delete the selected image(s)"
          buttons={[
            { label: "Dismiss", color: "#E6E6E6", textColor: "#0E0E55", onPress: () => setShowDeleteConfirm(false) },
            { label: "Delete", color: "#BB2D21", onPress: confirmDelete },
          ]}
          onClose={() => setShowDeleteConfirm(false)}
        />

        <BottomModal
          visible={showUploadSuccess}
          success
          title="Uploaded"
          message="Image uploaded successfully."
          onClose={() => setShowUploadSuccess(false)}
        />

        <BottomModal
          visible={showDeleteSuccess}
          success
          title="Deleted"
          message="Image(s) removed successfully."
          onClose={() => setShowDeleteSuccess(false)}
        />

        <ImageCropperModal
          visible={showCropper}
          imageUri={cropperImageUri || ""}
          onCrop={handleCropComplete}
          onCancel={handleCropperCancel}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingHorizontal: 16, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  addBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0E0E55", flex: 1, textAlign: "center" },
  cancelText: { color: "#0E0E55", fontSize: 16 },
  gridWrap: { paddingHorizontal: 8, paddingBottom: 120 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingTop: 12 },
  card: { width: "48%", aspectRatio: 3 / 4, borderRadius: 10, marginBottom: 12, overflow: "hidden", backgroundColor: "#f6f6f6", position: "relative" },
  addCard: { alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#e6e6e6" },
  addText: { marginTop: 6, color: "#333" },
  image: { width: "100%", height: "100%", borderRadius: 10 },
  checkboxWrap: { position: "absolute", top: 8, right: 8, backgroundColor: "transparent" },
  selectionBar: { position: "absolute", bottom: 18, left: 12, right: 12, flexDirection: "row", justifyContent: "space-between" },
  actionBtn: { flex: 1, marginHorizontal: 6, borderRadius: 10, paddingVertical: 12, alignItems: "center", flexDirection: "row", justifyContent: "center" },
  actionText: { color: "#fff", marginLeft: 8, fontWeight: "600" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
  loadingText: { fontSize: 16, color: "#666", fontWeight: "500" },
});