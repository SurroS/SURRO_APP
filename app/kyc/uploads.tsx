import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import AlertModal from "@/components/modals/AlertModal";
import { YStack, Text } from "tamagui";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import colors from "@/hooks/colors";
import { ScreenHeader } from "@/components/auth";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FRAME_WIDTH = SCREEN_WIDTH * 0.72;
const FRAME_RATIO = 1.586;

export default function KYCUploadScreen() {
  const params = useLocalSearchParams<Record<string, string>>();
  const { idType, side, frontUri: passedFrontUri } = params;
  const currentSide: "front" | "back" = (side as "front" | "back") || "front";

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  const isPassport = idType === "passport";

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  useEffect(() => {
    if (isPassport && currentSide === "back") {
      router.back();
    }
  }, [isPassport, currentSide]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      const previewParams: Record<string, string> = {
        idType: idType || "",
        side: currentSide,
        uri: photo.uri,
      };
      if (passedFrontUri) {
        previewParams.frontUri = passedFrontUri;
      }
      router.push({
        pathname: "/kyc/id-preview",
        params: previewParams,
      });
    } catch (error) {
      console.error("Camera capture error:", error);
      setAlertVisible(true);
    }
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text color={colors.primary}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  const readableId =
    idType === "national_id" ? "National ID Card"
    : idType === "drivers_license" ? "Driver's License"
    : "Passport";

  return (
    <SafeAreaView style={styles.container}>
      <YStack marginLeft={28}>
        <ScreenHeader title="KYC" onBackPress={() => router.back()} />
      </YStack>

      <YStack flex={1} paddingHorizontal={20} paddingTop={16}>
        <Text style={styles.title}>
          {isPassport
            ? "Capture your passport"
            : currentSide === "front"
            ? `Front side of your ${readableId}`
            : `Back side of your ${readableId}`}
        </Text>

        {/* Camera */}
        <View style={styles.cameraBox}>
          <CameraView ref={cameraRef} style={styles.camera} facing="back" />
          <View style={styles.overlay} pointerEvents="none">
            <View style={styles.frameArea}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          </View>
          <Text style={styles.guideText}>
            Position your ID within the frame
          </Text>
        </View>

        <View style={styles.bottomArea}>
          <TouchableOpacity style={styles.captureBtn} onPress={handleCapture}>
            <Ionicons name="camera" size={28} color={colors.white} />
          </TouchableOpacity>
        </View>
      </YStack>
      <AlertModal
        visible={alertVisible}
        title="Error"
        message="Could not take picture. Try again."
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

const CORNER = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  cameraBox: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.black,
    marginBottom: 24,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  frameArea: {
    width: FRAME_WIDTH,
    height: FRAME_WIDTH / FRAME_RATIO,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: CORNER,
    height: CORNER,
    borderColor: colors.white,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 4,
  },
  guideText: {
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  bottomArea: {
    alignItems: "center",
    paddingVertical: 16,
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
