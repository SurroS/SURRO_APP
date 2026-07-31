import React, { useRef, useState } from "react";
import {
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { View, Text, XStack } from "tamagui";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  images: string[];
  unlocked: boolean;
}

const SCREEN_WIDTH = Dimensions.get("window").width;

export function ImageCarousel({ images, unlocked }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  // full screen image modal
  const [viewerVisible, setViewerVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const handleScroll = (e: any) => {
    const position = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setPage(position);
  };

  const openFullScreen = (index: number) => {
    if (!unlocked) return; // locked users cannot view
    setActiveImage(index);
    setViewerVisible(true);
  };

  return (
    <View style={styles.container}>
      {!unlocked && (
        <View
          backgroundColor={"transparent"}
          position={"absolute"}
          justifyContent="center"
          alignItems="center"
          zIndex={999}
        >
          <Ionicons name="lock-closed" size={30} color="#ffffff" />
          <Text style={styles.unlockText}>Unlock to view gallery</Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
      >
        {images.map((uri, index) => (
          <Pressable
            key={index}
            style={styles.imageWrapper}
            onPress={() => openFullScreen(index)}
          >
            <Image
              source={typeof uri === "string" ? { uri } : uri}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.bottomOverlay} />

            {!unlocked && (
              <BlurView
                intensity={100}
                tint="dark"
                style={styles.blurOverlay}
              />
            )}
          </Pressable>
        ))}
      </ScrollView>

      <XStack style={styles.pagination}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, { opacity: page === i ? 1 : 0.3 }]}
          />
        ))}
      </XStack>

      {/* --- Fullscreen Image Viewer --- */}
      <ImageViewing
        images={images.map((item) =>
          typeof item === "string" ? { uri: item } : item
        )}
        imageIndex={activeImage}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        HeaderComponent={() => (
          <SafeAreaView
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 16,
              paddingTop: 6,
            }}
          >
            <Pressable
              onPress={() => setViewerVisible(false)}
              style={{
                padding: 6,
                borderRadius: 100,
                backgroundColor: "rgba(0,0,0,0.45)",
              }}
            >
              <Text style={{ fontSize: 26, color: "#fff", fontWeight: "600" }}>
                ✕
              </Text>
            </Pressable>
          </SafeAreaView>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: "100%",
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  bottomOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  blurOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  unlockText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 12,
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    marginHorizontal: 4,
  },
});
