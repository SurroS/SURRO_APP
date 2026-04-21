import React, { useEffect, useState } from "react";
import { Button, Input, Text, YStack, XStack } from "tamagui";
import { useProfile } from "@/hooks/useProfile";
import { SurrogateProfile, SurrogateProfileUpdate } from "@/types/profile";

// Example component showing how to use the profile APIs
export const ProfileExample = () => {
  const {
    surrogateProfile,
    medicalProfile,
    isLoading,
    error,
    createProfile,
    updateProfile,
    fetchProfile,
    updateMedicalProfile,
    clearError,
  } = useProfile();

  const [formData, setFormData] = useState<Partial<SurrogateProfile>>({
    firstName: "",
    lastName: "",
    userName: "",
    countryOfOrigin: "",
    aboutMe: "",
    dateOfBirth: "",
    maritalStatus: "",
    height: "",
    weight: "",
    profilePicture: "",
    numberOfChildren: 0,
    countryOfResidence: "",
    stateOfOrigin: "",
    address: "",
    zipCode: "",
    phone1: "",
    phone2: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    facebookProfile: "",
    instagramProfile: "",
    twitterProfile: "",
    tiktokProfile: "",
    isAvailable: true,
    termsAcceptedAt: new Date().toISOString(),
  });

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update form data when profile is loaded
  useEffect(() => {
    if (surrogateProfile) {
      setFormData(surrogateProfile);
    }
  }, [surrogateProfile]);

  const handleCreateProfile = async () => {
    try {
      await createProfile(formData as SurrogateProfile);
      console.log("Profile created successfully");
    } catch (error) {
      console.error("Failed to create profile:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const updateData: SurrogateProfileUpdate = {
        firstName: formData.firstName ?? undefined,
        lastName: formData.lastName ?? undefined,
        // Add other fields as needed
      };

      await updateProfile(updateData);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleUpdateMedicalProfile = async () => {
    try {
      const medicalData = {
        genotype: "AA",
        bloodGroup: "A+",
        pregnancyExperience: true,
        numberOfChildren: 2,
        ceasareanSection: false,
        chronicIllnesses: ["None"],
      };
      await updateMedicalProfile(medicalData);
      console.log("Medical profile updated successfully");
    } catch (error) {
      console.error("Failed to update medical profile:", error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <YStack padding="$4" gap="$3">
      <Text fontSize="$6" fontWeight="bold">
        Profile Management
      </Text>

      {error && (
        <XStack backgroundColor="$red2" padding="$2" borderRadius="$2">
          <Text color="$red10">{error}</Text>
          <Button size="$2" onPress={clearError}>
            Clear
          </Button>
        </XStack>
      )}

      <YStack gap="$2">
        <Text fontSize="$4" fontWeight="bold">
          Basic Information
        </Text>

        <Input
          placeholder="First Name"
          value={formData.firstName ?? ""}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        />

        <Input
          placeholder="Last Name"
          value={formData.lastName ?? ""}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
        />

        <Input
          placeholder="Username"
          value={formData.userName}
          onChangeText={(text) => setFormData({ ...formData, userName: text })}
        />

        <Input
          placeholder="About Me"
          value={formData.aboutMe}
          onChangeText={(text) => setFormData({ ...formData, aboutMe: text })}
          multiline
          numberOfLines={3}
        />
      </YStack>

      <XStack gap="$2">
        <Button onPress={handleCreateProfile} disabled={isLoading} flex={1}>
          Create Profile
        </Button>

        <Button onPress={handleUpdateProfile} disabled={isLoading} flex={1}>
          Update Profile
        </Button>
      </XStack>

      <Button onPress={handleUpdateMedicalProfile} disabled={isLoading}>
        Update Medical Profile
      </Button>

      {surrogateProfile && (
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="bold">
            Current Profile
          </Text>
          <Text>
            Name: {surrogateProfile.firstName} {surrogateProfile.lastName}
          </Text>
          <Text>Username: {surrogateProfile.userName}</Text>
          <Text>Country: {surrogateProfile.countryOfOrigin}</Text>
          <Text>Available: {surrogateProfile.isAvailable ? "Yes" : "No"}</Text>
        </YStack>
      )}

      {medicalProfile && (
        <YStack gap="$2">
          <Text fontSize="$4" fontWeight="bold">
            Medical Profile
          </Text>
          <Text>Genotype: {medicalProfile.genotype}</Text>
          <Text>Blood Group: {medicalProfile.bloodGroup}</Text>
          <Text>
            Pregnancy Experience:{" "}
            {medicalProfile.pregnancyExperience ? "Yes" : "No"}
          </Text>
          <Text>Number of Children: {medicalProfile.numberofChildren}</Text>
          <Text>
            Caesarean Section: {medicalProfile.ceasareanSection ? "Yes" : "No"}
          </Text>
          <Text>
            Chronic Illness: {medicalProfile.chronicIllnessDetails || "None"}
          </Text>
          <Text>
            Pregnancy Complications:{" "}
            {medicalProfile.pregnancyComplicationsDetails}
          </Text>
        </YStack>
      )}
    </YStack>
  );
};
