// import { ChevronDown } from "@tamagui/lucide-icons";
// import { useState, useEffect } from "react";
// import { ScrollView, StyleSheet, Pressable } from "react-native";
// import Animated from "react-native-reanimated";
// import { Accordion, Text, View, XStack, YStack } from "tamagui";
// import { Toast } from "toastify-react-native";
// import { ToastType } from "toastify-react-native/utils/interfaces";

// import About from "../about";
// import Contact from "../contact";
// import ProfileData from "./AgentProfileData";
// import ProgressMeter from "../progressCircle";
// import Referral from "../referral";
// import WalletCard from "../wallet";
// import SurrogatePreview from "../surrogate/SurrogatePreview";
// import { router } from "expo-router";
// import { useSurrogateStore } from "@/store/surrogates";

// /** Generic error boundary for safe rendering */
// function SafeRender({
//   children,
//   fallback,
// }: {
//   children: React.ReactNode;
//   fallback: React.ReactNode;
// }) {
//   try {
//     return children;
//   } catch (e) {
//     console.error("SafeRender caught an error:", e);
//     return fallback;
//   }
// }

// export default function AgentsScreen() {
//   const { surrogates, isLoading, fetchSurrogates } = useSurrogateStore();

//   useEffect(() => {
//     fetchSurrogates(true).catch((err: any) => {
//       Toast.show({
//         text1: "Failed to load surrogates",
//         type: "customError" as ToastType,
//         text2: err?.response?.data?.message || "Please try again.",
//       });
//     });
//   }, [fetchSurrogates]);

//   const validSurrogates =
//     Array.isArray(surrogates) && surrogates.length > 0
//       ? surrogates.filter((s) => s && s.avatar)
//       : [];

//   const displayAvatars =
//     validSurrogates.length > 0
//       ? validSurrogates.slice(0, 3).map((s) => s.avatar)
//       : [require("@/assets/images/emptyGallery.png")];

//   const handleNavigate = () => {
//     router.push({
//       pathname: "/(tabs)/home/surrogate/surrogateList",
//       params: {
//         surrogates: JSON.stringify(validSurrogates),
//       },
//     });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled>
//       <YStack flex={1} gap="$3">
//         {/* Profile */}
//         <SafeRender fallback={<Text>Loading profile...</Text>}>
//           <ProfileData />
//         </SafeRender>

//         {/* Accordion Section */}
//         <Accordion
//           type="single"
//           collapsible
//           borderTopStartRadius={10}
//           borderTopEndRadius={10}
//           overflow="hidden"
//         >
//           <Accordion.Item value="profile-info">
//             <AccordionTriggerWithChevron title="Profile Information" />
//             <Accordion.Content backgroundColor="white" padding="$3">
//               <YStack gap="$3">
//                 <SafeRender fallback={<Text>Loading about info...</Text>}>
//                   <About />
//                 </SafeRender>

//                 <SafeRender fallback={<Text>Loading contact info...</Text>}>
//                   <Contact />
//                 </SafeRender>
//               </YStack>
//             </Accordion.Content>
//           </Accordion.Item>
//         </Accordion>

//         {/* Horizontal scroll - must have fixed height */}
//         <ScrollView horizontal nestedScrollEnabled style={{ height: 210 }}>
//           <SafeRender fallback={<Text>Loading surrogates...</Text>}>
//             <Pressable onPress={handleNavigate} style={{ marginRight: 5 }}>
//               <SurrogatePreview
//                 style={{ height: 200, padding: 2, width: 150 }}
//               />
//             </Pressable>
//             {/* <View marginRight={5}>
//               <ClinicPreview
//                 style={{ height: 200, padding: 2, width: 150 }}
//               />
//             </View>
//             <View marginRight={5}>
//               <EggDonorsPreview
//                 style={{ height: 200, padding: 2, width: 150 }}
//               />
//               <View marginRight={5}>
//               <SpermDonorsPreview
//                 style={{ height: 200, padding: 2, width: 150 }}
//               />
//             </View> */}
//           </SafeRender>
//         </ScrollView>

//         {/* Floating Cards */}
//         <XStack
//           flexWrap="wrap"
//           justifyContent="flex-end"
//           alignContent="flex-start"
//           gap={10}
//         >
//           <YStack width={"48%"} gap={10}>
//             <SafeRender fallback={<Text>Loading wallet...</Text>}>
//               <WalletCard style={{ width: "100%", height: 100 }} />
//             </SafeRender>
//           </YStack>

//           <YStack width={"48%"} gap={10}>
//             <SafeRender fallback={<Text>Loading referral...</Text>}>
//               <Referral style={{ width: "100%", height: 160 }} />
//             </SafeRender>
//           </YStack>

//           <SafeRender fallback={<Text>Loading progress...</Text>}>
//             <ProgressMeter
//               progress={0}
//               style={{ width: "100%", height: 210 }}
//             />
//           </SafeRender>
//         </XStack>
//       </YStack>
//     </ScrollView>
//   );
// }

// /** Accordion Trigger with Animated Chevron */
// function AccordionTriggerWithChevron({ title }: { title: string }) {
//   return (
//     <Accordion.Trigger
//       backgroundColor="#0E0E55"
//       paddingVertical="$2"
//       paddingHorizontal="$4"
//       alignItems="center"
//       justifyContent="space-between"
//       height={48}
//     >
//       {({ open }: { open?: boolean }) => (
//         <XStack alignItems="center" justifyContent="space-between" width="100%">
//           <XStack alignItems="center" gap={"$11"}>
//             <Text color="white" fontWeight="700" fontSize="$5">
//               {title}
//             </Text>
//             <Animated.View
//               style={{
//                 transform: [{ rotate: open ? "180deg" : "0deg" }],
//               }}
//             >
//               <ChevronDown color="white" size={25} />
//             </Animated.View>
//           </XStack>
//         </XStack>
//       )}
//     </Accordion.Trigger>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingBottom: 40,
//   },
// });



import { ChevronDown } from "@tamagui/lucide-icons";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { Accordion, Text, View, XStack, YStack } from "tamagui";

import About from "../about";
import Contact from "../contact";
import ProfileData from "./AgentProfileData"; // <-- changed
import ProgressMeter from "../progressCircle";
import Referral from "../referral";
import WalletCard from "../wallet";
// import ParentPreviewCard from "../parent/ParentPreviewCard"; // <-- new
import AgentPreview from "../agent/AgentPreviewCard";
import SurrogatePreview from "../surrogate/SurrogatePreview";
import { router } from "expo-router";

/** Safe render wrapper */
function SafeRender({ children, fallback }: any) {
  try {
    return children;
  } catch (e) {
    console.error("SafeRender caught:", e);
    return fallback;
  }
}

export default function AgentHomeScreen() {

  const ViewParents = () => {
    router.push({
      pathname: "/(tabs)/home/parent/parentsListScreen",
    });
  };

  const ViewAgents = () => {
    router.push({
      pathname: "/(tabs)/home/agent/agentsListScreen",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled>
      <YStack flex={1} gap="$3">
        
        {/* AGENT PROFILE SECTION */}
        <SafeRender fallback={<Text>Loading profile...</Text>}>
          <ProfileData />
        </SafeRender>

        {/* PROFILE INFO ACCORDION */}
        <Accordion
          type="single"
          collapsible
          borderTopStartRadius={10}
          borderTopEndRadius={10}
          overflow="hidden"
        >
          <Accordion.Item value="profile-info">
            <AccordionTriggerWithChevron title="Profile Information" />
            <Accordion.Content backgroundColor="white" padding="$3">
              <YStack gap="$3">
                <SafeRender fallback={<Text>Loading about info...</Text>}>
                  <About />
                </SafeRender>

                <SafeRender fallback={<Text>Loading contact info...</Text>}>
                  <Contact />
                </SafeRender>
              </YStack>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>

        {/* HORIZONTAL SLIDER FOR PARENTS + AGENTS */}
        <ScrollView horizontal nestedScrollEnabled style={{ height: 210 }}>
          <SafeRender fallback={<Text>Loading...</Text>}>

            {/* Intended Parents */}
            {/* <Pressable onPress={ViewParents} style={{ marginRight: 5 }}>
              <ParentPreviewCard
                style={{ height: 200, padding: 2, width: 150 }}
              />
            </Pressable> */}

            {/* Other Agents */}
            <Pressable onPress={ViewAgents} style={{ marginRight: 5 }}>
              <SurrogatePreview style={{ height: 200, padding: 2, width: 150 }} />
            </Pressable>

          </SafeRender>
        </ScrollView>

        {/* FINANCIAL + WORKLOAD CARDS */}
        <XStack
          flexWrap="wrap"
          justifyContent="flex-end"
          alignContent="flex-start"
          gap={10}
        >
          <YStack width={"48%"} gap={10}>
            <SafeRender fallback={<Text>Loading wallet...</Text>}>
              <WalletCard style={{ width: "100%", height: 100 }} />
            </SafeRender>
          </YStack>

          <YStack width={"48%"} gap={10}>
            <SafeRender fallback={<Text>Loading referral...</Text>}>
              <Referral style={{ width: "100%", height: 160 }} />
            </SafeRender>
          </YStack>

          <SafeRender fallback={<Text>Loading progress...</Text>}>
            <ProgressMeter
              progress={0}
              style={{ width: "100%", height: 210 }}
            />
          </SafeRender>
        </XStack>
      </YStack>
    </ScrollView>
  );
}

/** Accordion Trigger with Chevron */
function AccordionTriggerWithChevron({ title }: { title: string }) {
  return (
    <Accordion.Trigger
      backgroundColor="#0E0E55"
      paddingVertical="$2"
      paddingHorizontal="$4"
      alignItems="center"
      justifyContent="space-between"
      height={48}
    >
      {({ open }: { open?: boolean }) => (
        <XStack alignItems="center" justifyContent="space-between" width="100%">
          <Text color="white" fontWeight="700" fontSize="$5">
            {title}
          </Text>

          <Animated.View
            style={{
              transform: [{ rotate: open ? "180deg" : "0deg" }],
            }}
          >
            <ChevronDown color="white" size={25} />
          </Animated.View>
        </XStack>
      )}
    </Accordion.Trigger>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
});
