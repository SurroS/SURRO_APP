import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TextInput, View, FlatList, TouchableOpacity, Keyboard } from "react-native";
import { YStack, Text, Button } from "tamagui";
import { useRouter } from "expo-router";
import colors from "@/hooks/colors";
import { Toast } from "toastify-react-native";
import { ToastType } from "toastify-react-native/utils/interfaces";
import { useBankAccounts } from "@/hooks/payment/useBankAccounts";
import KeyboardAvoidingWrapper from "@/components/keyboardAvoidingWrapper";
import { NIGERIAN_BANKS } from "@/utils/nigerianBanks";

type FieldErrors = {
  holderName?: string;
  bankName?: string;
  accountNumber?: string;
};

const validateHolderName = (name: string): string | undefined => {
  const trimmed = name.trim();
  if (!trimmed) return "Account holder name is required";
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  if (/^\d+$/.test(trimmed)) return "Name cannot be only numbers";
  if (/^[^a-zA-Z]+$/.test(trimmed)) return "Name must include letters";
  return undefined;
};

const validateAccountNumber = (num: string): string | undefined => {
  const cleaned = num.replace(/\s/g, "");
  if (!cleaned) return "Account number is required";
  if (!/^\d+$/.test(cleaned)) return "Account number must be digits only";
  if (cleaned.length !== 10) return "Account number must be exactly 10 digits";
  return undefined;
};

export default function AddBankAccountScreen() {
  const router = useRouter();
  const { addAccount, isSubmitting } = useBankAccounts();

  const [holderName, setHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankInput, setBankInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const bankInputRef = useRef<TextInput>(null);

  const filteredBanks = bankInput.trim()
    ? NIGERIAN_BANKS.filter((b) =>
        b.name.toLowerCase().includes(bankInput.toLowerCase())
      )
    : NIGERIAN_BANKS;

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    const nameErr = validateHolderName(holderName);
    if (nameErr) errs.holderName = nameErr;
    if (!bankName) errs.bankName = "Select a bank";
    const acctErr = validateAccountNumber(accountNumber);
    if (acctErr) errs.accountNumber = acctErr;
    return errs;
  };

  const isFormValid = () => {
    return (
      holderName.trim().length >= 2 &&
      !/^\d+$/.test(holderName.trim()) &&
      /[a-zA-Z]/.test(holderName.trim()) &&
      !!bankName &&
      /^\d{10}$/.test(accountNumber.replace(/\s/g, ""))
    );
  };

  const handleBlur = (field: keyof FieldErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fresh = validate();
    setErrors((prev) => ({ ...prev, [field]: fresh[field] }));
  };

  const handleChange = (field: keyof FieldErrors, value: string, setter: (v: string) => void) => {
    setter(value);
    if (touched[field]) {
      const fresh = validate();
      setErrors((prev) => ({ ...prev, [field]: fresh[field] }));
    }
  };

  const selectBank = (name: string) => {
    setBankName(name);
    setBankInput(name);
    setShowSuggestions(false);
    setTouched((prev) => ({ ...prev, bankName: true }));
    setErrors((prev) => ({ ...prev, bankName: undefined }));
    Keyboard.dismiss();
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    setTouched({ holderName: true, bankName: true, accountNumber: true });
    if (Object.keys(errs).length > 0) return;

    try {
      await addAccount({ holderName, bankName, accountNumber, accountType: "", routingNumber: "" });
      Toast.show({
        text1: "Bank account added successfully",
        type: "customSuccess" as ToastType,
      });
      router.back();
    } catch {
      Toast.show({
        text1: "Failed to add account. Try again.",
        type: "customSError" as ToastType,
        text2: "something went wrong, try again later",
      });
    }
  };

  return (
    <KeyboardAvoidingWrapper>
      <SafeAreaView style={styles.container}>
        <YStack padding="$4" gap="$3" justifyContent="center">
          <Text style={styles.header}>Connect your bank account</Text>
          <Text style={styles.subHeader}>
            This is where your withdrawals will be deposited
          </Text>

          {/* Holder Name */}
          <View>
            <TextInput
              placeholder="Account holder name"
              placeholderTextColor="gray"
              value={holderName}
              onChangeText={(v) => handleChange("holderName", v, setHolderName)}
              onBlur={() => handleBlur("holderName")}
              style={[styles.input, errors.holderName && touched.holderName && styles.inputError]}
            />
            {errors.holderName && touched.holderName && (
              <Text style={styles.errorText}>{errors.holderName}</Text>
            )}
          </View>

          {/* Bank Name - Autocomplete */}
          <View>
            <TextInput
              ref={bankInputRef}
              placeholder="Bank name"
              placeholderTextColor="gray"
              value={bankInput}
              onChangeText={(v) => {
                setBankInput(v);
                setBankName("");
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
                handleBlur("bankName");
              }}
              style={[styles.input, errors.bankName && touched.bankName && styles.inputError]}
            />
            {showSuggestions && filteredBanks.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={filteredBanks}
                  keyExtractor={(item) => `${item.code}-${item.slug}`}
                  keyboardShouldPersistTaps="handled"
                  style={{ maxHeight: 180 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.suggestionItem,
                        bankName === item.name && styles.suggestionItemActive,
                      ]}
                      onPress={() => selectBank(item.name)}
                    >
                      <Text
                        style={[
                          styles.suggestionText,
                          bankName === item.name && styles.suggestionTextActive,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
            {errors.bankName && touched.bankName && !showSuggestions && (
              <Text style={styles.errorText}>{errors.bankName}</Text>
            )}
          </View>

          {/* Account Number */}
          <View>
            <TextInput
              placeholder="Account number"
              placeholderTextColor="gray"
              value={accountNumber}
              onChangeText={(v) => handleChange("accountNumber", v, setAccountNumber)}
              onBlur={() => handleBlur("accountNumber")}
              keyboardType="numeric"
              maxLength={10}
              style={[styles.input, errors.accountNumber && touched.accountNumber && styles.inputError]}
            />
            {errors.accountNumber && touched.accountNumber && (
              <Text style={styles.errorText}>{errors.accountNumber}</Text>
            )}
          </View>

          <YStack
            backgroundColor="#F1F4FF"
            borderRadius={10}
            padding={12}
            marginTop={8}
          >
            <Text style={styles.infoText}>
              Your information is encrypted and stored securely according to
              Google privacy policy.
            </Text>
          </YStack>

          <Button
            backgroundColor={colors.primary}
            borderRadius={12}
            color="#fff"
            onPress={handleSubmit}
            disabled={isSubmitting || !isFormValid()}
            opacity={isSubmitting || !isFormValid() ? 0.6 : 1}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </YStack>
      </SafeAreaView>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff" },
  header: { fontSize: 20, fontWeight: "700", color: colors.primary },
  subHeader: { color: "#555", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F8F8FA",
  },
  inputError: {
    borderColor: "#E63946",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#E63946",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginTop: 4,
    overflow: "hidden",
  },
  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  suggestionItemActive: {
    backgroundColor: "#F1F4FF",
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
  },
  suggestionTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },
  infoText: {
    color: "#0E0E55",
    fontSize: 13,
    textAlign: "center",
  },
});
