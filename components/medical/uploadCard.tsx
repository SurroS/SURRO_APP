import React, { useState } from "react";
import { YStack, Text, Button, View } from "tamagui";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import ImageCropperModal from "@/components/ImageCropperModal";

type UploadCardProps = {
  label: string;
  onFileSelect: (file: any) => void;
  file?: any;
  isReupload?: boolean;
};

const StyledUploadCard = ({ label, onFileSelect, file, isReupload }: UploadCardProps) => {
  const [cropperImageUri, setCropperImageUri] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });
      if (result.canceled) return;
      onFileSelect(result.assets[0]);
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      alert("Permission needed to access gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setCropperImageUri(result.assets[0].uri);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedUri: string) => {
    onFileSelect({ uri: croppedUri, type: "image/jpeg", name: "cropped.jpg" });
    setShowCropper(false);
    setCropperImageUri(null);
  };

  const handleCropperCancel = () => {
    setShowCropper(false);
    setCropperImageUri(null);
  };

  return (
    <YStack gap="$2">
      <Text fontWeight="600" fontSize={16} color="#000">
        {label}
      </Text>

      <View
        borderWidth={1}
        borderColor="#D9D9D9"
        borderRadius="$6"
        padding="$4"
        alignItems="center"
        justifyContent="center"
        backgroundColor="#FAFAFA"
        minHeight={140}
      >
        <Text textAlign="center" color="#555">
          Maximum size per file is 5MB
        </Text>
        <Text textAlign="center" color="#999" fontSize={13}>
          File format: PDF / Image
        </Text>
        <Button
          backgroundColor="#E9E2F7"
          color="#4A00E0"
          marginTop="$3"
          onPress={handlePickFile}
        >
          {isReupload ? "Reupload" : "Upload"}
        </Button>
      </View>

      <ImageCropperModal
        visible={showCropper}
        imageUri={cropperImageUri || ""}
        onCrop={handleCropComplete}
        onCancel={handleCropperCancel}
      />
    </YStack>
  );
};

export default StyledUploadCard;
