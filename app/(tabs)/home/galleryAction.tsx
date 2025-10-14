
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text as RNText,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  ScrollView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomModal from "@/components/BottomModal";
import { useGallery } from "@/hooks/useGallery";


export default function GalleryScreen() {
  const router = useRouter();
  const {
    images: galleryImages,
    isLoading,
    isUploading,
    error,
    uploadImage,
    fetchImages,
    deleteImage
  } = useGallery();

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch images on component mount
  useEffect(() => {
    fetchImages(true); // Use cache by default
  }, [fetchImages]);

  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedIndices([]);
  }, []);

  // Request permission on first mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Please allow access to your photos to upload images."
          );
        }
      } catch (err) {
        // fallback
        console.warn("permission request failed", err);
      }
    })();
  }, []);

  // Back handler: exit selection mode when active
  useEffect(() => {
    const onBack = () => {
      if (selectionMode) {
        exitSelectionMode();
        return true; // handled
      }
      return false; // let default behavior run
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBack);
    return () => sub.remove();
  }, [selectionMode, selectedIndices, exitSelectionMode]);

  // pickImage: always re-check permission first
  const pickImage = async () => {
    // Prevent adding beyond limit
    if (galleryImages.length >= 4) return;

    const perms = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!perms.granted) {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Grant photo access in Settings to pick images."
        );
        return;
      }
    }

    // open picker
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // avoid deprecated enum; string works
      allowsEditing: true,
      quality: 1,
    });

    if (!res.canceled && res.assets?.length) {
      try {
        // Create FormData for upload
        const formData = new FormData();
        formData.append('image', {
          uri: res.assets[0].uri,
          type: 'image/jpeg',
          name: 'image.jpg',
        } as any);

        // Upload image via API
        await uploadImage(formData);

        // Show success message
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1400);
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image. Please try again.');
      }
    }
  };

  // enter or toggle selection on long press
  const handleLongPress = (index: number) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedIndices([index]);
    } else {
      // toggle if already in selectionMode
      toggleSelect(index);
    }
  };

  // toggle single index selection
  const toggleSelect = (index: number) => {
    setSelectedIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  };

  // Delete selected images
  const confirmDelete = async () => {
    if (selectedIndices.length === 0) {
      setShowDeleteConfirm(false);
      return;
    }

    try {
      // Delete images by their IDs
      const selectedImages = selectedIndices.map(index => galleryImages[index]);

      // Delete each selected image
      for (const image of selectedImages) {
        await deleteImage(image.id);
      }

      // Clear selection and exit selection mode
      setSelectedIndices([]);
      setSelectionMode(false);
      setShowDeleteConfirm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1400);
    } catch (error) {
      console.error('Error deleting images:', error);
      Alert.alert('Error', 'Failed to delete images. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  // Header back button handler
  const onHeaderBack = () => {
    if (selectionMode) {
      exitSelectionMode();
    } else {
      router.back();
    }
  };

  // Render a single card (image or add)
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

    const isSelected = selectedIndices.includes(idx);

    return (
      <TouchableOpacity
        key={imageOrAdd.id}
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

  // prepare items to display: images + add (if < 4 && not in selection mode)
  const itemsToShow = [
    ...galleryImages,
    ...(galleryImages.length < 4 && !selectionMode ? (["add"] as const) : []),
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onHeaderBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0E0E55" />
        </TouchableOpacity>
        <RNText style={styles.headerTitle}>
          {selectionMode ? `Select (${selectedIndices.length})` : "Gallery"}
        </RNText>
        <View style={{ width: 40 }} />
      </View>

      {/* Grid area */}
      <ScrollView contentContainerStyle={styles.gridWrap}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <RNText style={styles.loadingText}>Loading gallery...</RNText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <RNText style={styles.errorText}>Error: {error}</RNText>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchImages(false)}
            >
              <RNText style={styles.retryText}>Retry</RNText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {itemsToShow.map((item, i) =>
              item === "add" ? renderCard("add", i) : renderCard(item, i)
            )}
          </View>
        )}
      </ScrollView>

      {/* Action buttons */}
      {selectionMode ? (
        <View style={styles.selectionBar}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#BB2D21" }]}
            onPress={() => setShowDeleteConfirm(true)}
            disabled={selectedIndices.length === 0}
          >
            <Ionicons name="trash" size={20} color="#fff" />
            <RNText style={styles.actionText}>Delete</RNText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#E6E6E6" }]}
            onPress={exitSelectionMode}
          >
            <RNText style={{ color: "#0E0E55" }}>Cancel</RNText>
          </TouchableOpacity>
        </View>
      ) : null}

      <BottomModal
        visible={showDeleteConfirm}
        icon="trash"
        iconColor="#BB2D21"
        title="Delete images"
        message="Confirm that you want to delete the selected image(s)"
        buttons={[
          {
            label: "Dismiss",
            color: "#E6E6E6",
            textColor: "#0E0E55",
            onPress: () => setShowDeleteConfirm(false),
          },
          {
            label: "Delete",
            color: "#BB2D21",
            onPress: confirmDelete,
          },
        ]}
        onClose={() => setShowDeleteConfirm(false)}
      />

      {/* Success modal */}
      <BottomModal
        visible={showSuccess}
        success
        title="Deleted"
        message="Image(s) removed successfully."
        onClose={() => setShowSuccess(false)}
      />
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingTop: Platform.OS === "ios" ? 48 : 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  backBtn: { width: 40, height: 36, justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0E0E55" },

  gridWrap: { paddingHorizontal: 8, paddingBottom: 120 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  card: {
    width: "48%",
    aspectRatio: 3 / 4,
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: "#f6f6f6",
    position: "relative",
  },
  addCard: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  addText: { marginTop: 6, color: "#333" },

  image: { width: "100%", height: "100%", borderRadius: 10 },

  checkboxWrap: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "transparent",
  },

  selectionBar: {
    position: "absolute",
    bottom: 18,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  actionText: { color: "#fff", marginLeft: 8, fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontWeight: "700", fontSize: 18, color: "#111", marginBottom: 8 },
  modalBody: { color: "#444", textAlign: "center", marginBottom: 12 },

  modalActions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 6,
  },
  modalBtnLight: { backgroundColor: "#F1F1F1" },
  modalBtnDanger: { backgroundColor: "#BB2D21" },

  // Loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#BB2D21",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#0E0E55",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
