import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions } from "react-native";
import { Button, Text, View, YStack } from "tamagui";
import { PrimaryButton, ScreenHeader } from "@/components/auth";
import YoutubePlayer from "react-native-youtube-iframe";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "@/hooks/colors";

export default function LearnSurrogacyJourneyScreen() {
  const router = useRouter();
  const [playing, setPlaying] = useState(false);

  const videoId = "_7xX4zneH0M";

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <YStack flex={1} padding={20}>
        <ScreenHeader onBackPress={() => router.back()} />

        {/* Main content container */}
        <YStack flex={1} alignItems="center"  gap="$6">
          <Text
            fontSize="$5"
            fontWeight="600"
            textAlign="center"
            color={colors.text}
          >
            Learn About the Surrogacy Journey
          </Text>

          {/* Description text */}
          <Text
            fontSize="$4"
            fontFamily="$body"
            fontWeight="400"
            textAlign="center"
            color={colors.text}
            marginTop={20}
          >
            Watch this short video to understand what it means to be a
            surrogate, the process, responsibilities, and support you'll receive
            along the way
          </Text>

          {/* YouTube video player */}
          <View
            height={"27%"}
            width={"100%"}
            borderRadius={4}
            backgroundColor="#D3D3D3" // Default background color
            marginTop={20}
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
          >
            <YoutubePlayer
              height={"100%"}
              width={"100%"}
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
            fontSize="$4" // Using tamagui scale for Body/Small Base/Size
            fontFamily="$body" // Using tamagui body font family
            fontWeight="400"
            textAlign="center"
            color={colors.text}
            marginTop={20}
          >
            You can skip this for now; the video will be saved in your Resources
            for later
          </Text>

          {/* "Get started" button */}
          <PrimaryButton
            style={{ width: "100%" }}
            title="Get started"
            onPress={() => {
              router.push("/(tabs)/home");
            }}
          />
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
