import React, { useState, useEffect, useCallback } from "react";
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
import { getAllCountries } from "@/utils/countries";
import { getStatesByCountry, getLgaByState } from "@/utils/states";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";

interface PickerModalProps {
  visible: boolean;
  title: string;
  items: string[];
  selected: string[];
  allSelected: boolean;
  loading: boolean;
  disabled?: boolean;
  search: string;
  onSearchChange: (text: string) => void;
  onToggle: (item: string) => void;
  onToggleAll: () => void;
  onClose: () => void;
}

function PickerModal({
  visible,
  title,
  items,
  selected,
  allSelected,
  loading,
  disabled,
  search,
  onSearchChange,
  onToggle,
  onToggleAll,
  onClose,
}: PickerModalProps) {
  const filtered = items.filter((i) =>
    i.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
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
              }}
            >
              <Text
                fontWeight="700"
                fontSize={18}
                color={colors.text}
                marginBottom={12}
              >
                {title}
              </Text>

              <TextInput
                placeholder={`Search ${title}`}
                placeholderTextColor="#9B9B9B"
                value={search}
                onChangeText={onSearchChange}
                style={{
                  borderWidth: 1,
                  borderColor: "#E6E6E6",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  height: 40,
                  marginBottom: 8,
                  color: colors.text,
                }}
              />

              <ScrollView style={{ maxHeight: 350 }} nestedScrollEnabled>
                {loading ? (
                  <View
                    style={{
                      paddingVertical: 40,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text fontSize={14} color={colors.gray} marginTop={12}>
                      Loading...
                    </Text>
                  </View>
                ) : (
                  <>
                    <XStack
                      alignItems="center"
                      gap="$3"
                      paddingVertical={8}
                      onPress={disabled ? undefined : onToggleAll}
                      opacity={disabled ? 0.5 : 1}
                    >
                      <Pressable
                        onPress={disabled ? undefined : onToggleAll}
                        style={{
                          width: 20,
                          height: 20,
                          borderWidth: 1,
                          borderColor: "#E6E6E6",
                          borderRadius: 4,
                          backgroundColor: allSelected
                            ? colors.primary
                            : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {allSelected && (
                          <Text style={{ color: "white", fontSize: 14 }}>
                            ✓
                          </Text>
                        )}
                      </Pressable>
                      <Text color={colors.text} fontWeight="600">
                        All
                      </Text>
                    </XStack>

                    {filtered.map((item) => (
                      <XStack
                        key={item}
                        alignItems="center"
                        gap="$3"
                        paddingVertical={6}
                        onPress={disabled ? undefined : () => onToggle(item)}
                        opacity={disabled ? 0.5 : 1}
                      >
                        <Pressable
                          onPress={disabled ? undefined : () => onToggle(item)}
                          style={{
                            width: 20,
                            height: 20,
                            borderWidth: 1,
                            borderColor: "#E6E6E6",
                            borderRadius: 4,
                            backgroundColor: selected.includes(item)
                              ? colors.primary
                              : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {selected.includes(item) && (
                            <Text style={{ color: "white", fontSize: 14 }}>
                              ✓
                            </Text>
                          )}
                        </Pressable>
                        <Text color={colors.text}>{item}</Text>
                      </XStack>
                    ))}

                    {filtered.length === 0 && (
                      <Text
                        fontSize={14}
                        color={colors.gray}
                        paddingVertical={8}
                      >
                        No results found
                      </Text>
                    )}
                  </>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default function AgentCoverageSection() {
  const { updateAgentProfile } = useAgentProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [allCountries, setAllCountries] = useState<any[]>([]);

  const [selectedCountries, setSelectedCountries] = useState<any[]>([]);
  const [countryStates, setCountryStates] = useState<{
    [country: string]: string[];
  }>({});
  const [selectedStatesByCountry, setSelectedStatesByCountry] = useState<{
    [country: string]: string[];
  }>({});
  const [countryLgas, setCountryLgas] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedLgasByKey, setSelectedLgasByKey] = useState<{
    [key: string]: string[];
  }>({});

  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [stateModalTarget, setStateModalTarget] = useState<string | null>(null);
  const [lgaModalTarget, setLgaModalTarget] = useState<string | null>(null);

  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [lgaSearch, setLgaSearch] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const [statesLoading, setStatesLoading] = useState<{
    [country: string]: boolean;
  }>({});
  const [lgasLoading, setLgasLoading] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    (async () => {
      const data = await getAllCountries();
      setAllCountries(data);
    })();
  }, []);

  const loadStatesForCountry = useCallback(async (country: string) => {
    const states = await getStatesByCountry(country);
    return states.sort() as string[];
  }, []);

  const loadLgasForState = useCallback(
    async (country: string, state: string) => {
      const lgas = await getLgaByState(country, state);
      return lgas.sort() as string[];
    },
    []
  );

  const toggleCountry = useCallback(
    async (name: string) => {
      if (isBusy) return;
      setIsBusy(true);
      try {
        const isSelected = selectedCountries.some((sc) => sc.name === name);
        let newCountries: any[];
        if (isSelected) {
          newCountries = selectedCountries.filter((sc) => sc.name !== name);
          const newStates = { ...selectedStatesByCountry };
          const newLgas = { ...selectedLgasByKey };
          delete newStates[name];
          for (const key of Object.keys(newLgas)) {
            if (key.startsWith(name + "::")) delete newLgas[key];
          }
          setSelectedStatesByCountry(newStates);
          setSelectedLgasByKey(newLgas);
        } else {
          const country = allCountries.find((c) => c.name === name);
          if (!country) return;
          newCountries = [...selectedCountries, country];
          const states = await loadStatesForCountry(name);
          setCountryStates((prev) => ({ ...prev, [name]: states }));
        }
        setSelectedCountries(newCountries);
      } finally {
        setIsBusy(false);
      }
    },
    [isBusy, selectedCountries, allCountries, selectedStatesByCountry, selectedLgasByKey, loadStatesForCountry]
  );

  const toggleAllCountries = useCallback(async () => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      if (selectedCountries.length === allCountries.length) {
        setSelectedCountries([]);
        setCountryStates({});
        setSelectedStatesByCountry({});
        setCountryLgas({});
        setSelectedLgasByKey({});
      } else {
        setSelectedCountries([...allCountries]);
        const newStates: { [country: string]: string[] } = {};
        for (const c of allCountries) {
          newStates[c.name] = await loadStatesForCountry(c.name);
        }
        setCountryStates(newStates);

        const allSelectedStates: { [country: string]: string[] } = {};
        const allLgas: { [key: string]: string[] } = {};
        const allSelectedLgas: { [key: string]: string[] } = {};
        for (const c of allCountries) {
          allSelectedStates[c.name] = newStates[c.name];
          for (const s of newStates[c.name]) {
            const key = c.name + "::" + s;
            const lgas = await loadLgasForState(c.name, s);
            allLgas[key] = lgas;
            allSelectedLgas[key] = lgas;
          }
        }
        setSelectedStatesByCountry(allSelectedStates);
        setCountryLgas(allLgas);
        setSelectedLgasByKey(allSelectedLgas);
      }
    } finally {
      setIsBusy(false);
    }
  }, [isBusy, selectedCountries, allCountries, loadStatesForCountry, loadLgasForState]);

  const toggleStateForCountry = useCallback(
    async (country: string, state: string) => {
      if (isBusy) return;
      setIsBusy(true);
      try {
        const current = selectedStatesByCountry[country] || [];
        const isSelected = current.includes(state);
        let newStates: string[];
        if (isSelected) {
          newStates = current.filter((s) => s !== state);
        } else {
          newStates = [...current, state];
        }

        const newSelectedLgas = { ...selectedLgasByKey };
        if (isSelected) {
          for (const key of Object.keys(newSelectedLgas)) {
            if (key === country + "::" + state) delete newSelectedLgas[key];
          }
        } else {
          const key = country + "::" + state;
          const lgas = await loadLgasForState(country, state);
          setCountryLgas((prev) => ({ ...prev, [key]: lgas }));
          newSelectedLgas[key] = lgas;
        }

        setSelectedStatesByCountry((prev) => ({ ...prev, [country]: newStates }));
        setSelectedLgasByKey(newSelectedLgas);
      } finally {
        setIsBusy(false);
      }
    },
    [isBusy, selectedStatesByCountry, selectedLgasByKey, loadLgasForState]
  );

  const toggleAllStatesForCountry = useCallback(
    async (country: string) => {
      if (isBusy) return;
      setIsBusy(true);
      try {
        const allStates = countryStates[country] || [];
        const current = selectedStatesByCountry[country] || [];
        const allSelected = current.length === allStates.length;

        const newSelectedLgas = { ...selectedLgasByKey };

        if (allSelected) {
          for (const key of Object.keys(newSelectedLgas)) {
            if (key.startsWith(country + "::")) delete newSelectedLgas[key];
          }
          setSelectedStatesByCountry((prev) => ({ ...prev, [country]: [] }));
        } else {
          const allLgas: { [key: string]: string[] } = {};
          const selectedLgas: { [key: string]: string[] } = {};
          for (const s of allStates) {
            const key = country + "::" + s;
            const lgas = await loadLgasForState(country, s);
            allLgas[key] = lgas;
            selectedLgas[key] = lgas;
          }
          setCountryLgas((prev) => ({ ...prev, ...allLgas }));
          Object.assign(newSelectedLgas, selectedLgas);
          setSelectedStatesByCountry((prev) => ({ ...prev, [country]: [...allStates] }));
        }
        setSelectedLgasByKey(newSelectedLgas);
      } finally {
        setIsBusy(false);
      }
    },
    [isBusy, countryStates, selectedStatesByCountry, selectedLgasByKey, loadLgasForState]
  );

  const toggleLgaForKey = useCallback(
    (key: string, lga: string) => {
      const current = selectedLgasByKey[key] || [];
      setSelectedLgasByKey((prev) => ({
        ...prev,
        [key]: current.includes(lga)
          ? current.filter((l) => l !== lga)
          : [...current, lga],
      }));
    },
    [selectedLgasByKey]
  );

  const toggleAllLgasForKey = useCallback((key: string) => {
    setSelectedLgasByKey((prev) => {
      const current = prev[key] || [];
      const all = countryLgas[key] || [];
      return {
        ...prev,
        [key]: current.length === all.length ? [] : [...all],
      };
    });
  }, [countryLgas]);

  const save = async () => {
    if (isSaving) return;
    if (selectedCountries.length === 0) {
      Toast.show({
        text1: "Please select at least one country",
        type: "customError" as ToastType,
      });
      return;
    }
    setIsSaving(true);

    const coverageAreas = selectedCountries.map((c) => {
      const states = selectedStatesByCountry[c.name] || [];
      return {
        country: c.name,
        states: states.map((s) => ({
          name: s,
          lgas: selectedLgasByKey[c.name + "::" + s] || [],
        })),
      };
    });

    try {
      await updateAgentProfile({ coverageAreas });
      Toast.show({
        text1: "Coverage updated",
        type: "customSuccess" as ToastType,
      });
      router.back();
    } catch {
      Toast.show({
        text1: "Failed to update",
        type: "customError" as ToastType,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const countryNames = allCountries.map((c) => c.name);

  const openLgaModal = useCallback(
    async (country: string, state: string) => {
      if (isBusy) return;
      const key = country + "::" + state;
      setLgaModalTarget(key);
      setLgaSearch("");

      if (!countryLgas[key]) {
        setLgasLoading((prev) => ({ ...prev, [key]: true }));
        const lgas = await loadLgasForState(country, state);
        setCountryLgas((prev) => ({ ...prev, [key]: lgas }));
        setLgasLoading((prev) => ({ ...prev, [key]: false }));
      }
    },
    [isBusy, countryLgas, loadLgasForState]
  );

  const renderLgaSection = (country: string, state: string) => {
    const key = country + "::" + state;
    const lgas = countryLgas[key] || [];
    const selected = selectedLgasByKey[key] || [];
    const loading = lgasLoading[key];

    return (
      <YStack key={key} gap="$2" paddingLeft={16} marginTop={8}>
        <Text fontWeight="600" fontSize={14} color={colors.text}>
          {state} - LGAs
        </Text>
        <Pressable onPress={() => openLgaModal(country, state)}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#E6E6E6",
              borderRadius: 8,
              padding: 12,
              fontSize: 15,
              color: "#333",
            }}
            value={
              loading
                ? "Loading..."
                : selected.length === 0
                  ? "Select LGAs"
                  : selected.length === lgas.length
                    ? "All"
                    : selected.join(", ")
            }
            editable={false}
            multiline
          />
        </Pressable>

        <PickerModal
          visible={lgaModalTarget === key}
          title={`${state} - LGAs`}
          items={lgas}
          selected={selected}
          allSelected={selected.length === lgas.length}
          loading={loading}
          disabled={isBusy}
          search={lgaSearch}
          onSearchChange={setLgaSearch}
          onToggle={(lga) => toggleLgaForKey(key, lga)}
          onToggleAll={() => toggleAllLgasForKey(key)}
          onClose={() => setLgaModalTarget(null)}
        />
      </YStack>
    );
  };

  const openStateModal = useCallback(
    async (country: string) => {
      if (isBusy) return;
      setStateModalTarget(country);
      setStateSearch("");

      if (!countryStates[country]) {
        setStatesLoading((prev) => ({ ...prev, [country]: true }));
        const states = await loadStatesForCountry(country);
        setCountryStates((prev) => ({ ...prev, [country]: states }));
        setStatesLoading((prev) => ({ ...prev, [country]: false }));
      }
    },
    [isBusy, countryStates, loadStatesForCountry]
  );

  const renderStateSection = (country: string) => {
    const states = countryStates[country] || [];
    const selectedStates = selectedStatesByCountry[country] || [];
    const loading = statesLoading[country];

    return (
      <YStack key={country} gap="$2" paddingLeft={12} marginTop={12}>
        <Text fontWeight="700" fontSize={16} color={colors.primary}>
          {country}
        </Text>
        <Pressable onPress={() => openStateModal(country)}>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#E6E6E6",
              borderRadius: 8,
              padding: 12,
              fontSize: 15,
              color: "#333",
            }}
            value={
              loading
                ? "Loading..."
                : selectedStates.length === 0
                  ? "Select states"
                  : selectedStates.length === states.length
                    ? "All"
                    : selectedStates.join(", ")
            }
            editable={false}
            multiline
          />
        </Pressable>

        <PickerModal
          visible={stateModalTarget === country}
          title={`${country} - States`}
          items={states}
          selected={selectedStates}
          allSelected={selectedStates.length === states.length}
          loading={loading}
          disabled={isBusy}
          search={stateSearch}
          onSearchChange={setStateSearch}
          onToggle={(s) => toggleStateForCountry(country, s)}
          onToggleAll={() => toggleAllStatesForCountry(country)}
          onClose={() => setStateModalTarget(null)}
        />

        {selectedStates.map((s) => renderLgaSection(country, s))}
      </YStack>
    );
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ScreenHeader
          title="Coverage Areas"
          onBackPress={() => router.back()}
        />

        <ScrollView>
          <YStack gap="$4">
            <YStack gap="$2">
              <Text fontWeight="600" fontSize={15} color={colors.text}>
                Countries
              </Text>
              <Pressable onPress={() => { setCountryModalOpen(true); setCountrySearch(""); }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#E6E6E6",
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 15,
                    color: "#333",
                  }}
                  value={
                    selectedCountries.length === 0
                      ? "Select countries"
                      : selectedCountries.length === allCountries.length
                        ? "All"
                        : selectedCountries.map((c) => c.name).join(", ")
                  }
                  editable={false}
                  multiline
                />
              </Pressable>
            </YStack>

            {selectedCountries.map((c) => renderStateSection(c.name))}

            <Button
              backgroundColor={colors.primary}
              color="white"
              size="$4"
              marginTop={20}
              onPress={save}
              disabled={isSaving}
            >
              Save & Continue
            </Button>
          </YStack>
        </ScrollView>

        <PickerModal
          visible={countryModalOpen}
          title="Countries"
          items={countryNames}
          selected={selectedCountries.map((c) => c.name)}
          allSelected={selectedCountries.length === allCountries.length}
          disabled={isBusy}
          search={countrySearch}
          onSearchChange={setCountrySearch}
          onToggle={toggleCountry}
          onToggleAll={toggleAllCountries}
          onClose={() => setCountryModalOpen(false)}
        />
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}