import { useRouter } from "expo-router";
import { useRef, useCallback } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/hooks/useAuth";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { PrimaryButton } from "@/components/auth/PrimaryButton";
import { ScreenHeader } from "@/components/navigation/ScreenHeader";
import { useOtpForm } from "@/hooks/auth/useOtpForm";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const router = useRouter();
  const { otp, error, updateOtpDigit, validateOtp, getOtpCode } = useOtpForm();
  const { verifyOtp, resendOtp, tempEmail, isLoading } = useAuth();

  const hiddenInput = useRef<TextInput>(null);

  const handleHiddenInputChange = useCallback((text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    for (let i = 0; i < OTP_LENGTH; i++) {
      updateOtpDigit(i, digits[i] ?? "");
    }
  }, [updateOtpDigit]);

  const focusHiddenInput = useCallback(() => {
    hiddenInput.current?.focus();
  }, []);

  const handleVerify = async () => {
    console.log("handleVerify =", validateOtp());
    if (!validateOtp()) {
      return;
    }

    if (!tempEmail) {
      Toast.show({
        text1: "No email found. Please restart the process.",
        type: "customError" as ToastType,
        text2: "No email found. Please restart the process!",
      });
      return;
    }

    console.log("handleVerify =", getOtpCode());
    console.log("handleVerify =", tempEmail);
    try {
      await verifyOtp({
        email: tempEmail,
        code: getOtpCode(),
      });
    } catch (err) {
      console.error("OTP verification error:", err);
    }
  };

  const handleResendOtp = async () => {
    if (!tempEmail) {
      Toast.show({
        text1: "No email found. Please restart the process.",
        type: "customError" as ToastType,
        text2: "No email found. Please restart the process!",
      });
      return;
    }

    try {
      await resendOtp(tempEmail);
      Toast.show({
        text1: "OTP code has been resent to your email.",
        type: "customSuccess" as ToastType,
        text2: "OTP code has been resent to your email!",
      });
    } catch (err) {
      console.error("Resend OTP error:", err);
      Toast.show({
        text1: "Failed to resend OTP. Please try again.",
        type: "customError" as ToastType,
        text2: "Failed to resend OTP. Please try again!",
      });
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="Enter OTP" onBackPress={() => router.back()} />

        <Image
          source={require("../../assets/images/openemail.png")}
          style={styles.image}
        />

        <Text style={styles.infoText}>
          We&apos;ve sent a 6-digit verification code to{" "}
          {tempEmail || "your email"}.
        </Text>

        <Pressable onPress={focusHiddenInput} style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.otpBox,
                digit ? styles.otpBoxFilled : null,
              ]}
            >
              <Text style={styles.otpDigit}>{digit}</Text>
            </View>
          ))}
        </Pressable>

        <TextInput
          ref={hiddenInput}
          style={styles.hiddenInput}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          value={otp.join("")}
          onChangeText={handleHiddenInputChange}
          autoFocus
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <PrimaryButton
          title="Verify"
          onPress={handleVerify}
          loading={isLoading}
        />

        <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp}>
          <Text style={styles.resendText}>
            Didn&apos;t get the code?{" "}
            <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  container: {
    padding: 24,
    paddingTop: 30,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: "contain",
    alignSelf: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 30,
    width: "100%",
    alignSelf: "center",
  },
  otpBox: {
    width: 50,
    height: 50,
    backgroundColor: "#EBEBEB",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  otpBoxFilled: {
    backgroundColor: "#EBEBEB",
    borderWidth: 1,
    borderColor: "#0E0E55",
  },
  otpDigit: {
    fontSize: 22,
    color: "#333",
    textAlign: "center",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  errorText: {
    color: "red",
    marginTop: -10,
    marginBottom: 15,
    textAlign: "center",
  },
  resendButton: {
    marginTop: 20,
  },
  resendText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  resendLink: {
    color: "#0E0E55",
    fontWeight: "bold",
  },
});
