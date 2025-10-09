import { ScrollView, StyleSheet } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import About from "../about";
import Contact from "../contact";
import Gallery from "../gallery";
import ProfileData from "../profile-data";
import Referral from "../referral";
import WalletCard from "../wallet";
import ProgressMeter from "../progressCircle"

export default function SurrogateScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <YStack flex={1}  gap="$3">
        <ProfileData />
        <About />
        <Contact />

        <Text
          color="black"
          fontWeight="bold"
          textDecorationLine="underline"
          textDecorationColor="#0E0E55"
          marginBottom={8}
        >
          View profile as guest
        </Text>

        {/* Floating Card Section */}
        <XStack
          flexWrap="wrap"
          justifyContent="flex-end"
          alignContent="flex-start"
          gap={10}
        >
          <YStack width={"48%"} gap={10}>
            <WalletCard style={{ width: "100%", height: 120 }} />
            <ProgressMeter style={{ width: "100%", height: 210 }} />
          </YStack>
          <YStack width={"48%"} gap={10}>
            <Gallery style={{ width: "100%", height: 210 }} />
            <Referral style={{ width: "100%", height: 160 }} />
          </YStack>

          
        </XStack>
      </YStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  walletCard: {
    width: "48%", // takes almost half width
    height: 160,
  },
  galleryCard: {
    width: "48%",
    height: 220,
  },
  referralCard: {
    width: "48%",
    height: 120,
  },
});
