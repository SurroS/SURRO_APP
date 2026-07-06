import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
  const { otp, error, updateOtpDigit, setOtpFromString, validateOtp, getOtpCode } = useOtpForm();
  const { verifyOtp, resendOtp, tempEmail, isLoading } = useAuth();

  const [otpCode, setOtpCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleOtpChange = useCallback((text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    setOtpCode(digits);
    setOtpFromString(digits);
  }, [setOtpFromString]);

  const handleVerify = async () => {
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
    if (!tempEmail || isResending) return;
    setIsResending(true);
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
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Enter OTP" onBackPress={() => router.back()} />

        <Image
          source={require("../../assets/images/openemail.png")}
          style={styles.image}
        />

        <Text style={styles.infoText}>
          We&apos;ve sent a 6-digit verification code to{" "}
          {tempEmail || "your email"}.
        </Text>

        <View style={styles.otpContainer}>
          <TextInput
            style={styles.hiddenInput}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            value={otpCode}
            onChangeText={handleOtpChange}
            autoFocus
            caretHidden
          />
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
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <PrimaryButton
          title="Verify"
          onPress={handleVerify}
          loading={isLoading}
        />

        <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp} disabled={isResending}>
          <Text style={styles.resendText}>
            Didn&apos;t get the code?{" "}
            <Text style={[styles.resendLink, isResending && { opacity: 0.5 }]}>
              {isResending ? "Resending..." : "Resend"}
            </Text>
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
    position: "relative",
  },
  otpBox: {
    width: 50,
    height: 50,
    backgroundColor: "#EBEBEB",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#D0D0D0",
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    zIndex: 1,
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
