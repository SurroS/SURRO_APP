import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { YStack, Button } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import TextInputField from "@/components/TextInputField";
import Dropdown from "@/components/DropDown";
import NumberInputSelect from "@/components/NumberInputSelect";
import { getAllCountries } from "@/utils/countries";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { router } from "expo-router";
import NumberInput from "@/components/NumberInput";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

export default function PersonalInformationScreen() {
  const [countries, setCountries] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState<any>(null);
  const [dob, setDob] = useState(""); // can integrate date picker later
  const [maritalStatus, setMaritalStatus] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [children, setChildren] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await getAllCountries();
      setCountries(data);
    })();
  }, []);

  const handleSave = () => {
    if (!firstName || !lastName || !country || !dob || !maritalStatus) {
      Toast.show({
        text1: "Please fill all required fields",
        type: "customError" as ToastType,
      });
      return;
    }
    router.push("/settings/profile/contactInformation");
    Toast.show({
      text1: "Personal information saved successfully",
      type: "customSuccess" as ToastType,
    });

    console.log({
      firstName,
      lastName,
      country: country?.name,
      dob,
      maritalStatus,
      height,
      weight,
      children,
    });
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
        <ScreenHeader
          title="Personal Information"
          onBackPress={() => router.back()}
        />
        <ScrollView style={{ flex: 1, padding: 20 }}>
          <YStack gap="$4">
            <TextInputField
              label="First name"
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInputField
              label="Last name"
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
            />
            <Dropdown
              label="Country"
              placeholder="Select a country"
              value={country?.name || ""}
              options={countries}
              onSelect={setCountry}
            />
            <NumberInput
              label="Date of birth"
              placeholder="DD/MM/YYYY"
              value={dob}
              onChange={(text) => setDob(text)}
            />
            <Dropdown
              label="Marital status"
              placeholder="Select"
              value={maritalStatus}
              options={["Single", "Married", "Divorced", "Widowed"]}
              onSelect={setMaritalStatus}
            />
            <YStack gap="$2">
              <NumberInput
                label="Height (cm)"
                value={height}
                onChange={(text) => setHeight(text)}
                placeholder="Enter height in cm"
              />

              <NumberInput
                label="Weight (kg)"
                value={weight}
                onChange={(text) => setWeight(text)}
                placeholder="Enter weight in kg"
              />

              <NumberInputSelect
                label="Number of children if any"
                value={children}
                onChange={setChildren}
              />
            </YStack>

            <Button
              backgroundColor="#0A043C"
              color="white"
              size="$4"
              marginTop={20}
              marginBottom={20}
              onPress={handleSave}
            >
              Save changes
            </Button>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
