import React from "react";
import {
  KeyboardAvoidingView,
  View,
  StyleSheet,
} from "react-native";

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
}

const KeyboardAvoidingWrapper: React.FC<KeyboardAvoidingWrapperProps> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <View style={styles.inner}>{children}</View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    flex: 1,  
    backgroundColor: "#fff",
  },
});

export default KeyboardAvoidingWrapper;
