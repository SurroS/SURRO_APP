import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  Modal,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Button, YStack, XStack } from "tamagui";
import { getAllCountries, getCachedCountries } from "@/utils/countries";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabKey = "location" | "experience" | "genotype" | "bloodGroup" | "age" | "rating" | "specialization";

export type FilterParam = {
  type: TabKey;
  value: string;
} | null;

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: FilterParam) => void;
  role: "SURROGATE" | "AGENT";
  items: any[];
};

const GENOTYPE_OPTIONS = ["AA", "AS", "SS", "AC"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const EXPERIENCE_OPTIONS = ["Rookie", "Experienced"];
const RATING_OPTIONS = ["4.5+", "4.0+", "3.5+", "3.0+", "2.0+"];

const DEBOUNCE_MS = 300;
const useDebounce = () => {
  const lastPress = useRef(0);
  return useCallback((fn: () => void) => () => {
    const now = Date.now();
    if (now - lastPress.current < DEBOUNCE_MS) return;
    lastPress.current = now;
    fn();
  }, []);
};

export default function FilterModal({
  visible,
  onClose,
  onApply,
  role,
  items = [],
}: FilterModalProps) {
  const insets = useSafeAreaInsets();
  const [countries, setCountries] = useState<{ name: string }[]>(() => getCachedCountries() || []);

  const [activeTab, setActiveTab] = useState<TabKey>("location");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedLga, setSelectedLga] = useState<string | null>(null);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const debounce = useDebounce();

  useEffect(() => {
    if (!visible) return;
    setActiveTab("location");
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedLga(null);
    setSelectedChip(null);
    setCountrySearch("");
    setStateSearch("");
  }, [visible]);

  useEffect(() => {
    if (!getCachedCountries()) {
      getAllCountries().then(setCountries);
    }
  }, []);

  const filteredCountries = useMemo(() => {
    const list = Array.isArray(countries) ? countries : [];
    if (!countrySearch) return list;
    return list.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase()));
  }, [countries, countrySearch]);

  const filteredStates = useMemo(() => {
    const list = Array.isArray(availableStates) ? availableStates : [];
    if (!stateSearch) return list;
    return list.filter((s) => s.toLowerCase().includes(stateSearch.toLowerCase()));
  }, [availableStates, stateSearch]);

  // Pre-compute country → states → lgas maps once from items
  const countryStatesMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    const lgaMap = new Map<string, Set<string>>();
    const list = Array.isArray(items) ? items : [];
    list.forEach((item: any) => {
      const c = (item.country || item.countryOfResidence || "").toLowerCase();
      const s = item.stateOfResidence || item.state || "";
      const l = item.lga || "";
      if (c && s) {
        if (!map.has(c)) map.set(c, new Set());
        map.get(c)!.add(s);
      }
      if (s && l) {
        const key = s.toLowerCase();
        if (!lgaMap.has(key)) lgaMap.set(key, new Set());
        lgaMap.get(key)!.add(l);
      }
    });
    return { countryStates: map, stateLgas: lgaMap };
  }, [items]);

  const availableStates = useMemo(() => {
    if (!selectedCountry) return [];
    const states = countryStatesMap.countryStates.get(selectedCountry.toLowerCase());
    return states ? Array.from(states).sort() : [];
  }, [selectedCountry, countryStatesMap]);

  const availableLgas = useMemo(() => {
    if (!selectedState) return [];
    const lgas = countryStatesMap.stateLgas.get(selectedState.toLowerCase());
    return lgas ? Array.from(lgas).sort() : [];
  }, [selectedState, countryStatesMap]);

  const surrogateTabs: { key: TabKey; label: string }[] = [
    { key: "location", label: "Location" },
    { key: "experience", label: "Experience" },
    { key: "genotype", label: "Genotype" },
    { key: "bloodGroup", label: "Blood" },
    { key: "age", label: "Age" },
  ];

  const agentTabs: { key: TabKey; label: string }[] = [
    { key: "location", label: "Location" },
    { key: "rating", label: "Rating" },
    { key: "specialization", label: "Specialization" },
  ];

  const tabs = role === "SURROGATE" ? surrogateTabs : agentTabs;

  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedLga(null);
    setSelectedChip(null);
  };

  const handleApply = useCallback(async () => {
    if (isApplying) return;
    setIsApplying(true);
    let filter: FilterParam = null;
    switch (activeTab) {
      case "location":
        if (selectedLga) filter = { type: "lga", value: selectedLga };
        else if (selectedState) filter = { type: "state", value: selectedState };
        else if (selectedCountry) filter = { type: "country", value: selectedCountry };
        break;
      case "experience":
        if (selectedChip) filter = { type: "experience", value: selectedChip };
        break;
      case "genotype":
        if (selectedChip) filter = { type: "genotype", value: selectedChip };
        break;
      case "bloodGroup":
        if (selectedChip) filter = { type: "bloodGroup", value: selectedChip };
        break;
      case "age":
        if (selectedChip) filter = { type: "age", value: selectedChip };
        break;
      case "rating":
        if (selectedChip) filter = { type: "rating", value: selectedChip };
        break;
      case "specialization":
        if (selectedChip) filter = { type: "specialization", value: selectedChip };
        break;
    }
    onApply(filter);
    onClose();
    setIsApplying(false);
  }, [isApplying, activeTab, selectedCountry, selectedState, selectedLga, selectedChip, onApply, onClose]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "location":
        return (
          <YStack gap={12}>
            {/* Country */}
            <Text style={styles.label}>Country</Text>
            <>
              <TextInput
                style={styles.searchInput}
                placeholder="Search country..."
                placeholderTextColor="#999"
                value={countrySearch}
                onChangeText={setCountrySearch}
              />
              <ScrollView style={{ maxHeight: 140 }} nestedScrollEnabled>
                <TouchableOpacity style={styles.optionRow} onPress={debounce(() => { setSelectedCountry(null); setSelectedState(null); setSelectedLga(null); })}>
                  <Text style={[styles.optionText, !selectedCountry && styles.optionActive]}>Any</Text>
                </TouchableOpacity>
                {filteredCountries.map((c) => (
                  <TouchableOpacity
                    key={c.name}
                    style={styles.optionRow}
                    onPress={debounce(() => { setSelectedCountry(c.name); setSelectedState(null); setSelectedLga(null); })}
                  >
                    <Text style={[styles.optionText, selectedCountry === c.name && styles.optionActive]}>{c.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>

            {/* State */}
            {selectedCountry && (
              <>
                <Text style={styles.label}>State / Region</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search state..."
                  placeholderTextColor="#999"
                  value={stateSearch}
                  onChangeText={setStateSearch}
                />
                <ScrollView style={{ maxHeight: 140 }} nestedScrollEnabled>
                  <TouchableOpacity style={styles.optionRow} onPress={debounce(() => { setSelectedState(null); setSelectedLga(null); })}>
                    <Text style={[styles.optionText, !selectedState && styles.optionActive]}>Any</Text>
                  </TouchableOpacity>
                  {filteredStates.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.optionRow}
                      onPress={debounce(() => { setSelectedState(s); setSelectedLga(null); })}
                    >
                      <Text style={[styles.optionText, selectedState === s && styles.optionActive]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {/* LGA */}
            {selectedState && (
              <>
                <Text style={styles.label}>LGA</Text>
                <ScrollView style={{ maxHeight: 140 }} nestedScrollEnabled>
                  <TouchableOpacity style={styles.optionRow} onPress={debounce(() => setSelectedLga(null))}>
                    <Text style={[styles.optionText, !selectedLga && styles.optionActive]}>Any</Text>
                  </TouchableOpacity>
                  {availableLgas.map((l) => (
                    <TouchableOpacity
                      key={l}
                      style={styles.optionRow}
                      onPress={debounce(() => setSelectedLga(l))}
                    >
                      <Text style={[styles.optionText, selectedLga === l && styles.optionActive]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </YStack>
        );

      case "experience":
        return (
          <YStack gap={10}>
            <Text style={styles.label}>Experience Level</Text>
            <XStack flexWrap="wrap" gap={8}>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={debounce(() => setSelectedChip(selectedChip === opt ? null : opt))}
                  style={[styles.chip, selectedChip === opt && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedChip === opt && styles.chipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </XStack>
          </YStack>
        );

      case "genotype":
        return (
          <YStack gap={10}>
            <Text style={styles.label}>Genotype</Text>
            <XStack flexWrap="wrap" gap={8}>
              {GENOTYPE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={debounce(() => setSelectedChip(selectedChip === opt ? null : opt))}
                  style={[styles.chip, selectedChip === opt && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedChip === opt && styles.chipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </XStack>
          </YStack>
        );

      case "bloodGroup":
        return (
          <YStack gap={10}>
            <Text style={styles.label}>Blood Group</Text>
            <XStack flexWrap="wrap" gap={8}>
              {BLOOD_GROUP_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={debounce(() => setSelectedChip(selectedChip === opt ? null : opt))}
                  style={[styles.chip, selectedChip === opt && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedChip === opt && styles.chipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </XStack>
          </YStack>
        );

      case "age":
        return (
          <YStack gap={10}>
            <Text style={styles.label}>Age Range</Text>
            <XStack flexWrap="wrap" gap={8}>
              {["18-25", "26-30", "31-35", "36-40", "40+"].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={debounce(() => setSelectedChip(selectedChip === opt ? null : opt))}
                  style={[styles.chip, selectedChip === opt && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedChip === opt && styles.chipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </XStack>
          </YStack>
        );

      case "rating":
        return (
          <YStack gap={10}>
            <Text style={styles.label}>Minimum Rating</Text>
            <XStack flexWrap="wrap" gap={8}>
              {RATING_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={debounce(() => setSelectedChip(selectedChip === opt ? null : opt))}
                  style={[styles.chip, selectedChip === opt && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedChip === opt && styles.chipTextActive]}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </XStack>
          </YStack>
        );

      case "specialization": {
        const specs = (items || []).map((i: any) => i.specialization).filter(Boolean) as string[];
        const uniqueSpecs = Array.from(new Set(specs));
        return (
          <YStack gap={10}>
            <Text style={styles.label}>Specialization</Text>
            <Text style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
              Filter by agent specialization keyword
            </Text>
            <XStack flexWrap="wrap" gap={8}>
              {uniqueSpecs.map((spec) => (
                <TouchableOpacity
                  key={spec}
                  onPress={debounce(() => setSelectedChip(selectedChip === spec ? null : spec))}
                  style={[styles.chip, selectedChip === spec && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selectedChip === spec && styles.chipTextActive]}>{spec}</Text>
                </TouchableOpacity>
              ))}
              {uniqueSpecs.length === 0 && (
                <Text style={{ color: "#999", fontSize: 13 }}>No specializations available</Text>
              )}
            </XStack>
          </YStack>
        );
      }

      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} presentationStyle="overFullScreen" statusBarTranslucent>
      <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} activeOpacity={1} onPress={debounce(onClose)} />
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "70%", paddingBottom: insets.bottom || 16, backgroundColor: "#FFFFFF", borderTopLeftRadius: 14, borderTopRightRadius: 14, overflow: "hidden" }}>
        <View style={{ width: 40, height: 6, backgroundColor: "#DDD", borderRadius: 6, alignSelf: "center", marginVertical: 8 }} />

        {/* Tab bar */}
        <XStack paddingHorizontal={16} gap={0} borderBottomWidth={1} borderBottomColor="#EEE">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={debounce(() => handleTabPress(tab.key))}
              style={{ paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 2, borderBottomColor: activeTab === tab.key ? "#0E0E55" : "transparent" }}
            >
              <Text style={{ fontSize: 14, fontWeight: activeTab === tab.key ? "700" : "500", color: activeTab === tab.key ? "#0E0E55" : "#888" }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </XStack>

        {/* Content */}
        <ScrollView style={{ paddingHorizontal: 20, paddingTop: 16, flex: 1 }} showsVerticalScrollIndicator={false}>
          {renderTabContent()}
          <XStack justifyContent="space-between" marginTop={20} marginBottom={12}>
            <Button onPress={debounce(() => { setSelectedCountry(null); setSelectedState(null); setSelectedLga(null); setSelectedChip(null); })} style={{ flex: 1, marginRight: 8, backgroundColor: "#EEE" }} color="#000">
              Reset
            </Button>
            <Button onPress={handleApply} disabled={isApplying} style={{ flex: 1, marginLeft: 8, backgroundColor: "#0E0E55" }}>
              {isApplying ? <ActivityIndicator color="#fff" /> : "Apply"}
            </Button>
          </XStack>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = {
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 4 },
  optionRow: { paddingVertical: 8, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  optionText: { fontSize: 15, color: "#333" },
  optionActive: { color: "#0E0E55", fontWeight: "700" },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#DDD", backgroundColor: "#fff" },
  chipActive: { backgroundColor: "#0E0E55", borderColor: "#0E0E55" },
  chipText: { fontSize: 14, color: "#333" },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  searchInput: { backgroundColor: "#F5F5F5", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: "#333", marginBottom: 8, borderWidth: 1, borderColor: "#E5E5E5" },
} as const;
