// import React, { useEffect, useRef, useState, useMemo } from "react";
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   Animated,
//   PanResponder,
//   Image,
//   Text,
//   Modal,
//   TouchableOpacity,
//   Pressable,
//   ScrollView,
//   Easing, 
// } from "react-native";
// import { Button } from "tamagui";
// import { Ionicons } from "@expo/vector-icons";
// import { useSurrogateStore } from "@/store/surrogates";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import colors from "@/hooks/colors";
// import { SafeAreaView } from "react-native-safe-area-context";

// type Surrogate = {
//   id: string;
//   name: string;
//   avatar?: string;
//   location?: string;
//   [k: string]: any;
// };

// export default function SurrogateList() {
//   const { surrogates, isLoading, fetchSurrogates } = useSurrogateStore();
//   const router = useRouter();
//   const params = useLocalSearchParams();

//   const initialSurrogates = params.surrogates
//     ? JSON.parse(params.surrogates as string)
//     : [];

//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Filter modal state
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [country, setCountry] = useState<string | null>(null);
//   const [religion, setReligion] = useState<string | null>(null);
//   const [race, setRace] = useState<string | null>(null);
//   const [pregnancyHistory, setPregnancyHistory] = useState<string[]>([]);

//   // Defaults for dropdown options (replace with your real lists)
//   const countryOptions = useMemo(
//     () => ["Nigeria", "Ghana", "Kenya", "South Africa", "United Kingdom"],
//     []
//   );
//   const religionOptions = useMemo(
//     () => ["Christianity", "Islam", "Hinduism", "None", "Other"],
//     []
//   );
//   const raceOptions = useMemo(
//     () => ["Black", "White", "Asian", "Hispanic/Latinx", "Other"],
//     []
//   );
//   const pregnancyOptions = useMemo(
//     () => ["Never pregnant", "Previously pregnant", "Currently pregnant"],
//     []
//   );

//   const position = useRef(new Animated.ValueXY()).current;
//   const rotate = position.x.interpolate({
//     inputRange: [-200, 0, 200],
//     outputRange: ["-15deg", "0deg", "15deg"],
//     extrapolate: "clamp",
//   });
//   const nextCardScale = position.x.interpolate({
//     inputRange: [-200, 0, 200],
//     outputRange: [1, 0.97, 1],
//     extrapolate: "clamp",
//   });
//   const nextCardTranslateY = position.x.interpolate({
//     inputRange: [-200, 0, 200],
//     outputRange: [0, 8, 0],
//     extrapolate: "clamp",
//   });

//   useEffect(() => {
//     if (!initialSurrogates.length) {
//       fetchSurrogates(true).catch((err: any) =>
//         console.log("Failed to fetch surrogates:", err)
//       );
//     }
//   }, [fetchSurrogates, initialSurrogates.length]);

//   const list: Surrogate[] = initialSurrogates.length
//     ? initialSurrogates
//     : (surrogates as Surrogate[]);

//   // Apply simple search + local filters
//   const filtered = useMemo(() => {
//     let out = list || [];
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase();
//       out = out.filter((s) => s.name?.toLowerCase().includes(q));
//     }
//     if (country) {
//       out = out.filter((s) => s.country === country || s.country === country);
//     }
//     if (religion) {
//       out = out.filter((s) => s.religion === religion);
//     }
//     if (race) {
//       out = out.filter((s) => s.race === race);
//     }
//     if (pregnancyHistory.length) {
//       out = out.filter((s) =>
//         pregnancyHistory.some((ph) => (s.pregnancyHistory || []).includes(ph))
//       );
//     }
//     return out;
//   }, [list, searchQuery, country, religion, race, pregnancyHistory]);

//   const currentCard = filtered[currentIndex];
//   const nextCard = filtered[currentIndex + 1];

//   // PanResponder for top card only
//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, gestureState) =>
//         Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10,
//       onPanResponderMove: (_, gestureState) => {
//         position.setValue({ x: gestureState.dx, y: gestureState.dy });
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dx > 120) {
//           handleSwipe("right");
//         } else if (gestureState.dx < -120) {
//           handleSwipe("left");
//         } else {
//           Animated.spring(position, {
//             toValue: { x: 0, y: 0 },
//             useNativeDriver: true,
//             bounciness: 6,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   const handleSwipe = (direction: "left" | "right") => {
//     Animated.timing(position, {
//       toValue: { x: direction === "right" ? 500 : -500, y: 0 },
//       duration: 220,
//       useNativeDriver: true,
//       easing: Easing.out(Easing.quad),
//     }).start(() => {
//       position.setValue({ x: 0, y: 0 });
//       setCurrentIndex((prev) => prev + 1);
//     });
//   };

//   const resetList = () => {
//     setCurrentIndex(0);
//     // reset filters if desired:
//     // setCountry(null); setReligion(null); setRace(null); setPregnancyHistory([]);
//     fetchSurrogates(true).catch((err: any) =>
//       console.log("Failed to refresh surrogates:", err)
//     );
//   };

//   const togglePregnancy = (opt: string) => {
//     setPregnancyHistory((prev) =>
//       prev.includes(opt) ? prev.filter((p) => p !== opt) : [...prev, opt]
//     );
//   };

//   const applyFilters = () => {
//     setIsFilterOpen(false);
//     setCurrentIndex(0); // reset deck to top of filtered results
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.loadingText}>Loading surrogates...</Text>
//       </View>
//     );
//   }

//   // Empty state (no more cards)
//   if (!currentCard) {
//     return (
//       <SafeAreaView style={{ flex: 1 }}>
//         <View style={styles.emptyContainer}>
//           <View style={styles.emptyCard}>
//             <Image
//               source={{
//                 uri:
//                   "https://via.placeholder.com/240x140.png?text=No+Profiles", // replace optional illustration
//               }}
//               style={styles.emptyImage}
//               resizeMode="cover"
//             />
//             <Text style={styles.emptyText}>No more profiles</Text>
//             <Text style={styles.emptySubText}>
//               Try adjusting filters or reload the list.
//             </Text>
//             <Button
//               onPress={resetList}
//               style={styles.reloadButton}
//               accessibilityLabel="Reload profiles"
//             >
//               Reload
//             </Button>
//           </View>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         {/* Search + Filter */}
//         <View style={styles.searchContainer}>
//           <TextInput
//             placeholder="Filter surrogates..."
//             placeholderTextColor="#999"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             style={styles.searchInput}
//           />
//           <TouchableOpacity
//             style={styles.filterIconWrap}
//             onPress={() => setIsFilterOpen(true)}
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//           >
//             <Ionicons name="filter" size={22} color="#333" />
//           </TouchableOpacity>
//         </View>

//         {/* Card Deck */}
//         <View style={styles.deckContainer}>
//           {nextCard && (
//             <Animated.View
//               key={nextCard.id}
//               style={[
//                 styles.card,
//                 {
//                   transform: [
//                     { scale: nextCardScale },
//                     { translateY: nextCardTranslateY },
//                   ],
//                 },
//                 // Make it visually behind the top card
//               ]}
//               pointerEvents="none"
//             >
//               <Image source={{ uri: nextCard.avatar }} style={styles.avatar} />
//             </Animated.View>
//           )}

//           {currentCard && (
//             <Animated.View
//               {...panResponder.panHandlers}
//               key={currentCard.id}
//               style={[
//                 styles.card,
//                 {
//                   transform: [
//                     { translateX: position.x },
//                     { translateY: position.y },
//                     { rotate: rotate },
//                   ],
//                 },
//               ]}
//             >
//               <Image
//                 source={{ uri: currentCard.avatar }}
//                 style={styles.avatar}
//               />
//               <View style={styles.cardInfo}>
//                 <Text style={styles.nameText}>{currentCard.name}</Text>
//                 <Text style={styles.locationText}>
//                   {currentCard.location || "Location not specified"}
//                 </Text>
//               </View>
//             </Animated.View>
//           )}
//         </View>

//         {/* Stationary Buttons */}
//         <View style={styles.buttonsContainer}>
//           <Button
//             style={styles.ignoreButton}
//             onPress={() => handleSwipe("left")}
//             disabled={!currentCard}
//           >
//             Ignore
//           </Button>
//           <Button
//             style={styles.viewButton}
//             onPress={() =>
//               router.push(`/surrogateProfile/${currentCard?.id ?? ""}`)
//             }
//             disabled={!currentCard}
//           >
//             View Profile
//           </Button>
//         </View>

//         {/* Filter Modal as bottom sheet */}
//         <Modal
//           visible={isFilterOpen}
//           animationType="fade"
//           transparent
//           onRequestClose={() => setIsFilterOpen(false)}
//         >
//           <TouchableOpacity
//             style={styles.modalBackdrop}
//             activeOpacity={1}
//             onPress={() => setIsFilterOpen(false)}
//           />
//           <Animated.View style={styles.modalContainer}>
//             <View style={styles.sheetHandle} />
//             <ScrollView style={styles.modalContent}>
//               <Text style={styles.modalTitle}>Filters</Text>

//               {/* Country dropdown: replace with your Dropdown component */}
//               <View style={styles.formRow}>
//                 <Text style={styles.fieldLabel}>Country of Residence</Text>
//                 {/* Assumed Dropdown API */}
//                 {/* Replace below with your actual Dropdown component */}
//                 <View style={styles.fakeDropdown}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       // quick simple picker-like behavior for example
//                       // In real usage you should render a proper dropdown.
//                       const next =
//                         countryOptions[
//                           (countryOptions.indexOf(country as string) + 1) %
//                             countryOptions.length
//                         ];
//                       setCountry(next);
//                     }}
//                     style={styles.fakeDropdownButton}
//                   >
//                     <Text>
//                       {country ?? "Select country (tap to cycle example)"}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* Religion chips (single select) */}
//               <View style={styles.formRow}>
//                 <Text style={styles.fieldLabel}>Religion</Text>
//                 <View style={styles.chipsRow}>
//                   {religionOptions.map((opt) => {
//                     const active = religion === opt;
//                     return (
//                       <Pressable
//                         key={opt}
//                         onPress={() => setReligion(active ? null : opt)}
//                         style={[
//                           styles.chip,
//                           active && styles.chipActive,
//                         ]}
//                       >
//                         <Text style={active ? styles.chipTextActive : styles.chipText}>
//                           {opt}
//                         </Text>
//                       </Pressable>
//                     );
//                   })}
//                 </View>
//               </View>

//               {/* Race/Ethnicity chips (single select) */}
//               <View style={styles.formRow}>
//                 <Text style={styles.fieldLabel}>Race / Ethnicity</Text>
//                 <View style={styles.chipsRow}>
//                   {raceOptions.map((opt) => {
//                     const active = race === opt;
//                     return (
//                       <Pressable
//                         key={opt}
//                         onPress={() => setRace(active ? null : opt)}
//                         style={[
//                           styles.chip,
//                           active && styles.chipActive,
//                         ]}
//                       >
//                         <Text style={active ? styles.chipTextActive : styles.chipText}>
//                           {opt}
//                         </Text>
//                       </Pressable>
//                     );
//                   })}
//                 </View>
//               </View>

//               {/* Pregnancy History (checkboxes multi-select) */}
//               <View style={styles.formRow}>
//                 <Text style={styles.fieldLabel}>Pregnancy History</Text>
//                 <View style={styles.checksColumn}>
//                   {pregnancyOptions.map((opt) => {
//                     const checked = pregnancyHistory.includes(opt);
//                     return (
//                       <Pressable
//                         key={opt}
//                         onPress={() => togglePregnancy(opt)}
//                         style={styles.checkRow}
//                       >
//                         <View
//                           style={[
//                             styles.checkbox,
//                             checked && styles.checkboxChecked,
//                           ]}
//                         >
//                           {checked && <Text style={styles.checkboxTick}>✓</Text>}
//                         </View>
//                         <Text style={styles.checkLabel}>{opt}</Text>
//                       </Pressable>
//                     );
//                   })}
//                 </View>
//               </View>

//               {/* Buttons */}
//               <View style={styles.modalButtons}>
//                 <Button
//                   onPress={() => {
//                     // Reset just filters
//                     setCountry(null);
//                     setReligion(null);
//                     setRace(null);
//                     setPregnancyHistory([]);
//                   }}
//                   style={styles.cancelButton}
//                 >
//                   Reset
//                 </Button>
//                 <Button
//                   onPress={() => {
//                     setIsFilterOpen(false);
//                     applyFilters();
//                   }}
//                   style={styles.applyButton}
//                 >
//                   Apply Filters
//                 </Button>
//               </View>
//               <View style={{ height: 40 }} />
//             </ScrollView>
//           </Animated.View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   searchContainer: {
//     marginBottom: 20,
//     position: "relative",
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: "#CCC",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 16,
//     color: "#000",
//   },
//   filterIconWrap: {
//     position: "absolute",
//     right: 12,
//     top: 12,
//   },
//   deckContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   card: {
//     position: "absolute",
//     width: "100%",
//     height: 450,
//     backgroundColor: "#FFF",
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.18,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 6,
//     overflow: "hidden",
//   },
//   avatar: {
//     width: "100%",
//     height: "100%",
//   },
//   cardInfo: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//   },
//   nameText: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FFF",
//     textShadowColor: "rgba(0,0,0,0.45)",
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 3,
//   },
//   locationText: {
//     fontSize: 14,
//     color: "#EEE",
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginBottom: 30,
//   },
//   ignoreButton: {
//     flex: 1,
//     backgroundColor: "#E74C3C",
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   viewButton: {
//     flex: 1,
//     backgroundColor: colors.primary,
//     borderRadius: 8,
//     marginLeft: 10,
//   },

//   emptyContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#FFF",
//   },
//   emptyCard: {
//     width: "85%",
//     alignItems: "center",
//     padding: 20,
//     borderRadius: 12,
//     backgroundColor: "#FAFAFA",
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//   },
//   emptyImage: {
//     width: 240,
//     height: 140,
//     borderRadius: 8,
//     marginBottom: 16,
//     backgroundColor: "#EEE",
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#333",
//     marginBottom: 8,
//   },
//   emptySubText: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   reloadButton: {
//     backgroundColor: colors.primary,
//     borderRadius: 8,
//     paddingHorizontal: 18,
//     paddingVertical: 10,
//   },

//   centered: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   loadingText: {
//     fontSize: 16,
//     color: "#444",
//   },

//   /* Modal / bottom sheet styles */
//   modalBackdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.35)",
//   },
//   modalContainer: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     height: "60%",
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 14,
//     borderTopRightRadius: 14,
//     overflow: "hidden",
//   },
//   sheetHandle: {
//     width: 40,
//     height: 6,
//     backgroundColor: "#DDD",
//     borderRadius: 6,
//     alignSelf: "center",
//     marginVertical: 8,
//   },
//   modalContent: {
//     paddingHorizontal: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 12,
//   },
//   formRow: {
//     marginBottom: 16,
//   },
//   fieldLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 8,
//   },
//   fakeDropdown: {
//     borderWidth: 1,
//     borderColor: "#EEE",
//     borderRadius: 8,
//     overflow: "hidden",
//   },
//   fakeDropdownButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   chipsRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   chip: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: "#DDD",
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   chipActive: {
//     backgroundColor: colors.primary,
//     borderColor: colors.primary,
//   },
//   chipText: {
//     color: "#333",
//   },
//   chipTextActive: {
//     color: "#fff",
//     fontWeight: "700",
//   },
//   checksColumn: {
//     flexDirection: "column",
//   },
//   checkRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 8,
//   },
//   checkbox: {
//     width: 22,
//     height: 22,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: "#CCC",
//     marginRight: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   checkboxChecked: {
//     backgroundColor: colors.primary,
//     borderColor: colors.primary,
//   },
//   checkboxTick: {
//     color: "#fff",
//     fontWeight: "700",
//   },
//   checkLabel: {
//     fontSize: 14,
//     color: "#333",
//   },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 18,
//     marginBottom: 8,
//   },
//   cancelButton: {
//     flex: 1,
//     marginRight: 8,
//     backgroundColor: "#EEE",
//   },
//   applyButton: {
//     flex: 1,
//     marginLeft: 8,
//     backgroundColor: colors.primary,
//   },
// });

import React, { useEffect, useState } from "react";
import { View, Text, TextInput} from "react-native";
import Swiper from "react-native-deck-swiper";
import { Button, YStack, XStack, Image } from "tamagui";
import { Ionicons } from "@expo/vector-icons";
import { useSurrogateStore } from "@/store/surrogates";
import FilterModal from "@/components/filterBottomModal";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import Card from "@/components/Card"; 
 
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"; 

const { width: SCREEN_WIDTH,height:SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6; // responsive height

export default function SurrogateList() {
  const { surrogates, isLoading, fetchSurrogates } = useSurrogateStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const swipeX = useSharedValue(0);

  useEffect(() => {
    if (!surrogates.length) {
      fetchSurrogates(true).catch((err) =>
        console.log("Fetch surrogates failed:", err)
      );
    }
  }, [fetchSurrogates]);

  const filteredList = surrogates; // filters not applied yet
    const currentCard = filteredList[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    
      <YStack
        paddingHorizontal={20}
        paddingVertical={12}
        borderBottomWidth={1}
        borderColor="#DDD"
      >
        <XStack position="relative">
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#CCC",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 16,
            }}
            placeholder="Filter surrogates..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons
            name="filter"
            size={22}
            color="#333"
            style={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
            onPress={() => setIsFilterVisible(true)}
          />
        </XStack>
      </YStack>

      {/* Swiper / empty state */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        {isLoading ? (
          <Text>Loading surrogates...</Text>
        ) : filteredList.length === 0 ? (
          <YStack alignItems="center" justifyContent="center" flex={1}>
            <Image
              source={require("@/assets/images/emptySurrogate.png")} // placeholder image
              style={{ width: SCREEN_WIDTH * 0.7, height: CARD_HEIGHT * 0.6 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 18, marginVertical: 16, color:"black" }}>
              No more profiles
            </Text>
            <Button
              onPress={() => fetchSurrogates(true)}
              backgroundColor="#3498db"
              borderRadius={8}
              paddingHorizontal={20}
              paddingVertical={12}
            >
              Reload
            </Button>
          </YStack>
        ) : (
          <Swiper
            cards={filteredList}
            renderCard={(card) => (
              <Card
                card={card}
                swipeX={swipeX}
                screenWidth={SCREEN_WIDTH}
                cardHeight={CARD_HEIGHT}
              />
            )}
            stackSize={2}
            cardIndex={0}
            backgroundColor="transparent"
            animateCardOpacity
            animateOverlayLabelsOpacity
            onSwiping={(x) => (swipeX.value = x)}
            onSwiped={() => (swipeX.value = 0)}
            key={filteredList.length} // reset deck if list changes
          />
        )}
      </View>

      {/* Bottom buttons */}
      {currentCard && (
        <XStack
          justifyContent="space-around"
          paddingTop={20}
          paddingBottom={10}
          paddingHorizontal={20}
          borderTopWidth={1}
          borderColor="#DDD"
        >
          <Button
            backgroundColor="#E74C3C"
            borderRadius={8}
            flex={1}
            marginRight={10}
            onPress={() => swipeX.value = SCREEN_WIDTH} // simulate ignore swipe
          >
            Ignore
          </Button>
          <Button
            backgroundColor="#3498db"
            borderRadius={8}
            flex={1}
            marginLeft={10}
            onPress={() => console.log("View profile", currentCard.id)}
          >
            View Profile
          </Button>
        </XStack>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={(filters) => {
          console.log("Selected filters:", filters);
          setSelectedFilters(filters);
        }}
      />
    </SafeAreaView>
  );
}