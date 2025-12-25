import { Wallet, Eye, EyeOff } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, XStack, YStack, View } from "tamagui";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useParentProfile } from "@/hooks/useParent";
import { useAgentProfile } from "@/hooks/useAgentProfile";
import { useEffect, useState, useMemo } from "react";
import colors from "@/hooks/colors";

const WalletCard = ({ style }: { style?: any }) => {
  const { user } = useAuth();
  const { surrogateProfile, fetchProfile: fetchSurrogate } = useProfile();
  const { parentProfile, fetchParentProfile } = useParentProfile();
  const { agentProfile, fetchAgentProfile } = useAgentProfile();

  const [hidden, setHidden] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch profile depending on role
  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      console.log("[WalletCard] User role:", user.role);

      if (user.role === "SURROGATE") {
        if (!surrogateProfile) {
          console.log("[WalletCard] Fetching surrogate profile...");
          await fetchSurrogate();
        }
      } else if (user.role === "INTENDED_PARENT") {
        if (!parentProfile) {
          console.log("[WalletCard] Fetching parent profile...");
          await fetchParentProfile();
        }
      } else if (user.role === "AGENT") {
        if (!agentProfile) {
          console.log("[WalletCard] Fetching agent profile...");
          await fetchAgentProfile();
        }
      }

      setLoadingProfile(false);
    }

    loadProfile();
  }, [user]);

  // Compute balance dynamically based on role
  const { currency, balance, source } = useMemo(() => {
    if (!user) return { currency: "USD", balance: 0, source: "none" };

    let bal = 0;
    let curr = "USD";
    let src = "user";

    if (user.role === "SURROGATE" && surrogateProfile?.wallet) {
      bal = surrogateProfile.wallet.balance;
      curr = surrogateProfile.wallet.currency || "USD";
      src = "surrogateProfile";
      console.log(`[WalletCard] walletData `, surrogateProfile?.wallet);
    } else if (user.role === "INTENDED_PARENT" && parentProfile?.wallet) {
      bal = parentProfile.wallet.balance;
      curr = parentProfile.wallet.currency || "USD";
      src = "parentProfile";
      console.log(`[WalletCard] walletData `, parentProfile?.wallet);
    } else if (user.role === "AGENT" && agentProfile?.wallet) {
      bal = agentProfile.wallet.balance;
      curr = agentProfile.wallet.currency || "USD";
      src = "agentProfile";
      console.log(`[WalletCard] walletData `, agentProfile?.wallet);
    }

    console.log(`[WalletCard] Balance fetched from ${src}: ${curr} ${bal}`);

    console.log(`[WalletCard] User walletData `, user?.wallet);

    return { currency: curr, balance: bal, source: src };
  }, [user, surrogateProfile, parentProfile, agentProfile]);

  const displayBalance = hidden
    ? "******"
    : `${currency} ${balance.toFixed(2)}`;
  const isLoading = !user || loadingProfile;

  const handleToggleHidden = (e: any) => {
    e.stopPropagation();
    setHidden(!hidden);
  };

  return (
    <Link href="/home/walletFlow" asChild>
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
                  Surro Wallet
                </Text>
              </XStack>

              {isLoading ? (
                <View style={styles.skeleton} />
              ) : (
                <Text fontSize="$5" fontWeight="800" color="white">
                  {displayBalance}
                </Text>
              )}

              {!isLoading && (
                <TouchableOpacity onPress={handleToggleHidden}>
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
