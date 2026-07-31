import React, { useState } from "react";
import { XStack, YStack, Text, Image, View } from "tamagui";
import { Bookmark, Download } from "@tamagui/lucide-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { router } from "expo-router";

type ResourceCardProps = {
  title: string;
  author: string;
  category: string;
  categoryColor?: string;
  thumbnail?: string;
  type?: "video" | "pdf" | "article";
  bookmarked?: boolean;
  videoId?: string; // For YouTube
  sourceUrl?: string; // For PDFs or links
  onBookmark?: () => void;
};

const ResourceCard = ({
  title,
  author,
  category,
  categoryColor = "#E8E8E8",
  thumbnail,
  type = "article",
  bookmarked = false,
  videoId,
  sourceUrl,
  onBookmark,
}: ResourceCardProps) => {
  const [playing, setPlaying] = useState(false);

  // ✅ Open PDFs inside the app
  const handleOpenPDF = () => {
    if (sourceUrl) {
      router.push({
        pathname: "/resources/documentViewer",
        params: { url: sourceUrl, title },
      });
    }
  };

  return (
    <YStack
      borderRadius="$5"
      overflow="hidden"
      backgroundColor="#FFF"
      shadowColor="#000"
      shadowOpacity={0.05}
      shadowRadius={5}
      shadowOffset={{ width: 0, height: 2 }}
      marginBottom="$4"
    >
      {/* Thumbnail / Video / PDF */}
      <View width="100%" height={180} backgroundColor="#EEE">
        {type === "video" && videoId ? (
          <YoutubePlayer
            height={180}
            videoId={videoId}
            play={playing}
            onChangeState={(state: any) => {
              if (state === "ended") setPlaying(false);
            }}
          />
        ) : type === "pdf" ? (
          <YStack
            alignItems="center"
            justifyContent="center"
            flex={1}
            onPress={handleOpenPDF}
          >
            <Text fontSize={50}>📄</Text>
            <Text color="#666" fontSize={13}>
              Tap to open PDF
            </Text>
          </YStack>
        ) : (
          <Image
            source={{ uri: thumbnail }}
            width="100%"
            height="100%"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Details */}
      <YStack padding="$3" gap="$2">
        <Text fontWeight="700" color="#000" fontSize={15}>
          {title}
        </Text>
        <Text fontSize={13} color="#666">
          {author}
        </Text>

        <XStack justifyContent="space-between" alignItems="center">
          <Text
            backgroundColor={categoryColor}
            color="#000"
            paddingHorizontal={10}
            paddingVertical={3}
            borderRadius={10}
            fontSize={12}
          >
            {category}
          </Text>

          <XStack gap="$3">
            <Bookmark
              size={18}
              color={bookmarked ? "#0A043C" : "#AAA"}
              fill={bookmarked ? "#0A043C" : "#f8f7f7ff"}
              onPress={onBookmark}
            />
            {type === "pdf" && (
              <Download size={18} color="#AAA" onPress={handleOpenPDF} />
            )}
          </XStack>
        </XStack>
      </YStack>
    </YStack>
  );
};

export default ResourceCard;
