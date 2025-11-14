import React, { useEffect, useState } from "react";
import { TextInput, View, Text } from "react-native";
import { YStack, XStack, Button, Label, ScrollView } from "tamagui";
import CountryFlag from "react-native-country-flag";
import colors from "@/hooks/colors";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "@/components/DropDown";
import TextInputField from "@/components/TextInputField";
import { getAllCountries } from "@/utils/countries";
import { getStatesByCountry, getLgaByState } from "@/utils/states";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";

export default function ContactInformationScreen() {
  const [countries, setCountries] = useState<any[]>([]);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [country, setCountry] = useState<any>(null);
  const [state, setState] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [emergency, setEmergency] = useState("");
  const [lGA, setLGA] = useState("");
  const [relationship, setRelationship] = useState("");

  useEffect(() => {
    (async () => {
      const data = await getAllCountries();
      setCountries(data);
    })();
  }, []);

  const handleSelectCountry = async (selected: any) => {
    setCountry(selected);
    const states = await getStatesByCountry(selected.name);
    setStatesList(states);
  };

  const HandleSave = () => {
    if (
      !country ||
      !state ||
      !lGA ||
      !street ||
      !zip ||
      !phone1 ||
      !emergency ||
      !relationship
    ) {
      Toast.show({
        text1: "Please fill all required fields",
        type: "customError" as ToastType,
      });
      return;
    }
    router.push("/settings/medical");
    Toast.show({
      text1: "Profile updated successfully",
      type: "customSuccess" as ToastType,
    });
    console.log("contact data saved");
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <ScreenHeader
        title="Contact Information"
        onBackPress={() => router.back()}
      />
      <ScrollView style={{ flex: 1 }}>
        <YStack gap="$4">
          {/* Country */}
          <Dropdown
            label="Country of residence"
            placeholder="Select a country"
            value={country?.name || ""}
            options={countries}
            onSelect={handleSelectCountry}
          />
          {/* State */}
          <Dropdown
            label="State"
            placeholder="Select a state"
            value={state}
            options={statesList}
            onSelect={(val) => setState(val.name || val)}
          />
          <TextInputField
            label="Local Government Area"
            placeholder="LGA"
            value={lGA}
            onChangeText={setLGA}
          />
          <TextInputField
            label="Street address"
            placeholder="Street address"
            value={street}
            onChangeText={setStreet}
          />
          <TextInputField
            label="Zip code"
            placeholder="Zip code"
            value={zip}
            onChangeText={setZip}
          />
          {/* Phone number */}
          {[
            "Phone number",
            "Phone number 2 (optional)",
            "Emergency contact number",
          ].map((label, i) => (
            <YStack key={label} gap="$1">
              <Label color={colors.text}>{label}</Label>
              <XStack
                alignItems="center"
                borderWidth={1}
                borderColor="#E6E6E6"
                borderRadius={8}
                overflow="hidden"
              >
                <XStack
                  alignItems="center"
                  paddingHorizontal={8}
                  borderRightWidth={1}
                  borderColor="#E6E6E6"
                >
                  <CountryFlag
                    isoCode={country?.iso2?.toLowerCase() || "ng"}
                    size={18}
                  />
                  <Text style={{ color: colors.text, marginLeft: 4 }}>
                    {country?.dialCode || "+234"}
                  </Text>
                </XStack>
                <TextInput
                  style={{
                    flex: 1,
                    height: 50,
                    paddingHorizontal: 10,
                    color: colors.text,
                    fontSize: 16,
                  }}
                  value={i === 0 ? phone1 : i === 1 ? phone2 : emergency}
                  onChangeText={
                    i === 0 ? setPhone1 : i === 1 ? setPhone2 : setEmergency
                  }
                  placeholder="0000000000"
                  placeholderTextColor="#9B9B9B"
                  keyboardType="numeric"
                />
              </XStack>
            </YStack>
          ))}
          <Dropdown
            label="Relationship with emergency contact"
            placeholder="Select relationship"
            value={relationship}
            options={["Spouse", "Parent", "Sibling", "Friend"]}
            onSelect={(val) => setRelationship(val.name || val)}
          />
          <Button
            backgroundColor="#0A043C"
            color="white"
            size="$4"
            marginTop={20}
            onPress={() => HandleSave()}
          >
            Save
          </Button>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
