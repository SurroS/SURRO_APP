import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button } from "tamagui";
import colors from "@/hooks/colors";
import { ImageCarousel } from "@/components/ImageCarousel";
import { SafeAreaView } from "react-native-safe-area-context";

import { PaymentModal } from "@/components/payment";
import Entypo from "@expo/vector-icons/Entypo";
import BioSection from "@/components/roles/BioSectionView";
import ContactSection from "@/components/roles/ContactSectionView";
import HeaderInfo from "@/components/roles/HeaderInfoSection";
import AgentPerformanceSection from "@/components/roles/agent/PerormanceSection";
import AgentAdditionalDetails from "@/components/roles/agent/AditionalDetails";
import AgentServices from "@/components/roles/agent/AgentServiceOffered";
import AgentCertifications from "@/components/roles/agent/AgentCertification";
import EmptyWalletModal from "@/components/modals/EmptyWalletModal";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { router, useLocalSearchParams } from "expo-router";
import { AGENT_TRANSACTIONS } from "@/types/agentTransactionType";
import { getAgentById } from "@/services/profileApi"; 

const fallbackImages = [
  "https://picsum.photos/800/500",
  "https://picsum.photos/700/700",
  "https://picsum.photos/600/600",
];

export default function AgentProfileScreen() {
  const { id } = useLocalSearchParams();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const wallet = agent?.wallet;
  const transaction = AGENT_TRANSACTIONS.GET_SURROGATE;
  // -----------------------------
  // Fetch Agent
  // -----------------------------
  useEffect(() => {
    if (!id) return;
       console.log("OtherId from Profile Pre:", id);
    const fetchAgent = async () => {
      try {
        const res = await getAgentById(id as string);
        setAgent(res.data);
      } catch (err: any) {
        Toast.show({
          text1: "Failed to load agent",
          type: "customError" as ToastType,
          text2: err?.response?.data?.message || "Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  // -----------------------------
  // Payment Handlers
  // -----------------------------
  const handleTopUp = () => {
    setShowWalletModal(false);
    router.push("/(tabs)/home/walletFlow");
  };

const handleChat = () => {
  if (!id) {
    Toast.show({
      text1: "Cannot start chat",
      type: "customError" as ToastType,
      text2: "Agent ID missing",
    });
    return;
  }

  router.push({
    pathname: "/(tabs)/chat/[conversationId]",
    params: {
      otherUserId: id,
    },
  });
};

  const handlePayment = () => {
    if (wallet < transaction.amount) {
      setShowWalletModal(true);
      return;
    } else {
      setIsUnlocked(true);
      setShowPaymentModal(false);

      Toast.show({
        text1: "Payment successful",
        type: "customSuccess" as ToastType,
        text2: "You now have full access to agent data",
      });
    }
  };

  // -----------------------------
  // Loading State
  // -----------------------------
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading agent profile...</Text>
      </View>
    );
  }

  if (!agent) {
    return (
      <View style={styles.loaderContainer}>
        <Text> No Agent found..</Text>
      </View>
    );
  }

  // -----------------------------
  // Dynamic Images
  // -----------------------------
  const unlockedImages = agent?.gallery ? [agent.gallery] : fallbackImages;

  const lockedImages = fallbackImages;

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- IMAGE CAROUSEL --- */}
          <View style={styles.carouselContainer}>
            <ImageCarousel
              images={isUnlocked ? unlockedImages : lockedImages}
              unlocked={isUnlocked}
            />
          </View>

          {/* --- HEADER INFO --- */}
          <HeaderInfo
            name={agent?.fullName || "Unnamed Agent"}
            username={agent?.userName || "No Username"}
            location={agent?.country || "Unknown"}
            city={agent?.city || "N/A"}
            age={agent?.age || "N/A"}
            maritalStatus="N/A"
            height="N/A"
            weight="N/A"
            compensation={agent?.compensation || 0}
            isNegotiable={agent?.negotiable || false}
            onChatPress={() => {
              if (!isUnlocked) {
                setShowPaymentModal(true);
                return;
              }
              handleChat();
            }}
            isUnlocked={isUnlocked}
          />

          {/* --- ABOUT --- */}
          <BioSection
            title="About"
            content={agent?.about || "No description available."}
          />

          {/* --- PERFORMANCE --- */}
          <AgentPerformanceSection
            matches={agent?.performance?.matches || 0}
            rating={agent?.performance?.rating || 0}
            responseTime={agent?.performance?.responseTime || "N/A"}
            activeCases={agent?.performance?.activeCases || 0}
          />

          {/* --- ADDITIONAL DETAILS --- */}
          <AgentAdditionalDetails
            languages={agent?.additionalDetails?.languages || []}
            experience={agent?.additionalDetails?.experience || "N/A"}
            coverage={agent?.additionalDetails?.coverage || "N/A"}
          />

          {/* --- CONTACT INFO --- */}
          <View style={styles.contactWrapper}>
            {isUnlocked ? (
              <ContactSection
                data={{
                  country: agent?.country || "N/A",
                  phone1: agent?.phone1 || "N/A",
                  phone2: agent?.phone2 || "N/A",
                  emergency: agent?.emergencyPhone || "N/A",
                  social: {
                    Facebook: agent?.facebookProfile,
                    Instagram: agent?.instagramProfile,
                    X: agent?.twitterProfile,
                  },
                }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setShowPaymentModal(true)}
                style={styles.lockedContact}
              >
                <Text style={styles.lockedText}>
                  Contact information is locked
                </Text>
                <Entypo name="lock" size={18} color="gray" />
              </TouchableOpacity>
            )}
          </View>

          {/* --- SERVICES --- */}
          <AgentServices
            services={agent?.services || ["No services added yet"]}
          />

          {/* --- CERTIFICATIONS --- */}
          <AgentCertifications certifications={agent?.certifications || []} />
        </ScrollView>

        {/* WALLET MODAL */}
        <EmptyWalletModal
          visible={showWalletModal}
          onClose={() => setShowWalletModal(false)}
          onTopUp={handleTopUp}
        />

        {/* PAYMENT MODAL */}
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        >
          <Text style={styles.paymentDescription}>
            To start a conversation with this agent, you need to pay N50,000
          </Text>

          <Button style={styles.payButton} onPress={handlePayment}>
            Pay N50,000 to unlock
          </Button>
        </PaymentModal>
      </SafeAreaView>
    </View>
  );
}

// -----------------------------
// STYLES
// -----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  carouselContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },

  contactWrapper: { marginVertical: 20 },
  lockedContact: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    alignItems: "center",
  },
  lockedText: { color: "gray", fontSize: 14 },

  paymentDescription: {
    textAlign: "center",
    color: "#444",
    marginBottom: 12,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
