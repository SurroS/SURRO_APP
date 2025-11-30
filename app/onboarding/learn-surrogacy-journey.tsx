import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions} from "react-native";
import { Button, Text, View, YStack } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/hooks/colors";

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function LearnSurrogacyJourneyScreen() {
  const router = useRouter();
  const [playing, setPlaying] = useState(false);

  // The YouTube video ID from the provided link
  // https://www.youtube.com/watch?v=_7xX4zneH0M
  const videoId = "_7xX4zneH0M";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <YStack flex={1} paddingHorizontal="$4" paddingTop={20}>
        {/* Screen header */}
        <View marginLeft={28} marginBottom="$3">
          <ScreenHeader
            title="Learn Surrogacy Journey"
            onBackPress={() => router.back()}
          />
        </View>

        {/* Main content container */}
        <YStack flex={1} alignItems="center" justifyContent="flex-start" paddingTop="$4" gap="$3">
          {/* Header text: "Learn About the Surrogacy Journey" */}
          {/* Width: 317px, Height: 23px */}
          <Text
            width={350}
            height={23}
            fontSize="$5" // Using tamagui typography scale for Headings/Sub-heading/Size
            fontFamily="$heading" // Using tamagui heading font family
            fontWeight="600" // SemiBold
            lineHeight={23}
            textAlign="center"
            color="#212121" // var(--Text-Neutral-Primary, #212121)
            marginTop={63} // Positioning similar to 83px from top of screen
          >
            Learn About the Surrogacy Journey
          </Text>

          {/* Description text */}
          <Text
            width={353}
            height={60}
            fontSize="$4" // Using tamagui scale for Body/Small Base/Size
            fontFamily="$body" // Using tamagui body font family
            fontWeight="400" // Regular
            lineHeight={21} // 150% of 14px
            textAlign="center"
            color="#212121" // var(--Text-Neutral-Primary, #212121)
            marginTop={20}
          >
            Watch this short video to understand what it means to be a surrogate, the process, responsibilities, and support you'll receive along the way
          </Text>

          {/* YouTube video player */}
          {/* Container: Width: 353px, Height: 179px, Border-radius: 4px */}
          <View
            width={353}
            height={179}
            borderRadius={4}
            backgroundColor="#D3D3D3" // Default background color
            marginTop={20}
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
          >
            <YoutubePlayer
              height={179}
              width={353}
              videoId={videoId}
              play={playing}
              onChangeState={(state: any) => {
                if (state === "ended") setPlaying(false);
              }}
              style={{ borderRadius: 4 }}
            />
          </View>

          {/* Informational text */}
          <Text
            width={353}
            height={60}
            fontSize="$4" // Using tamagui scale for Body/Small Base/Size
            fontFamily="$body" // Using tamagui body font family
            fontWeight="400" // Regular
            lineHeight={21} // 150% of 14px
            textAlign="center"
            color="#212121" // var(--Text-Neutral-Primary, #212121)
            marginTop={20}
          >
            You can skip this for now; the video will be saved in your Resources for later
          </Text>

          {/* "Get started" button */}
          {/* Positioned at: width: 353px, height: 51px, border-radius: 8px */}
          <Button
            width={353}
            height={51}
            backgroundColor="#0E0E55" // Background color
            borderRadius={8}
            paddingHorizontal={24} // Large/H-padding/24
            paddingVertical={12}
            marginTop={100} // Adjusted to position appropriately in the layout
            // Using primary type button as specified
            theme="active"
            onPress={() => {
              // Navigate to editBio screen when "Get started" is pressed
              router.push("/(tabs)/home");
            }}
          >
            <Text
              fontSize="$5" // Using tamagui scale for Headings/Sub-heading/Size
              fontFamily="$body" // Using tamagui body font family
              fontWeight="400" // Regular
              lineHeight={27} // 150% of font size
              color="#FFFFFF" // var(--Text-Neutral-inverse-Primary, #FFFFFF)
            >
              Get started
            </Text>
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}