import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, ActivityIndicator } from "react-native";
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
import { useProfile } from "@/hooks/useProfile";
import { useParentProfile } from "@/hooks/useParent";
import { useAgentProfile } from "@/hooks/useAgentProfile";

export default function PersonalInformationScreen() {
  const Role = useAuth().user?.role?.trim();

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

    if (Role === "SURROGATE" && !surrogateProfile) {
      fetchProfile();
    } else if (Role === "INTENDED_PARENT" && !parentProfile) {
      fetchParentProfile();
    } else if (Role === "AGENT" && !agentProfile) {
      fetchAgentProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (countries.length > 0) {
      if (Role === "SURROGATE" && surrogateProfile) {
        setFirstName(surrogateProfile.firstName || "");
        setLastName(surrogateProfile.lastName || "");
        setDob(surrogateProfile.dateOfBirth || "");
        setMaritalStatus(surrogateProfile.maritalStatus || "");
        setHeight(surrogateProfile.height || "");
        setWeight(surrogateProfile.weight || "");
        setChildren(surrogateProfile.numberOfChildren || 0);

        if (surrogateProfile.countryOfOrigin) {
          const foundCountry = countries.find(
            (c) => c.name === surrogateProfile.countryOfOrigin
          );
          if (foundCountry) {
            setCountry(foundCountry);
          }
        }
      } else if (Role === "INTENDED_PARENT" && parentProfile) {
        const fullNameParts = parentProfile.fullName?.split(" ") || [];
        setFirstName(fullNameParts[0] || "");
        setLastName(fullNameParts.slice(1).join(" ") || "");

        if (parentProfile.countryOfResidence) {
          const foundCountry = countries.find(
            (c) => c.name === parentProfile.countryOfResidence
          );
          if (foundCountry) {
            setCountry(foundCountry);
          }
        }
      } else if (Role === "AGENT" && agentProfile) {
        const nameParts = (
          agentProfile.fullName ||
          agentProfile.name ||
          ""
        ).split(" ");
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(" ") || "");
        setDob(
          agentProfile.dateOfBirth
            ? new Date(agentProfile.dateOfBirth).toISOString().split("T")[0]
            : ""
        );

        if (agentProfile.country) {
          const foundCountry = countries.find(
            (c) => c.name === agentProfile.country
          );
          if (foundCountry) {
            setCountry(foundCountry);
          }
        }
      }
    }
  }, [surrogateProfile, parentProfile, agentProfile, countries, Role]);

  const handleSave = async () => {
    if (Role === "SURROGATE") {
      if (!height || !weight) {
        Toast.show({
          text1: "Height and weight are required",
          type: "customError" as ToastType,
        });
        return;
      }
    } else if (Role === "INTENDED_PARENT" || Role === "AGENT") {
      if (!firstName || !country || !dob || !maritalStatus) {
        Toast.show({
          text1: "Please fill all required fields",
          type: "customError" as ToastType,
        });
        return;
      }
    }

    try {
      if (Role === "SURROGATE") {
        const profileData: any = {
          height,
          weight,
          numberOfChildren: children,
        };

        if (firstName) profileData.firstName = firstName;
        if (lastName) profileData.lastName = lastName;
        if (country) profileData.countryOfOrigin = country.name;
        if (dob) profileData.dateOfBirth = dob;
        if (maritalStatus) profileData.maritalStatus = maritalStatus;

        await updateProfile(profileData);
      } else if (Role === "INTENDED_PARENT") {
        const profileData = {
          fullName: firstName.trim(),
          countryOfResidence: country.name,
          dateOfBirth: dob,
          maritalStatus,
        };
        await updateParentProfile(profileData);
      } else if (Role === "AGENT") {
        const profileData = {
          fullName: firstName.trim(),
          country: country.name,
          dateOfBirth: dob || undefined,
          maritalStatus,
        };
        await updateAgentProfile(profileData);
      }

      Toast.show({
        text1: "Personal information updated successfully",
        type: "customSuccess" as ToastType,
        text2: "Your personal details have been saved",
      });

      router.push("/settings/profile/contactInformation");
    } catch (error: any) {
      Toast.show({
        text1: "Update Failed",
        type: "customError" as ToastType,
        text2:
          error?.response?.data?.message ||
          "Failed to update personal information. Please try again.",
      });
    }
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
                fullName={firstName}
                country={country}
                dob={dob}
                maritalStatus={maritalStatus}
                countries={countries}
                setFirstName={setFirstName}
                setCountry={setCountry}
                setDob={setDob}
                setMaritalStatus={setMaritalStatus}
                height={height}
                weight={weight}
                // eslint-disable-next-line react/no-children-prop
                children={children}
                setHeight={setHeight}
                setWeight={setWeight}
                setChildren={setChildren}
              />
            )}
            {Role === "INTENDED_PARENT" && (
              <ParentPersonalFields
                fullName={firstName}
                country={country}
                dob={dob}
                maritalStatus={maritalStatus}
                countries={countries}
                setFirstName={setFirstName}
                setCountry={setCountry}
                setDob={setDob}
                setMaritalStatus={setMaritalStatus}
              />
            )}
            {Role === "AGENT" && (
              <AgentPersonalFields
                fullName={firstName}
                country={country}
                dob={dob}
                maritalStatus={maritalStatus}
                countries={countries}
                setFirstName={setFirstName}
                setCountry={setCountry}
                setDob={setDob}
                setMaritalStatus={setMaritalStatus}
              />
            )}
            <Button
              backgroundColor="#0A043C"
              color="white"
              size="$4"
              marginTop={20}
              marginBottom={20}
              disabled={isLoading}
              opacity={isLoading ? 0.7 : 1}
              onPress={handleSave}
            >
              {isLoading ? <ActivityIndicator color="white" /> : "Save changes"}
            </Button>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}
