import React, { useState, useRef, useCallback } from "react";
import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  PanResponder,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ImageCropperModalProps {
  visible: boolean;
  imageUri: string;
  aspect?: [number, number];
  onCrop: (croppedUri: string) => void;
  onCancel: () => void;
}

export default function ImageCropperModal({
  visible,
  imageUri,
  aspect,
  onCrop,
  onCancel,
}: ImageCropperModalProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isCropping, setIsCropping] = useState(false);
  const insets = useSafeAreaInsets();

  const translateX = useRef(0);
  const translateY = useRef(0);
  const zoom = useRef(1);
  const startX = useRef(0);
  const startY = useRef(0);
  const [, forceRender] = useState(0);
  const rerender = () => forceRender((i) => i + 1);

  const resetTransform = useCallback(() => {
    translateX.current = 0;
    translateY.current = 0;
    zoom.current = 1;
    rerender();
  }, []);

  const handleImageLoad = (e: any) => {
    const { width, height } = e.nativeEvent.source;
    setImageSize({ width, height });
    resetTransform();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startX.current = translateX.current;
        startY.current = translateY.current;
      },
      onPanResponderMove: (_, g) => {
        translateX.current = startX.current + g.dx;
        translateY.current = startY.current + g.dy;
        rerender();
      },
    })
  ).current;

  const baseScale =
    imageSize.width > 0 && containerSize.width > 0
      ? Math.min(
          containerSize.width / imageSize.width,
          containerSize.height / imageSize.height
        )
      : 1;

  const displayWidth = imageSize.width * baseScale * zoom.current;
  const displayHeight = imageSize.height * baseScale * zoom.current;

  const imageLeft = (containerSize.width - displayWidth) / 2 + translateX.current;
  const imageTop = (containerSize.height - displayHeight) / 2 + translateY.current;

  const cropFrameWidth = aspect
    ? Math.min(
        containerSize.width * 0.9,
        containerSize.height * 0.9 * (aspect[0] / aspect[1])
      )
    : Math.min(containerSize.width * 0.9, containerSize.height * 0.9);

  const cropFrameHeight = aspect
    ? cropFrameWidth * (aspect[1] / aspect[0])
    : cropFrameWidth;

  const cropFrameLeft = (containerSize.width - cropFrameWidth) / 2;
  const cropFrameTop = (containerSize.height - cropFrameHeight) / 2;

  const zoomIn = () => {
    zoom.current = Math.min(zoom.current + 0.1, 3);
    rerender();
  };

  const zoomOut = () => {
    zoom.current = Math.max(zoom.current - 0.1, 0.5);
    rerender();
  };

  const handleCrop = async () => {
    setIsCropping(true);
    try {
      const scale = baseScale * zoom.current;
      const originX = Math.max(
        0,
        (cropFrameLeft - imageLeft) / scale
      );
      const originY = Math.max(
        0,
        (cropFrameTop - imageTop) / scale
      );
      let cropW = cropFrameWidth / scale;
      let cropH = cropFrameHeight / scale;
      if (originX + cropW > imageSize.width) {
        cropW = imageSize.width - originX;
      }
      if (originY + cropH > imageSize.height) {
        cropH = imageSize.height - originY;
      }

      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: Math.round(originX),
              originY: Math.round(originY),
              width: Math.round(cropW),
              height: Math.round(cropH),
            },
          },
        ],
        { format: ImageManipulator.SaveFormat.JPEG, compress: 1 }
      );
      onCrop(result.uri);
    } catch (error) {
      console.error("Crop error:", error);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={onCancel}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <View
          style={styles.imageArea}
          onLayout={(e) =>
            setContainerSize({
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            })
          }
          {...panResponder.panHandlers}
        >
          <Image
            source={{ uri: imageUri }}
            onLoad={handleImageLoad}
            style={[
              styles.image,
              {
                left: imageLeft,
                top: imageTop,
                width: displayWidth || containerSize.width,
                height: displayHeight || containerSize.height,
              },
            ]}
            resizeMode="contain"
          />

          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View
              style={[
                styles.overlayPart,
                { top: 0, left: 0, right: 0, height: cropFrameTop },
              ]}
            />
            <View
              style={[
                styles.overlayPart,
                {
                  top: cropFrameTop,
                  left: 0,
                  width: cropFrameLeft,
                  height: cropFrameHeight,
                },
              ]}
            />
            <View
              style={[
                styles.overlayPart,
                {
                  top: cropFrameTop,
                  left: cropFrameLeft + cropFrameWidth,
                  right: 0,
                  height: cropFrameHeight,
                },
              ]}
            />
            <View
              style={[
                styles.overlayPart,
                {
                  bottom: 0,
                  left: 0,
                  right: 0,
                  top: cropFrameTop + cropFrameHeight,
                },
              ]}
            />
            <View
              style={[
                styles.cropBorder,
                {
                  top: cropFrameTop,
                  left: cropFrameLeft,
                  width: cropFrameWidth,
                  height: cropFrameHeight,
                },
              ]}
            />
          </View>
        </View>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.zoomRow}>
            <TouchableOpacity
              onPress={zoomOut}
              style={styles.zoomBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="remove-circle-outline" size={28} color="#0E0E55" />
            </TouchableOpacity>
            <Text style={styles.zoomLabel}>{Math.round(zoom.current * 100)}%</Text>
            <TouchableOpacity
              onPress={zoomIn}
              style={styles.zoomBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="add-circle-outline" size={28} color="#0E0E55" />
            </TouchableOpacity>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cropBtn, isCropping && styles.cropBtnDisabled]}
              onPress={handleCrop}
              disabled={isCropping}
            >
              {isCropping ? (
                <View style={styles.croppingRow}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.cropLabel}> Uploading...</Text>
                </View>
              ) : (
                <Text style={styles.cropLabel}>Crop</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    left: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageArea: {
    flex: 1,
    overflow: "hidden",
  },
  image: {
    position: "absolute",
  },
  overlayPart: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  cropBorder: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 4,
  },
  bottomBar: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
  },
  zoomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 16,
  },
  zoomBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F5",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0E0E55",
    minWidth: 48,
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  cropBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#0E0E55",
    alignItems: "center",
    justifyContent: "center",
  },
  cropBtnDisabled: {
    opacity: 0.6,
  },
  cropLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  croppingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
});
