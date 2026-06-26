import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import colors from "@/hooks/colors";
import { ImageCarousel } from "@/components/ImageCarousel";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import BioSection from "@/components/roles/BioSectionView";
import ContactSection from "@/components/roles/ContactSectionView";
import HeaderInfo from "@/components/roles/HeaderInfoSection";
import AgentPerformanceSection from "@/components/roles/agent/PerormanceSection";
import AgentAdditionalDetails from "@/components/roles/agent/AditionalDetails";
import AgentServices from "@/components/roles/agent/AgentServiceOffered";
import AgentCertifications from "@/components/roles/agent/AgentCertification";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";

export default function AgentGuestView() {
  const { agentProfile, fetchProfile, isLoading } = useAgentProfile();

  useEffect(() => {
    if (!agentProfile) {
      fetchProfile();
    }
  }, [agentProfile]);

  if (isLoading || !agentProfile) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const agent = agentProfile;
  const galleryUrls: string[] = Array.isArray(agent?._galleryUrls)
    ? agent._galleryUrls
    : Array.isArray(agent?.gallery)
    ? agent.gallery.map((g: any) => (typeof g === "string" ? g : g?.url)).filter(Boolean)
    : [];
  const hasGalleryImage = galleryUrls.length > 0 || !!agent?.profilePicture;

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Guest badge */}
          <View style={styles.guestBadge}>
            <Entypo name="eye" size={16} color="#fff" />
            <Text style={styles.guestBadgeText}>Guest View</Text>
          </View>

          {/* --- IMAGE CAROUSEL --- */}
          <View style={styles.carouselContainer}>
            {hasGalleryImage ? (
              <ImageCarousel images={[...(agent?.profilePicture ? [agent.profilePicture] : []), ...galleryUrls]} unlocked={true} />
            ) : (
              <View style={{ flex: 1, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#666", fontSize: 14 }}>Profile Picture</Text>
              </View>
            )}
          </View>

          {/* --- HEADER INFO --- */}
          <HeaderInfo
            name={agent?.userName || agent?.fullName || "Unnamed Agent"}
            username={agent?.userName || agent?.fullName || agent?.user?.email || "No Name"}
            location={agent?.country || "Unknown"}
            city={agent?.city || "N/A"}
            age={agent?.age || "N/A"}
            maritalStatus="N/A"
            height="N/A"
            weight="N/A"
            compensation={agent?.compensation || 0}
            isNegotiable={agent?.negotiable || false}
            onChatPress={() => {}}
            isUnlocked={true}
          />

          {/* --- ABOUT --- */}
          <BioSection
            title="About"
            content={agent?.about || "No description available."}
          />

          {/* --- PERFORMANCE --- */}
          <AgentPerformanceSection
            matches={agent?.performance?.successfulMatches || 0}
            rating={agent?.performance?.averageRating || 0}
            responseTime={agent?.performance?.responseTime || "N/A"}
            activeCases={agent?.performance?.activeCases || 0}
          />

          {/* --- ADDITIONAL DETAILS --- */}
          <AgentAdditionalDetails
            languages={agent?.languages || agent?.additionalDetails?.languages || []}
            experience={agent?.yearsOfExperience?.toString() || agent?.additionalDetails?.experience || "N/A"}
            coverage={agent?.coverageAreas || agent?.additionalDetails?.coverage || "N/A"}
          />

          {/* --- CONTACT INFO (always visible) --- */}
          <View style={styles.contactWrapper}>
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
                street: agent?.address ?? undefined,
                state: agent?.state ?? undefined,
                zip: agent?.zipcode ?? undefined,
                lGA: agent?.lga ?? undefined,
                relationship: agent?.emergencyContactRelationship ?? undefined,
                email: agent?.publicEmail ?? undefined,
              }}
            />
          </View>

          {/* --- SERVICES --- */}
          <AgentServices
            services={agent?.services || ["No services added yet"]}
          />

          {/* --- CERTIFICATIONS --- */}
          <AgentCertifications certifications={agent?.certifications || []} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  guestBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 12,
  },
  guestBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
