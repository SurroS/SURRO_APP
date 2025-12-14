import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import colors from "@/hooks/colors";

interface MedicalData {
  genotype?: string;
  bloodGroup?: string;
  pregnant?: string;
  children?: number;
  caesarean?: string;
  numberOfCs?: number;
  hasAllergies?: string;
  allergies?: string;
  hasChronicIllness?: string;
  chronicIllnesses?: string[];
  otherChronicIllness?: string;
  takesMedication?: string;
  medications?: string;
  hadSurgery?: string;
  surgeries?: string;
  hasDisability?: string;
  disabilities?: string;
  hadMiscarriage?: string;
  numberOfMiscarriages?: number;
  medicalReport?: string | undefined;
}

interface Props {
  data: MedicalData;
  containerStyle?: object;
  reportVisible: boolean;
  unlockReport: () => void;
}

export default function MedicalSection({
  data,
  containerStyle,
  reportVisible,
  unlockReport,
}: Props) {
  const renderArray = (arr?: string[]) =>
    arr && arr.length > 0 ? arr.join(", ") : "-";

  const openFile = (uri: string | undefined) => {
    // For PDFs/images

    data?.medicalReport?.endsWith(".pdf") ? (
      <Text style={{ color: colors.white }}>View Lab result</Text>
    ) : (
      <Image source={{ uri: data.medicalReport  }} style={styles.reportImage} />
    );
    Linking.openURL(uri as any).catch((err) =>
      console.error("Failed to open file", err)
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>Medical Summary</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Genotype:</Text>
        <Text style={styles.value}>{data.genotype || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Blood Group:</Text>
        <Text style={styles.value}>{data.bloodGroup || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Pregnant:</Text>
        <Text style={styles.value}>{data.pregnant || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Children:</Text>
        <Text style={styles.value}>{data.children ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Caesarean:</Text>
        <Text style={styles.value}>{data.caesarean || "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Number of Caesareans:</Text>
        <Text style={styles.value}>{data.numberOfCs ?? "-"}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Allergies:</Text>
        <Text style={styles.value}>
          {data.hasAllergies === "yes" ? data.allergies || "-" : "No"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Chronic Illness:</Text>
        <Text style={styles.value}>
          {data.hasChronicIllness === "yes"
            ? `${renderArray(data.chronicIllnesses)}${
                data.otherChronicIllness ? ", " + data.otherChronicIllness : ""
              }`
            : "No"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Medication:</Text>
        <Text style={styles.value}>
          {data.takesMedication === "yes" ? data.medications || "-" : "No"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Surgery:</Text>
        <Text style={styles.value}>
          {data.hadSurgery === "yes" ? data.surgeries || "-" : "No"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Disability:</Text>
        <Text style={styles.value}>
          {data.hasDisability === "yes" ? data.disabilities || "-" : "No"}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Miscarriage:</Text>
        <Text style={styles.value}>
          {data.hadMiscarriage === "yes"
            ? data.numberOfMiscarriages ?? "-"
            : "No"}
        </Text>
      </View>

      {reportVisible  ? (
        <>
          <Text style={styles.label}>Lab Result</Text>
          <TouchableOpacity
            onPress={() => openFile(data.medicalReport)}
            style={styles.fileButton}
          >
            <Text style={{ color: colors.white }}>View Lab result</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity onPress={unlockReport} style={styles.lockedReport}>
          <Text style={styles.lockedText}>Lab Result Locked</Text>
          <Entypo name="lock" size={18} color="gray" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#222222",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: "#444444",
  },
  value: {
    color: "#555555",
  },
  fileButton: {
    marginTop: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: colors.primary,
    width: "100%",
    height: 50,
  },
  fileText: {
    color: colors.white,
    fontWeight: "600",
  },
  reportImage: {
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  lockedReport: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    alignItems: "center",
  },
  lockedText: {
    color: "gray",
    fontSize: 14,
  },
});
