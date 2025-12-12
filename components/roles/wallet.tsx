import colors from "@/hooks/colors";
import { Wallet } from "@tamagui/lucide-icons";
import { Link } from "expo-router"; // 1. Import Link
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, XStack, YStack } from "tamagui";

 

const WalletCard = ({ style }: any) => {
  return ( 
    <Link
      href="/home/walletFlow"
      asChild  
    >
      <TouchableOpacity activeOpacity={0.85} style={{ flex: 1 }}>
        <Card
          bordered
          overflow="hidden"
          borderRadius="$4"
          style={[style, styles.card]}
        >
          <ImageBackground
            source={require("../../assets/images/wallet_Bg.png")}
            resizeMode="cover"
            style={{
              flex: 1,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <YStack alignItems="center" gap="$2">
              {/* Header */}
              <XStack alignItems="center" gap="$2">
                <Wallet size={18} color="white" />
                <Text fontSize="$4" fontWeight="600" color="white">
                  Surro Wallet
                </Text>
              </XStack>

              {/* Balance */}
              <Text fontSize="$5" fontWeight="800" color="white">
                $40,000
              </Text>

              {/* Label */}
              <Text
                fontSize="$3"
                color="white"
                opacity={0.9}
                letterSpacing={0.5}
                textTransform="uppercase"
              >
                Total Balance
              </Text>
            </YStack>
          </ImageBackground>
        </Card>
      </TouchableOpacity>
    </Link>
  );
};

export default WalletCard;

const styles = StyleSheet.create({
  card: {
    height: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
