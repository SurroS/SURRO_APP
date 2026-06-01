import React, { useEffect, useState } from "react";
import { TextInput, ActivityIndicator } from "react-native";
import { YStack, XStack, Button, Label, ScrollView } from "tamagui";
import CountryFlag from "react-native-country-flag";
import { ScreenHeader } from "@/components/auth";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Dropdown from "@/components/DropDown";
import TextInputField from "@/components/TextInputField";
import { getAllCountries } from "@/utils/countries";
import { getStatesByCountry } from "@/utils/states";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useParentProfile } from "@/hooks/profile/useParentProfile";
import { useAgentProfile } from "@/hooks/profile/useAgentProfile";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

export default function ContactInformationScreen() {
  const { user } = useAuth();
  const Role = user?.role?.trim() ?? "";

  const {
    surrogateProfile,
    updateProfile,
    fetchProfile,
    isLoading: surrogateLoading,
  } = useProfile();
  const {
    parentProfile,
    updateParentProfile,
    fetchParentProfile,
    isLoading: parentLoading,
  } = useParentProfile();
  const {
    agentProfile,
    updateAgentProfile,
    fetchAgentProfile,
    isLoading: agentLoading,
  } = useAgentProfile();

  const isLoading = surrogateLoading || parentLoading || agentLoading;

  const [countries, setCountries] = useState<any[]>([]);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [lgaList, setLgaList] = useState<string[]>([]);

  const [country, setCountry] = useState<any | null>(null);
  const [state, setState] = useState<string>("");
  const [lga, setLga] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [phone1, setPhone1] = useState<string>("");
  const [phone2, setPhone2] = useState<string>("");
  const [emergency, setEmergency] = useState<string>("");
  const [relationship, setRelationship] = useState<string>("");

  useEffect(() => {
    (async () => {
      const data = await getAllCountries();
      setCountries(data);
    })();

    if (!Role) return;

    if (Role === "SURROGATE" && !surrogateProfile) fetchProfile();
    else if (Role === "INTENDED_PARENT" && !parentProfile) fetchParentProfile();
    else if (Role === "AGENT" && !agentProfile) fetchAgentProfile();
  }, [Role]);

  // Strip dial code safely and always return string
  const stripDialCode = (phone?: string | null): string => {
    if (!phone || !country?.dialCode) return "";
    return phone.startsWith(country.dialCode)
      ? phone.slice(country.dialCode.length)
      : phone;
  };

  // Populate form based on role
  useEffect(() => {
    const profile =
      Role === "SURROGATE"
        ? surrogateProfile
        : Role === "INTENDED_PARENT"
        ? parentProfile
        : Role === "AGENT"
        ? agentProfile
        : null;

    if (!profile) return;

    setPhone1(stripDialCode(profile?.phone1 ?? ""));
    setPhone2(stripDialCode(profile?.phone2 ?? ""));
    setEmergency(stripDialCode(profile?.emergencyContactPhone ?? ""));
    setRelationship(profile?.emergencyContactRelation ?? "");
    setStreet(profile?.address ?? "");
    setZip(profile?.zipCode ?? "");
    setState(profile?.stateOfOrigin ?? "");
    setLga(profile?.lga ?? "");

    if (countries.length > 0) {
      const countryField = profile?.countryOfResidence;
      if (countryField) {
        const foundCountry = countries.find((c) => c.name === countryField);
        if (foundCountry) {
          setCountry(foundCountry);
          getStatesByCountry(foundCountry.name).then(setStatesList);
        }
      }
    }
  }, [
    surrogateProfile,
    parentProfile,
    agentProfile,
    countries,
    Role,
    country?.dialCode,
  ]);

  const handleSelectCountry = async (selected: any) => {
    const selectedCountry = typeof selected === "string"
      ? countries.find((c) => c.name === selected || c.label === selected)
      : selected;
    if (!selectedCountry) return;
    setCountry(selectedCountry);
    setState("");
    setLga("");
    setStatesList([]);
    setLgaList([]);
    const states = await getStatesByCountry(selectedCountry.name);
    setStatesList(states);
  };

  const handleSave = async () => {
    if (
      !country ||
      !state ||
      !lga ||
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

    const fullPhone1 = country.dialCode
      ? `${country.dialCode}${phone1}`
      : phone1;
    const fullPhone2 = phone2
      ? country.dialCode
        ? `${country.dialCode}${phone2}`
        : phone2
      : undefined;
    const fullEmergency = country.dialCode
      ? `${country.dialCode}${emergency}`
      : emergency;

    const profileData = {
      countryOfResidence: country.name,
      stateOfOrigin: state,
      lga,
      address: street,
      zipCode: zip,
      phone1: fullPhone1,
      phone2: fullPhone2,
      emergencyContactPhone: fullEmergency,
      emergencyContactRelation: relationship,
    };

    try {
      if (Role === "SURROGATE") await updateProfile(profileData);
      else if (Role === "INTENDED_PARENT")
        await updateParentProfile(profileData);
      else if (Role === "AGENT") await updateAgentProfile(profileData);

      Toast.show({
        text1: "Contact information updated successfully",
        type: "customSuccess" as ToastType,
        text2: "Your contact details have been saved",
      });

      router.push("/medical");
    } catch (error: any) {
      Toast.show({
        text1: "Update Failed",
        type: "customError" as ToastType,
        text2:
          error?.response?.data?.message ||
          "Failed to update contact information. Please try again.",
      });
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
        <ScreenHeader
          title="Contact Information"
          onBackPress={() => router.back()}
        />

        <ScrollView style={{ flex: 1 }}>
          <YStack gap="$4">
          <Dropdown
            label="Country of residence"
            placeholder="Select a country"
            value={country?.name ?? ""}
            options={countries}
            onSelect={handleSelectCountry}
          />

          <TextInputField
            label="State"
            placeholder="Enter your current state"
            value={state}
            onChangeText={setState}
          />
          <TextInputField
            label="Local Government Area"
            placeholder="Enter your current LGA"
            value={lga}
            onChangeText={setLga}
          />
          <TextInputField
            label="Street address"
            placeholder="Street your current address"
            value={street}
            onChangeText={setStreet}
          />
          <TextInputField
            label="Zip code"
            placeholder="Enter your current Zip code"
            value={zip}
            onChangeText={setZip}
          />

          {[
            "Phone number",
            "Phone number 2 (optional)",
            "Emergency contact number",
          ].map((label, i) => (
            <YStack key={label} gap="$1">
              <Label fontWeight="600" fontSize={15} color="#000">
                {label}
              </Label>
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
                    isoCode={country?.iso2?.toLowerCase() ?? "ng"}
                    size={18}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      height: 50,
                      paddingHorizontal: 10,
                      color: "#000",
                      fontSize: 16,
                    }}
                    value={i === 0 ? phone1 : i === 1 ? phone2 : emergency}
                    onChangeText={
                      i === 0 ? setPhone1 : i === 1 ? setPhone2 : setEmergency
                    }
                    placeholder="0123456789"
                    placeholderTextColor="#9B9B9B"
                    keyboardType="numeric"
                  />
                </XStack>
              </XStack>
            </YStack>
          ))}

          <Dropdown
            label="Relationship with emergency contact"
            placeholder="Select relationship"
            value={relationship}
            options={["Spouse", "Parent", "Sibling", "Friend"]}
            onSelect={setRelationship}
          />

          <Button
            backgroundColor="#0A043C"
            color="white"
            size="$4"
            marginTop={20}
            disabled={isLoading}
            opacity={isLoading ? 0.7 : 1}
            onPress={handleSave}
          >
            {isLoading ? <ActivityIndicator color="white" /> : "Save"}
          </Button>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
