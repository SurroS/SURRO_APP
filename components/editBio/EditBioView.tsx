// components/editBio/EditBioView.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, ScrollView } from "tamagui";

import RectangleCard from "./rectangleCard";
import ProfileImageCard from "./profileImageCard";
import InfoRowCard from "./infoRowCard";
// // import EditBioModal from "@/EditBioModal";
// import { Images } from "@/components/Images";
import { User, Contact,History } from "@tamagui/lucide-icons";

export default function EditBioView() {
  const [isModalVisible, setIsModalVisible] = useState(false); 

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack padding="$4" gap="$4" alignItems="center">
          {/* Header card */}
          <RectangleCard title="Profile information" />

          {/* Profile image card */}
          <YStack width="100%" alignItems="center" marginTop={-20}>
            <ProfileImageCard
              onChangePicture={() => {
                // handle change-picture modal later if needed
              }}
              onEditBio={() => setIsModalVisible(true)} // open modal
            />
          </YStack>

          {/* Info rows */}
          <YStack width={347} gap="$3" marginTop={12}>
            <InfoRowCard
              title="Personal details"
              subtitle="Name, country of origin, height, Date of Birth"
              icon={User}
              onPress={() => {}}
            />
            <InfoRowCard
              title="Contact information"
              subtitle="Country, state, street, zip code"
              icon={Contact}
              onPress={() => {}}
            />
            <InfoRowCard
              title="Medical history"
              subtitle="Allergies, conditions"
              icon={ History }
              onPress={() => {}}
            />
          </YStack>
        </YStack>
      </ScrollView>

      {/* Edit Bio Modal */}
      {/* <EditBioModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      /> */}
    </SafeAreaView>
  );
}
