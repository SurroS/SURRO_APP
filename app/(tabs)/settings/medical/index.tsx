import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  YStack,
  XStack,
  Text,
  Card,
  Separator,
  ScrollView,
  View,
} from "tamagui";
import { router } from "expo-router";
import { FileUp, ClipboardList } from "@tamagui/lucide-icons";

import { ScreenHeader } from "@/components/auth";
import colors from "@/hooks/colors";
import { Ionicons } from "@expo/vector-icons";

export default function MedicalHistoryMain() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF",paddingTop: 20  }}>
      <View marginLeft={28}>
        <ScreenHeader
          title="Medical details"
          onBackPress={() => router.back()}
        />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <YStack flex={1} padding="$4" gap="$4">
          {/* Cards */}
          <YStack gap="$3" marginTop="$4">
            {/* Medical details */}
            <Card
              bordered
              borderWidth={0.5}
              pressStyle={{ scale: 0.98 }}
              padding="$4"
              onPress={() => router.push("/settings/medical/medical-one")}
            >
              <XStack alignItems="center" gap="$3">
                <ClipboardList size={28} color={colors.primary} />
                <YStack>
                  <Text color={"black"} fontWeight="700">
                    Medical details
                  </Text>
                  <Text color={"black"} fontSize={13}>
                    Provide health-related details
                  </Text>
                </YStack>
              </XStack>
            </Card>

            {/* Medical upload */}
            <Card
              bordered
              borderWidth={0.5}
              pressStyle={{ scale: 0.98 }}
              padding="$4"
              onPress={() => router.push("/settings/medical/medicalUpload")}
            >
              <XStack alignItems="center" gap="$3">
                <FileUp size={28} color={colors.primary} />
                <YStack>
                  <Text color={"black"} fontWeight="700">
                    Medical upload
                  </Text>
                  <Text fontSize={13} color={"black"}>
                    Upload your endometrium report
                  </Text>
                </YStack>
              </XStack>
            </Card>
          </YStack>

          <XStack
            backgroundColor="#E9F3FF"
            borderRadius="$4"
            padding="$3"
            marginTop="$3"
            alignItems="center"
            gap={7}
          >
            <Ionicons name="alert-circle" size={28} />
            <Text textWrap={"wrap"} fontSize={13} color="#003366">
              We require this information to ensure the best possible match.
              Rest assured, your documents{"\n"} are kept safe, private, and
              confidential.
            </Text>
          </XStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
