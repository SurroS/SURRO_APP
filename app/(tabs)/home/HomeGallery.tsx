// app/home/HomeGallery.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Text, XStack, YStack } from "tamagui";

export default function HomeGallery() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 40,
      }}
    >
      {/* Header */}
      <XStack
        alignItems="center"
        marginBottom={20}
        width="100%"
        justifyContent="space-between"
      >
        {/* Left Back Button */}
        <XStack width={40} alignItems="center" justifyContent="flex-start">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#737373" />
          </TouchableOpacity>
        </XStack>

        {/* Title */}
        <Text
          fontSize={20}
          fontFamily="Figtree"
          fontWeight="700"
          flex={1}
          textAlign="center"
          color="black"
        >
          Gallery
        </Text>

        {/* Right Placeholder */}
        <XStack width={40} />
      </XStack>

      {/* Body */}
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        marginTop="$4"
      >
        {/* Add Image Block */}
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
          // ✅ navigate correctly to GalleryScreen
          onPress={() => router.push("/home/GalleryScreen")}
        >
          <Ionicons name="add-circle" size={60} color="#0E0E55" />
          <Text
            fontSize={14}
            marginTop={6}
            color="black"
            fontFamily="Figtree"
            fontWeight="400"
          >
            Add image
          </Text>
        </TouchableOpacity>
      </YStack>
    </View>
  );
}
