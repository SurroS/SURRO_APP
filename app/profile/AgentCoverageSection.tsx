import React, { useState, useEffect, useRef } from "react"; 
import {  View, Pressable, TextInput } from "react-native";
import { YStack, Button, ScrollView, XStack, Text, Popover } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import Dropdown from "@/components/DropDown";
import { router } from "expo-router";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { getAllCountries } from "@/utils/countries";
import { getStatesByCountry, getLgaByState } from "@/utils/states";
import colors from "@/hooks/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

export default function AgentCoverageSection() {
  const [isSaving, setIsSaving] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [lgaList, setLgaList] = useState<string[]>([]);

  const [country, setCountry] = useState<any>(null);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedLGAs, setSelectedLGAs] = useState<string[]>([]);

  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [lgaDropdownOpen, setLgaDropdownOpen] = useState(false);

  const stateTriggerRef = useRef<View>(null!);
  const lgaTriggerRef = useRef<View>(null!);

  const [statePopoverWidth, setStatePopoverWidth] = useState(200);
  const [lgaPopoverWidth, setLgaPopoverWidth] = useState(200);

  const [stateSearch, setStateSearch] = useState("");
  const [lgaSearch, setLgaSearch] = useState("");

  const [filteredStates, setFilteredStates] = useState<string[]>([]);
  const [filteredLGAs, setFilteredLGAs] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getAllCountries();
      setCountries(data);
    })();
  }, []);

  const onSelectCountry = async (c: any) => {
    setCountry(c);
    setSelectedStates([]);
    setSelectedLGAs([]);
    setLgaList([]);
    setStateSearch("");
    setLgaSearch("");
    const states = await getStatesByCountry(c.name);
    setStatesList(states);
    setFilteredStates(states);
  };

  const toggleState = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const toggleLGA = (lga: string) => {
    setSelectedLGAs((prev) =>
      prev.includes(lga) ? prev.filter((l) => l !== lga) : [...prev, lga]
    );
  };

  useEffect(() => {
    const fetchLGAs = async () => {
      if (!country || selectedStates.length === 0) {
        setLgaList([]);
        setFilteredLGAs([]);
        setSelectedLGAs([]);
        return;
      }

      const lgasSet = new Set<string>();
      for (let s of selectedStates) {
        const lg = await getLgaByState(country.name, s);
        lg.forEach((l:any) => lgasSet.add(l));
      }
      const lgasArray = Array.from(lgasSet).sort();
      setLgaList(lgasArray);
      setFilteredLGAs(lgasArray);
      setSelectedLGAs([]);
    };

    fetchLGAs();
  }, [selectedStates, country]);

  useEffect(() => {
    setFilteredStates(
      statesList.filter((s) =>
        s.toLowerCase().includes(stateSearch.toLowerCase())
      )
    );
  }, [stateSearch, statesList]);

  useEffect(() => {
    setFilteredLGAs(
      lgaList.filter((l) =>
        l.toLowerCase().includes(lgaSearch.toLowerCase())
      )
    );
  }, [lgaSearch, lgaList]);

  const save = () => {
    if (isSaving) return;
    if (!country || selectedStates.length === 0 || selectedLGAs.length === 0) {
      Toast.show({
        text1: "Please complete all required fields",
        type: "customError" as ToastType,
      });
      return;
    }

    setIsSaving(true);

    Toast.show({
      text1: "Coverage updated",
      type: "customSuccess" as ToastType,
    });

    router.back();
  };

  const renderMultiSelectPopover = (
    triggerRef: React.RefObject<View>,
    dropdownOpen: boolean,
    setDropdownOpen: (open: boolean) => void,
    popoverWidth: number,
    setPopoverWidth: (w: number) => void,
    options: string[],
    selected: string[],
    toggleItem: (item: string) => void,
    placeholder: string,
    search: string,
    setSearch: (val: string) => void,
    showSelectAll: boolean = false,
    selectAllFn?: () => void,
    clearAllFn?: () => void
  ) => (
    <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <Popover.Trigger asChild>
        <Pressable
          ref={triggerRef}
          onLayout={(e) => setPopoverWidth(e.nativeEvent.layout.width)}
          style={{
            borderWidth: 1,
            borderColor: "#E6E6E6",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <Text style={{ color: selected.length ? colors.text : colors.gray }}>
            {selected.length > 0 ? selected.join(", ") : placeholder}
          </Text>
        </Pressable>
      </Popover.Trigger>

      <Popover.Content
        style={{
          width: popoverWidth,
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#E6E6E6",
          borderRadius: 8,
          padding: 10,
          maxHeight: 300,
        }}
      >
        <YStack gap="$2">
          <TextInput
            placeholder={`Search ${placeholder}`}
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderColor: "#E6E6E6",
              borderRadius: 8,
              paddingHorizontal: 10,
              height: 40,
              marginBottom: 10,
              color: colors.text,
            }}
            placeholderTextColor="#9B9B9B"
          />

          {showSelectAll && selectAllFn && clearAllFn && (
            <XStack justifyContent="space-between" marginBottom={10}>
              <Button
                size="$3"
                backgroundColor={colors.primary}
                color="white"
                onPress={selectAllFn}
              >
                Select All
              </Button>
              <Button
                size="$3"
                backgroundColor="#E6E6E6"
                color={colors.text}
                onPress={clearAllFn}
              >
                Clear All
              </Button>
            </XStack>
          )}

          <ScrollView style={{ maxHeight: 200 }}>
            {options.map((item) => (
              <XStack
                key={item}
                alignItems="center"
                justifyContent="flex-start"
                gap="$3"
                paddingVertical={6}
              >
                <Pressable
                  onPress={() => toggleItem(item)}
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
                    <Text style={{ color: "white", fontSize: 14 }}>✓</Text>
                  )}
                </Pressable>
                <Text color={colors.text}>{item}</Text>
              </XStack>
            ))}

            {options.length === 0 && (
              <Text fontSize={14} color={colors.gray} paddingVertical={6}>
                No items found
              </Text>
            )}
          </ScrollView>
        </YStack>
      </Popover.Content>
    </Popover>
  );

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <ScreenHeader title="Coverage Area" onBackPress={() => router.back()} />

        <ScrollView>
        <YStack gap="$4">
          <Dropdown
            label="Country"
            placeholder="Select"
            options={countries}
            value={country?.name}
            onSelect={onSelectCountry}
          />

          {renderMultiSelectPopover(
            stateTriggerRef,
            stateDropdownOpen,
            setStateDropdownOpen,
            statePopoverWidth,
            setStatePopoverWidth,
            filteredStates,
            selectedStates,
            toggleState,
            "state(s)",
            stateSearch,
            setStateSearch,
            true,
            () => setSelectedStates([...filteredStates]),
            () => setSelectedStates([])
          )}

          {renderMultiSelectPopover(
            lgaTriggerRef,
            lgaDropdownOpen,
            setLgaDropdownOpen,
            lgaPopoverWidth,
            setLgaPopoverWidth,
            filteredLGAs,
            selectedLGAs,
            toggleLGA,
            "LGA(s)",
            lgaSearch,
            setLgaSearch,
            true,
            () => setSelectedLGAs([...filteredLGAs]),
            () => setSelectedLGAs([])
          )}

          {/* CTA Button */}
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
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}