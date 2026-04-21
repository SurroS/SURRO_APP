import React from "react";
import { Modal, View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";


interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeight?: number;
}

export default function PaymentModal({ visible, onClose, children, maxHeight }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose} // tap outside to close
      >
        <View style={[styles.modalContent, maxHeight ? { maxHeight } : {}]}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
