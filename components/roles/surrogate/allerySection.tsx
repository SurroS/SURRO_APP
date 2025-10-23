import { FlatList } from "react-native";
import { Image, YStack } from "tamagui";

// Local images (replace or load dynamically later)
import {
  default as gallery1,
  default as gallery2,
  default as gallery3,
  default as gallery4,
} from "@/assets/images/emptyGallery.png";

// Sample array – replace with fetched URLs later
const galleryImages = [gallery1, gallery2, gallery3, gallery4];

const Galleryview = () => {
  return (
    <FlatList
      data={galleryImages}
      scrollEnabled={false}
      keyExtractor={(_, index) => index.toString()}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: 8,
      }}
      contentContainerStyle={{
        paddingVertical: 8,
      }}
      renderItem={({ item }) => (
        <YStack
          width="48%"
          height={220}
          borderRadius={12}
          overflow="hidden"
          marginBottom="$3"
        >
          <Image
            source={item}
            width="100%"
            height={'100%'}
          />
        </YStack>
      )}
    />
  );
};

export default Galleryview;
