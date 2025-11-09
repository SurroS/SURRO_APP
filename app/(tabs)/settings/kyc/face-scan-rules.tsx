import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { YStack } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "@/components/auth";
import { useRouter } from "expo-router";

export default function KycFaceScanScreen() {
  const router = useRouter();
  const handleTakePicture = () => {
    router.push("/settings/kyc/face-scan");
  };

  return (
    <SafeAreaView style={styles.container}>
      <YStack marginLeft={28}>
        <ScreenHeader title="KYC" onBackPress={() => router.back()} />
      </YStack>

      <View style={styles.content}>
        <Text style={styles.title}>A quick scan of your face</Text>

        {/* Image area */}
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/goodcapture.png")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Instructions */}
        <Text style={styles.ensureText}>Ensure that</Text>

        <View style={styles.instruction}>
          <Ionicons name="checkmark-circle" size={22} color="#0DA94A" />
          <Text style={styles.instructionText}>
            You look straight ahead and your eyes are clearly visible
          </Text>
        </View>

        <View style={styles.instruction}>
          <Ionicons name="checkmark-circle" size={22} color="#0DA94A" />
          <Text style={styles.instructionText}>
            You take away anything that covers your face
          </Text>
        </View>
        <View style={styles.instruction}>
          <Ionicons name="checkmark-circle" size={22} color="#0DA94A" />
          <Text style={styles.instructionText}>have no face cap on</Text>
        </View>
        <View style={styles.instruction}>
          <Ionicons name="checkmark-circle" size={22} color="#0DA94A" />
          <Text style={styles.instructionText}>Image is not blury</Text>
        </View>
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
        <Ionicons name="camera-outline" size={18} color="#fff" />
        <Text style={styles.buttonText}>Take picture</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop:28
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0E0E55",
    marginBottom: 14,
  },
  imageContainer: {
    borderWidth: 2,
    borderColor: "#0055FF",
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
    width: "100%",
    aspectRatio: 1.4,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  ensureText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  instruction: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 10,
    flexShrink: 1,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#0E0E55",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
});
