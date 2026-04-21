import React, { useEffect, useState } from "react";
import {
  Modal,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { Button, YStack, XStack } from "tamagui";
import { getAllCountries } from "@/utils/countries";
import { useAuth } from "@/hooks/useAuth";
import { useParentProfile } from "@/hooks/profile/useParentProfile";

type FilterOptions = {
  country?: string;
  religion?: string;
  race?: string;
  pregnancyHistory?: string[];
};

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (options: FilterOptions) => void;
};

const religionOptions = ["Christianity", "Islam", "Hinduism", "None", "Other"];
const raceOptions = ["Black", "White", "Asian", "Hispanic/Latinx", "Other"];
const pregnancyOptions = [
  "Never pregnant",
  "Previously pregnant",
  "Currently pregnant",
];

export default function FilterModal({
  visible,
  onClose,
  onApply,
}: FilterModalProps) {
  const { user } = useAuth();
  const { updateMatchPreference } = useParentProfile();
  const [countries, setCountries] = useState<{ name: string }[]>([]);
  const [loadingCountries, setLoadingCountries] = useState<boolean>(true);

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedReligion, setSelectedReligion] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedPregnancy, setSelectedPregnancy] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoadingCountries(true);
    getAllCountries()
      .then((res) => {
        if (mounted) {
          setCountries(res);
        }
      })
      .finally(() => mounted && setLoadingCountries(false));
    return () => {
      mounted = false;
    };
  }, []);

  const togglePregnancy = (option: string) => {
    setSelectedPregnancy((prev) =>
      prev.includes(option)
        ? prev.filter((p) => p !== option)
        : [...prev, option],
    );
  };

  const resetFilters = () => {
    setSelectedCountry(null);
    setSelectedReligion(null);
    setSelectedRace(null);
    setSelectedPregnancy([]);
  };

  const applyFilters = async () => {
    const filterOptions = {
      country: selectedCountry ?? undefined,
      religion: selectedReligion ?? undefined,
      race: selectedRace ?? undefined,
      pregnancyHistory: selectedPregnancy,
    };

    // Save match preferences if user is a parent
    const isParent = user?.role?.trim() === "INTENDED_PARENT";
    if (isParent) {
      try {
        await updateMatchPreference(filterOptions);
      } catch (error: any) {
        // Silently fail - don't block filter application if save fails
        console.log("Failed to save match preferences:", error?.message);
      }
    }

    onApply(filterOptions);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
        }}
        activeOpacity={1}
        onPress={onClose}
      />
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "60%",
          paddingBottom: 34,
          backgroundColor: "#FFFFFF",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: 40,
            height: 6,
            backgroundColor: "#DDD",
            borderRadius: 6,
            alignSelf: "center",
            marginVertical: 8,
          }}
        />
        <ScrollView
          style={{
            paddingHorizontal: 20,
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              marginBottom: 12,
            }}
          >
            Filters
          </Text>

          {/* Country Dropdown */}
          <YStack marginBottom={16}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Country of Residence
            </Text>
            {loadingCountries ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: "#EEE",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                }}
                onPress={() => {
                  // cycle through countries for simplicity; in real app, render Picker
                  const currentIndex = countries.findIndex(
                    (c) => c.name === selectedCountry,
                  );
                  const nextIndex = (currentIndex + 1) % countries.length;
                  setSelectedCountry(countries[nextIndex].name);
                }}
              >
                <Text>
                  {selectedCountry ?? "Select country (tap to cycle example)"}
                </Text>
              </TouchableOpacity>
            )}
          </YStack>

          {/* Religion Chips */}
          <YStack marginBottom={16}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Religion
            </Text>
            <XStack flexWrap="wrap">
              {religionOptions.map((opt) => {
                const active = selectedReligion === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setSelectedReligion(active ? null : opt)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: "#DDD",
                      marginRight: 8,
                      marginBottom: 8,
                      backgroundColor: active ? "#3498db" : "#fff",
                    }}
                  >
                    <Text
                      style={{
                        color: active ? "#fff" : "#333",
                        fontWeight: active ? "700" : "400",
                      }}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </XStack>
          </YStack>

          {/* Race Chips */}
          <YStack marginBottom={16}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Race / Ethnicity
            </Text>
            <XStack flexWrap="wrap">
              {raceOptions.map((opt) => {
                const active = selectedRace === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setSelectedRace(active ? null : opt)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: "#DDD",
                      marginRight: 8,
                      marginBottom: 8,
                      backgroundColor: active ? "#3498db" : "#fff",
                    }}
                  >
                    <Text
                      style={{
                        color: active ? "#fff" : "#333",
                        fontWeight: active ? "700" : "400",
                      }}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </XStack>
          </YStack>

          {/* Pregnancy Checkboxes */}
          <YStack marginBottom={16}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Pregnancy History
            </Text>
            {pregnancyOptions.map((opt) => {
              const checked = selectedPregnancy.includes(opt);
              return (
                <XStack
                  key={opt}
                  flexDirection="row"
                  alignItems="center"
                  marginBottom={8}
                >
                  <TouchableOpacity
                    onPress={() => togglePregnancy(opt)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: "#CCC",
                      marginRight: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: checked ? "#3498db" : "#fff",
                    }}
                  >
                    {checked && (
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "700",
                        }}
                      >
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                  <Text>{opt}</Text>
                </XStack>
              );
            })}
          </YStack>

          {/* Buttons */}
          <XStack justifyContent="space-between" marginBottom={20}>
            <Button
              onPress={resetFilters}
              style={{
                flex: 1,
                marginRight: 8,
                backgroundColor: "#EEE",
              }}
            >
              Reset
            </Button>
            <Button
              onPress={applyFilters}
              style={{
                flex: 1,
                marginLeft: 8,
                backgroundColor: "#3498db",
              }}
            >
              Apply Filters
            </Button>
          </XStack>
        </ScrollView>
      </View>
    </Modal>
  );
}
