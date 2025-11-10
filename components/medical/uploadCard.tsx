import React, { useState,useEffect } from "react";
import { YStack, XStack, Text, Button, View } from "tamagui";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { FilePreviewCard } from "@/components/medical/FilePreview";

type UploadCardProps = {
  label: string;
  onFileSelect: (file: any) => void;
  file?: any;
};

const StyledUploadCard = ({ label, onFileSelect, file }: UploadCardProps) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });
      if (result.canceled) return;
      startUpload(result.assets[0]);
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
      startUpload(result.assets[0]);
    }
  };

  const startUpload = (file: any) => {
    onFileSelect(file);
    setProgress(0);
    setUploading(true);
  };

  // Simulate upload progress
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>; 
    if (uploading && progress < 100) {
      timer = setInterval(() => {
        setProgress((p) => {
          const next = p + Math.random() * 15; // add random increment
          if (next >= 100) {
            clearInterval(timer);
            setUploading(false);
            return 100;
          }
          return next;
        });
      }, 400);
    }
    return () => clearInterval(timer);
  }, [uploading, progress]);

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
        {!file ? (
          <>
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
          </>
        ) : (
          <FilePreviewCard
            file={file}
            progress={progress}
            onRemove={() => onFileSelect(null)}
          />
        )}
      </View>
    </YStack>
  );
};

export default StyledUploadCard;