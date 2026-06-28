import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Pressable,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { YStack, Button, ScrollView, XStack, Text } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { getAllCountriesSync } from "@/utils/countries";
import { getStatesByCountry, getLgaByState, getLocalNigeriaStates, getLocalNigeriaLgas } from "@/utils/states";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";

function makeKey(country: string, state: string) {
  return `${country}::${state}`;
}
function parseKey(key: string): [string, string] {
  const idx = key.indexOf("::");
  return [key.slice(0, idx), key.slice(idx + 2)];
}

// ─── LGA row ─────────────────────────────────────────────
interface LgaRowProps {
  lga: string;
  selected: boolean;
  onToggle: () => void;
}
const LgaRow = React.memo(function LgaRow({ lga, selected, onToggle }: LgaRowProps) {
  return (
    <XStack alignItems="center" gap="$3" paddingLeft={40} paddingRight={20} paddingVertical={6} onPress={onToggle}>
      <View style={[s.checkbox, selected && s.checkboxOn]}>
        {selected && <Text style={s.checkMark}>✔</Text>}
      </View>
      <Text fontSize={14} color={colors.text}>{lga}</Text>
    </XStack>
  );
});

// ─── State row ───────────────────────────────────────────
interface StateRowProps {
  state: string;
  selected: boolean;
  expanded: boolean;
  lgaCount: number;
  selLgaCount: number;
  onToggleState: () => void;
  onToggleExpand: () => void;
}
const StateRow = React.memo(function StateRow({
  state, selected, expanded, lgaCount, selLgaCount, onToggleState, onToggleExpand,
}: StateRowProps) {
  return (
    <XStack alignItems="center" gap="$3" paddingVertical={10} paddingLeft={20} paddingRight={20}>
      <Pressable onPress={onToggleState} style={{ width: 20, height: 20, ...s.checkbox, ...(selected && s.checkboxOn) }}>
        {selected && <Text style={s.checkMark}>✔</Text>}
      </Pressable>
      <Pressable onPress={onToggleExpand} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text flex={1} fontSize={15} color={colors.text}>{state}</Text>
        <Text fontSize={12} color={colors.gray}>{selLgaCount}/{lgaCount}</Text>
        <Text fontSize={12} color={colors.gray}>{expanded ? "▼" : "▶"}</Text>
      </Pressable>
    </XStack>
  );
});

// ─── LGA section (expanded state) ───────────────────────
interface LgaSectionProps {
  lgas: string[];
  selected: string[];
  loading: boolean;
  onToggle: (lga: string) => void;
  onToggleAll: () => void;
}
const LgaSection = React.memo(function LgaSection({
  lgas, selected, loading, onToggle, onToggleAll,
}: LgaSectionProps) {
  if (loading) {
    return (
      <XStack paddingLeft={40} paddingVertical={8} gap="$2">
        <ActivityIndicator size="small" color={colors.primary} />
        <Text fontSize={13} color={colors.gray}>Loading LGAs...</Text>
      </XStack>
    );
  }
  if (lgas.length === 0) return null;
  const all = selected.length === lgas.length && lgas.length > 0;
  return (
    <YStack pb={6}>
      <XStack alignItems="center" gap="$3" paddingLeft={40} paddingRight={20} paddingVertical={8} onPress={onToggleAll}>
        <View style={[s.checkbox, all && s.checkboxOn]}>
          {all && <Text style={s.checkMark}>✔</Text>}
        </View>
        <Text fontSize={14} fontWeight="600" color={colors.text}>All LGAs</Text>
      </XStack>
      {lgas.map((l) => (
        <LgaRow key={l} lga={l} selected={selected.includes(l)} onToggle={() => onToggle(l)} />
      ))}
    </YStack>
  );
});

// ─── Country picker modal ────────────────────────────────
interface CountryModalProps {
  visible: boolean;
  countries: { name: string }[];
  selected: string[];
  onToggle: (name: string) => void;
  onClose: () => void;
}
function CountryPickerModal({ visible, countries, selected, onToggle, onClose }: CountryModalProps) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => countries.filter((c) => c.name.toLowerCase().includes(q.toLowerCase())),
    [countries, q],
  );
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={s.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={s.modalContent}>
              <XStack justifyContent="space-between" alignItems="center" mb={12}>
                <Text fontWeight="700" fontSize={18} color={colors.text}>Countries</Text>
                <Pressable onPress={onClose} hitSlop={8} style={[s.closeBtn, selected.length > 0 && { backgroundColor: colors.primary }]}>
                  <Text style={{ fontSize: 16, color: selected.length > 0 ? "#fff" : "#666", fontWeight: "700" }}>
                    {selected.length > 0 ? "✔" : "✕"}
                  </Text>
                </Pressable>
              </XStack>
              <TextInput
                placeholder="Search countries"
                placeholderTextColor="#9B9B9B"
                value={q}
                onChangeText={setQ}
                style={s.searchInput}
              />
              <ScrollView style={{ maxHeight: 350 }} keyboardShouldPersistTaps="handled">
                {filtered.map((c) => {
                  const isSel = selected.includes(c.name);
                  return (
                    <XStack key={c.name} alignItems="center" gap="$3" paddingVertical={6} onPress={() => onToggle(c.name)}>
                      <View style={[s.checkbox, isSel && s.checkboxOn]}>
                        {isSel && <Text style={s.checkMark}>✔</Text>}
                      </View>
                      <Text color={colors.text}>{c.name}</Text>
                    </XStack>
                  );
                })}
                {filtered.length === 0 && (
                  <Text fontSize={14} color={colors.gray} paddingVertical={8}>No results found</Text>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function AgentCoverageSection() {
  const { agentProfile, updateAgentProfile } = useAgentProfile();

  // Data caches — countries available immediately (bundled JSON, no async)
  const [countries] = useState(() => getAllCountriesSync());
  const [statesCache, setStatesCache] = useState<Record<string, string[]>>({});
  const [lgasCache, setLgasCache] = useState<Record<string, string[]>>({});

  // Selection
  const [selCountries, setSelCountries] = useState<string[]>([]);
  const [selStates, setSelStates] = useState<Record<string, string[]>>({});
  const [selLgas, setSelLgas] = useState<Record<string, string[]>>({});

  // UI state
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [countryModal, setCountryModal] = useState(false);
  const [countryModalLoading, setCountryModalLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statesLoading, setStatesLoading] = useState<Record<string, boolean>>({});
  const [lgasLoading, setLgasLoading] = useState<Record<string, boolean>>({});
  const [prefetchReady, setPrefetchReady] = useState(false);

  // ─── Hydrate Nigeria data on mount (local JSON, instant) ─
  useEffect(() => {
    const nigeriaStates = getLocalNigeriaStates();
    setStatesCache((prev) => ({ ...prev, Nigeria: nigeriaStates }));

    const lgas: Record<string, string[]> = {};
    for (const s of nigeriaStates) {
      lgas[`Nigeria::${s}`] = getLocalNigeriaLgas(s);
    }
    setLgasCache((prev) => ({ ...prev, ...lgas }));
    setPrefetchReady(true);
  }, []);

  // ─── Populate selection from existing profile data ─────
  useEffect(() => {
    const ca = (agentProfile as any)?.coverageAreas;
    if (!ca?.countries?.length) return;

    setSelCountries(ca.countries);

    const statesRecord: Record<string, string[]> = {};
    const lgasRecord: Record<string, string[]> = {};

    for (const stateStr of ca.states || []) {
      const parts = stateStr.split(" > ");
      if (parts.length === 2) {
        const [c, s] = parts;
        if (!statesRecord[c]) statesRecord[c] = [];
        statesRecord[c].push(s);
      }
    }

    for (const lgaStr of ca.LGAs || []) {
      const parts = lgaStr.split(" > ");
      if (parts.length === 3) {
        const [c, s, l] = parts;
        const key = `${c}::${s}`;
        if (!lgasRecord[key]) lgasRecord[key] = [];
        lgasRecord[key].push(l);
      }
    }

    setSelStates(statesRecord);
    setSelLgas(lgasRecord);
  }, [agentProfile]);

  // ─── Load states for a country on demand ────────────────
  const ensureStatesLoaded = useCallback(
    async (country: string) => {
      if (statesCache[country]) return;
      setStatesLoading((prev) => ({ ...prev, [country]: true }));
      const list = await getStatesByCountry(country);
      setStatesCache((prev) => ({ ...prev, [country]: list }));
      setStatesLoading((prev) => ({ ...prev, [country]: false }));
    },
    [statesCache],
  );

  // ─── Load LGAs for a state on demand ───────────────────
  const ensureLgasLoaded = useCallback(
    async (key: string): Promise<string[]> => {
      if (lgasCache[key]) return lgasCache[key];
      setLgasLoading((prev) => ({ ...prev, [key]: true }));
      const [country, state] = parseKey(key);
      const list = await getLgaByState(country, state);
      setLgasCache((prev) => ({ ...prev, [key]: list }));
      setLgasLoading((prev) => ({ ...prev, [key]: false }));
      return list;
    },
    [lgasCache],
  );

  // ─── Toggle country ────────────────────────────────────
  const toggleCountry = useCallback(
    async (name: string) => {
      if (selCountries.includes(name)) {
        // Remove
        setSelCountries((prev) => prev.filter((c) => c !== name));
        setSelStates((prev) => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
        setSelLgas((prev) => {
          const next = { ...prev };
          for (const k of Object.keys(next)) {
            if (k.startsWith(name + "::")) delete next[k];
          }
          return next;
        });
        setExpanded((prev) => {
          const next = new Set(prev);
          for (const k of next) if (k.startsWith(name + "::")) next.delete(k);
          return next;
        });
      } else {
        setSelCountries((prev) => [...prev, name]);
        await ensureStatesLoaded(name);
      }
    },
    [selCountries, ensureStatesLoaded],
  );

  // ─── Toggle state ──────────────────────────────────────
  const toggleState = useCallback(
    async (country: string, state: string) => {
      const current = selStates[country] || [];
      const isSelected = current.includes(state);
      const key = makeKey(country, state);

      if (isSelected) {
        setSelStates((prev) => ({ ...prev, [country]: current.filter((s) => s !== state) }));
        setSelLgas((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      } else {
        setSelStates((prev) => ({ ...prev, [country]: [...current, state] }));
        const list = lgasCache[key] || (await ensureLgasLoaded(key));
        setSelLgas((prev) => ({ ...prev, [key]: [...list] }));
      }
    },
    [selStates, lgasCache, ensureLgasLoaded],
  );

  // ─── Toggle all states for a country ───────────────────
  const toggleAllStates = useCallback(
    async (country: string) => {
      const all = statesCache[country] || [];
      const current = selStates[country] || [];
      const allSelected = current.length === all.length && all.length > 0;

      if (allSelected) {
        setSelStates((prev) => ({ ...prev, [country]: [] }));
        setSelLgas((prev) => {
          const next = { ...prev };
          for (const k of Object.keys(next)) if (k.startsWith(country + "::")) delete next[k];
          return next;
        });
      } else {
        setSelStates((prev) => ({ ...prev, [country]: [...all] }));
        const newLgas: Record<string, string[]> = {};
        for (const s of all) {
          const key = makeKey(country, s);
          newLgas[key] = [...(lgasCache[key] || (await ensureLgasLoaded(key)))];
        }
        setSelLgas((prev) => ({ ...prev, ...newLgas }));
      }
    },
    [statesCache, selStates, lgasCache, ensureLgasLoaded],
  );

  // ─── Expand / collapse state ───────────────────────────
  const toggleExpand = useCallback(
    async (key: string) => {
      const next = new Set(expanded);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        if (!lgasCache[key]) await ensureLgasLoaded(key);
      }
      setExpanded(next);
    },
    [expanded, lgasCache, ensureLgasLoaded],
  );

  // ─── Toggle LGA ────────────────────────────────────────
  const toggleLga = useCallback(
    (key: string, lga: string) => {
      setSelLgas((prev) => {
        const current = prev[key] || [];
        return {
          ...prev,
          [key]: current.includes(lga) ? current.filter((l) => l !== lga) : [...current, lga],
        };
      });
    },
    [],
  );

  // ─── Toggle all LGAs for a state ───────────────────────
  const toggleAllLgas = useCallback((key: string) => {
    setSelLgas((prev) => {
      const current = prev[key] || [];
      const all = lgasCache[key] || [];
      return {
        ...prev,
        [key]: current.length === all.length ? [] : [...all],
      };
    });
  }, [lgasCache]);

  // ─── Save ──────────────────────────────────────────────
  const save = useCallback(async () => {
    if (isSaving) return;
    if (selCountries.length === 0) {
      Toast.show({ text1: "Please select at least one country", type: "customError" as ToastType });
      return;
    }
    setIsSaving(true);
    const countries: string[] = [];
    const states: string[] = [];
    const lgas: string[] = [];
    for (const country of selCountries) {
      countries.push(country);
      const selStateList = selStates[country] || [];
      for (const state of selStateList) {
        states.push(`${country} > ${state}`);
        const key = makeKey(country, state);
        const selLgaList = selLgas[key] || [];
        for (const l of selLgaList) {
          lgas.push(`${country} > ${state} > ${l}`);
        }
      }
    }
    try {
      await updateAgentProfile({ coverageAreas: { countries, states, LGAs: lgas } } as any);
      setIsSaving(false);
      Toast.show({ text1: "Coverage updated", type: "customSuccess" as ToastType });
      setTimeout(() => router.back(), 500);
    } catch {
      setIsSaving(false);
      Toast.show({ text1: "Failed to update", type: "customError" as ToastType });
    }
  }, [isSaving, selCountries, selStates, selLgas, updateAgentProfile]);

  // ─── Computed: filtered countries for rendering ────────
  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    type Entry = { country: string; states: string[] };
    const entries: Entry[] = [];
    for (const country of selCountries) {
      const allStates = statesCache[country] || [];
      if (!q) {
        entries.push({ country, states: allStates });
      } else {
        const match = allStates.filter((s) => {
          if (s.toLowerCase().includes(q)) return true;
          const key = makeKey(country, s);
          const lgas = lgasCache[key] || [];
          return lgas.some((l) => l.toLowerCase().includes(q));
        });
        if (match.length > 0) entries.push({ country, states: match });
      }
    }
    return entries;
  }, [selCountries, statesCache, lgasCache, search]);

  const isSearching = search.trim().length > 0;

  // ─── Render ────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack flex={1} padding={20}>
        <ScreenHeader title="Coverage Areas" onBackPress={() => router.back()} />

        {/* Search */}
        <TextInput
          placeholder="Search states or LGAs..."
          placeholderTextColor="#9B9B9B"
          value={search}
          onChangeText={setSearch}
          style={s.searchInput}
        />

        {/* Country chips */}
        <XStack flexWrap="wrap" gap="$2" my={10}>
          {selCountries.map((c) => (
            <Pressable
              key={c}
              onPress={() => toggleCountry(c)}
              style={[s.chip, { marginVertical: 4 }]}
            >
              <Text style={{ color: "#fff", fontSize: 13 }}>{c} ✕</Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => { setCountryModalLoading(true); setTimeout(() => setCountryModal(true), 200); }}
            style={[s.chip, { backgroundColor: colors.gray + "44", flexDirection: "row", alignItems: "center", gap: 4, marginVertical: 4 }]}
          >
            {countryModalLoading ? (
              <ActivityIndicator size={12} color={colors.text} />
            ) : (
              <Text style={{ color: colors.text, fontSize: 13 }}>+ Add country</Text>
            )}
          </Pressable>
        </XStack>

        {/* Loading indicator */}
        {!prefetchReady && (
          <XStack gap="$2" py={8}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text fontSize={13} color={colors.gray}>Loading coverage data...</Text>
          </XStack>
        )}

        {/* Coverage list */}
        <ScrollView flex={1} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {filteredCountries.map(({ country, states }) => {
            const selectedStateList = selStates[country] || [];
            const stateCount = statesCache[country]?.length || states.length;
            const allStatesSelected = selectedStateList.length === stateCount;
            const loadState = statesLoading[country];
            return (
              <YStack key={country} mb={24}>
                {/* Country header */}
                <XStack alignItems="center" gap="$3" mb={10} paddingLeft={0} paddingRight={20}>
                  <Text fontWeight="700" fontSize={16} color={colors.primary}>{country}</Text>
                  {!loadState && states.length > 0 && (
                    <Pressable onPress={() => toggleAllStates(country)}>
                      <Text fontSize={13} color={colors.gray} textDecorationLine="underline">
                        {allStatesSelected ? "Deselect all" : "Select all"}
                      </Text>
                    </Pressable>
                  )}
                </XStack>
                {loadState ? (
                  <XStack gap="$2" paddingLeft={20} py={8}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text fontSize={13} color={colors.gray}>Loading states...</Text>
                  </XStack>
                ) : (
                  states.map((state) => {
                    const key = makeKey(country, state);
                    const isSelected = selectedStateList.includes(state);
                    const isExpanded = isSearching ? true : expanded.has(key);
                    const lgas = lgasCache[key] || [];
                    const selectedLgas = selLgas[key] || [];
                    const loadingLga = !!lgasLoading[key];
                    return (
                      <YStack key={key}>
                        <StateRow
                          state={state}
                          selected={isSelected}
                          expanded={isExpanded}
                          lgaCount={lgas.length}
                          selLgaCount={selectedLgas.length}
                          onToggleState={() => toggleState(country, state)}
                          onToggleExpand={() => toggleExpand(key)}
                        />
                        {isExpanded && (
                          <LgaSection
                            lgas={lgas}
                            selected={selectedLgas}
                            loading={loadingLga}
                            onToggle={(lga) => toggleLga(key, lga)}
                            onToggleAll={() => toggleAllLgas(key)}
                          />
                        )}
                      </YStack>
                    );
                  })
                )}
              </YStack>
            );
          })}
          {filteredCountries.length === 0 && prefetchReady && (
            <Text fontSize={14} color={colors.gray} textAlign="center" py={20}>
              {selCountries.length === 0
                ? "Add countries above to set your coverage areas"
                : "No results match your search"}
            </Text>
          )}
        </ScrollView>

        {/* Save */}
        <Button
          backgroundColor={colors.primary}
          color="white"
          size="$4"
          mt={12}
          onPress={save}
          disabled={isSaving || !prefetchReady}
        >
          {isSaving ? "Saving..." : "Save & Continue"}
        </Button>
      </YStack>

      {/* Country modal */}
      <CountryPickerModal
        visible={countryModal}
        countries={countries}
        selected={selCountries}
        onToggle={toggleCountry}
        onClose={() => { setCountryModal(false); setCountryModalLoading(false); }}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────
const s = {
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  } as const,
  modalContent: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  } as const,
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  } as const,
  searchInput: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    color: "#1E1E1E",
  } as const,
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 4,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  } as const,
  checkboxOn: {
    backgroundColor: "#0E0E55",
  } as const,
  checkMark: {
    color: "white",
    fontSize: 14,
    fontWeight: "800",
  } as const,
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#0E0E55",
  } as const,
} as const;
