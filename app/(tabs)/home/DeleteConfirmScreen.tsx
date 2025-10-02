import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Button, Card, Text, XStack, YStack } from "tamagui";

export default function DeleteConfirmScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleConfirmDelete = () => {
    setDeleteSuccess(true);
    setTimeout(() => {
      setDeleteSuccess(false);
      router.back(); // Go back to Gallery after success
    }, 1500);
  };

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="#fff">
      <Card
        elevate
        bordered
        width="90%"
        height={200}
        alignItems="center"
        justifyContent="center"
        backgroundColor="#fff"
      >
        <Text fontSize={18} fontWeight="bold">
          Delete image {id}?
        </Text>
        <Text fontSize={14} color="gray">
          This action cannot be undone.
        </Text>

        {/* Action Buttons */}
        <XStack space="$4" marginTop="$4">
          <Button backgroundColor="#ccc" onPress={() => router.back()}>
            Cancel
          </Button>
          <Button backgroundColor="#ff4d4f" onPress={handleConfirmDelete}>
            Delete
          </Button>
        </XStack>
      </Card>

      {/* Delete Success Popup */}
      {deleteSuccess && (
        <YStack
          position="absolute"
          bottom={100}
          alignSelf="center"
          padding="$3"
          backgroundColor="green"
          borderRadius="$4"
        >
          <Text color="#fff">✅ Image Deleted Successfully</Text>
        </YStack>
      )}
    </YStack>
  );
}
