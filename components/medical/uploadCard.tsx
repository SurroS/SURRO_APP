import React from "react";
import { YStack, Text, Button, View } from "tamagui";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

type UploadCardProps = {
  label: string;
  onFileSelect: (file: any) => void;
  file?: any;
};

const StyledUploadCard = ({ label, onFileSelect, file }: UploadCardProps) => {
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
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      onFileSelect(result.assets[0]);
    }
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
          Upload
        </Button>
      </View>
    </YStack>
  );
};

export default StyledUploadCard;
