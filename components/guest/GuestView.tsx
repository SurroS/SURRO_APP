// components/guess/GuessView.tsx
import { useRouter } from "expo-router";
import { ScrollView, Pressable } from "react-native";
import { Text, YStack } from "tamagui";

// Components
import AboutSection from "@/components/guest/AboutSection";
import Contact from "@/components/roles/contact";
import ProfileData from "@/components/roles/profile-data";
import GallerySection from "../roles/surrogate/allerySection";

const GuessView = () => {
  const router = useRouter();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <YStack
        flex={1}
        backgroundColor="$background"
        paddingHorizontal={20}
        paddingTop={12}
        gap="$4"
      >
        {/* Profile Sections */}
        <ProfileData />
        <AboutSection />
        <Contact />

        {/* Gallery Section */}
        <YStack gap="$3" paddingVertical="$2">
          <Pressable onPress={()=>router.back()}>
          <Text color="$text" fontWeight="600" textDecorationLine="underline">
            Back to default view
          </Text>
          </Pressable>
          <GallerySection />
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default GuessView;
