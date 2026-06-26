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
  const { idType } = params;

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturedFront, setCapturedFront] = useState<string | null>(null);
  const [capturedBack, setCapturedBack] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [step, setStep] = useState<"front" | "back">("front");

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (step === "front") {
        setCapturedFront(photo.uri);
        if (idType === "passport") {
          router.push({
            pathname: "/kyc/preview",
            params: { idType, frontUri: photo.uri },
          });
        } else {
          setStep("back");
        }
      } else {
        setCapturedBack(photo.uri);
        router.push({
          pathname: "/kyc/preview",
          params: { idType, frontUri: capturedFront || "", backUri: photo.uri },
        });
      }
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
    : idType === "drivers_license" ? "Driver’s License"
    : "Passport";

  const isPassport = idType === "passport";

  return (
    <SafeAreaView style={styles.container}>
      <YStack marginLeft={28}>
        <ScreenHeader title="KYC" onBackPress={() => router.back()} />
      </YStack>

      <YStack flex={1} paddingHorizontal={20} paddingTop={16}>
        {/* Step indicator */}
        {!isPassport && (
          <View style={styles.stepRow}>
            {["front", "back"].map((s, i) => (
              <React.Fragment key={s}>
                <View style={[
                  styles.dot,
                  (step === s || (step === "back" && i === 0)) && styles.dotActive,
                ]} />
                {i === 0 && (
                  <View style={[styles.line, step === "back" && styles.lineActive]} />
                )}
              </React.Fragment>
            ))}
          </View>
        )}

        <Text style={styles.title}>
          {isPassport
            ? "Capture your passport"
            : step === "front"
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

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 48,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 6,
  },
  lineActive: {
    backgroundColor: colors.primary,
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
