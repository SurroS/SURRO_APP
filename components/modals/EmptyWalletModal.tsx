import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onTopUp: () => void;
}

export default function EmptyWalletModal({ visible, onClose, onTopUp }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <View style={styles.modalContainer}>
          <Ionicons name="wallet-outline" size={42} color="#0A2A66" />

          <Text style={styles.title}>You have insufficient funds in your wallet</Text>

          <Text style={styles.subtitle}>
            You need to top up your wallet to continue.  
            Please add funds to proceed with this action.
          </Text>

          <TouchableOpacity style={styles.topUpBtn} onPress={onTopUp}>
            <Text style={styles.topUpText}>Top-up Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  topUpBtn: {
    width: "100%",
    backgroundColor: "#0A2A66",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  topUpText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelBtn: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 15,
  },
});
