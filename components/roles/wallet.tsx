import { Wallet, Eye, EyeOff } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, XStack, YStack, View } from "tamagui";
import { useAuth } from "@/hooks/useAuth";
import { useSurrogateProfile } from "@/hooks/profile/useSurrogateProfile";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";
import { useParentProfile } from "@/hooks/profile/useParentProfile";
import { useWalletStore } from "@/store/wallet/walletStore";
import { useMemo, useState, useEffect } from "react";

const WalletCard = ({ style }: { style?: any }) => {
  const { user } = useAuth();
  const role = user?.role;

  const { surrogateProfile } = useSurrogateProfile();
  const { agentProfile } = useAgentProfile();
  const { parentProfile } = useParentProfile();

  const storeBalance = useWalletStore((s) => s.balance);
  const storeCurrency = useWalletStore((s) => s.currency);
  const lastUpdatedAt = useWalletStore((s) => s.lastUpdatedAt);
  const fetchBalance = useWalletStore((s) => s.fetchBalance);

  const [hidden, setHidden] = useState(true);

  const profileWallet = useMemo(() => {
    if (role === "SURROGATE") return surrogateProfile?.wallet;
    if (role === "AGENT") return agentProfile?.wallet;
    if (role === "INTENDED_PARENT") return parentProfile?.wallet;
    return null;
  }, [role, surrogateProfile, agentProfile, parentProfile]);

  const storeFetched = !!lastUpdatedAt;
  const balance = storeFetched
    ? storeBalance
    : (profileWallet?.balance ?? 0);
  const currency = storeFetched
    ? storeCurrency
    : (profileWallet?.currency ?? "NGN");

  useEffect(() => {
    if (user?.id) {
      fetchBalance(user.id);
    }
  }, [user?.id]);

  const displayBalance = hidden
    ? "******"
    : `${currency} ${Number(balance).toFixed(2)}`;

  const isLoading = !user;

  return (
    <Link href="/walletFlow" asChild>
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
            style={styles.bg}
          >
            <YStack alignItems="center" gap="$2">
              <XStack alignItems="center" gap="$2">
                <Wallet size={18} color="white" />
                <Text fontSize="$4" fontWeight="600" color="white">
                  Wallet
                </Text>
              </XStack>

              {isLoading ? (
                <View style={styles.skeleton} />
              ) : (
                <Text fontSize="$4" fontWeight="800" color="white">
                  {displayBalance}
                </Text>
              )}

              {!isLoading && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setHidden((v) => !v);
                  }}
                >
                  {hidden ? (
                    <EyeOff size={18} color="white" />
                  ) : (
                    <Eye size={18} color="white" />
                  )}
                </TouchableOpacity>
              )}

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
  bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  skeleton: {
    width: 120,
    height: 32,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
});
