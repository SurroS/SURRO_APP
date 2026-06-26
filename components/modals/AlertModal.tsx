import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface AlertButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  onClose?: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title,
  message,
  buttons,
  onClose,
}) => {
  const handlePress = (btn: AlertButton) => {
    btn.onPress?.();
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {buttons && buttons.length > 0 ? (
            <View style={styles.buttonRow}>
              {buttons.map((btn, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.button,
                    btn.style === "cancel" && styles.cancelButton,
                    btn.style === "destructive" && styles.destructiveButton,
                    i > 0 && styles.buttonBorder,
                  ]}
                  onPress={() => handlePress(btn)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      btn.style === "cancel" && styles.cancelText,
                      btn.style === "destructive" && styles.destructiveText,
                    ]}
                  >
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity style={styles.singleButton} onPress={onClose}>
              <Text style={styles.singleButtonText}>OK</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 24,
    width: "80%",
    maxWidth: 340,
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e0e0e0",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: "#e0e0e0",
  },
  cancelButton: {},
  destructiveButton: {},
  buttonText: {
    fontSize: 16,
    color: "#0E0E55",
    fontWeight: "600",
  },
  cancelText: {
    fontWeight: "500",
    color: "#888",
  },
  destructiveText: {
    color: "#FF3B30",
  },
  singleButton: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e0e0e0",
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  singleButtonText: {
    fontSize: 16,
    color: "#0E0E55",
    fontWeight: "600",
  },
});

export default AlertModal;
