import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { YStack, Button } from "tamagui";
import { ScreenHeader } from "@/components/auth";
import SurrogatePersonalFields from "@/components/profileDetails/SurrogatePersonalProfile";
import ParentPersonalFields from "@/components/profileDetails/ParentPersonalFields";
import AgentPersonalFields from "@/components/profileDetails/AgentPersonalDetails";
import { getAllCountries } from "@/utils/countries";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { router } from "expo-router";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import { useAuth } from "@/hooks/useAuth";

export default function PersonalInformationScreen() {
  const Role = useAuth().user?.role?.trim();

  const [countries, setCountries] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState<any>(null);
  const [dob, setDob] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");

  // SURROGATE ONLY
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

    // Surrogate must fill height/weight
    if (Role === "SURROGATE" && (!height || !weight)) {
      Toast.show({
        text1: "Height and weight are required",
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
      height: Role === "SURROGATE" ? height : undefined,
      weight: Role === "SURROGATE" ? weight : undefined,
      children: Role === "SURROGATE" ? children : undefined,
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

            {/* Role-specific fields */}
            {Role === "SURROGATE" && (
              <SurrogatePersonalFields
                height={height}
                weight={weight}
                children={children}
                setHeight={setHeight}
                setWeight={setWeight}
                setChildren={setChildren}
              />
            )}
            {/* Role-specific fields */}
            {Role === "INTENDED_PARENT" && (
              <ParentPersonalFields
                height={height}
                weight={weight}
                children={children}
                setHeight={setHeight}
                setWeight={setWeight}
                setChildren={setChildren}
              />
            )}
                        {/* Role-specific fields */}
            {Role === "AGENT" && (
              <AgentPersonalFields
                height={height}
                weight={weight}
                children={children}
                setHeight={setHeight}
                setWeight={setWeight}
                setChildren={setChildren}
              />
            )}
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
