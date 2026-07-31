import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text, YStack } from "tamagui";
import colors from "@/hooks/colors";

interface PaymentStatusScreenProps {
  onDone: () => void;
}

const PaymentStatusScreen: React.FC<PaymentStatusScreenProps> = ({
  onDone,
}) => {
  const [status, setStatus] = useState<"processing" | "success">("processing");
  const spinValue = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Create interpolation for spinner rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Start the spinning animation
  const startSpinning = () => {
    spinValue.setValue(0);
    animationRef.current = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animationRef.current.start();
  };

  // Stop the animation safely
  const stopSpinning = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };

  useEffect(() => {
    if (status === "processing") {
      startSpinning();
    } else {
      stopSpinning();
    }

    const timer = setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onDone();
      }, 500);
    }, 3000);

    return () => {
      stopSpinning();
      clearTimeout(timer);
    };
  }, [status, onDone]);

  const isProcessing = status === "processing";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <YStack
        width="100%"
        paddingHorizontal={20}
        paddingTop={30}
        marginBottom={40}
        alignItems="center"
      >
        <Text fontSize={18} fontWeight="600" color="#000000">
          Payment Processing
        </Text>
      </YStack>

      <YStack alignItems="center" paddingHorizontal={20}>
        {isProcessing ? (
          <>
            <Animated.View
              style={[
                statusStyles.spinnerContainer,
                { transform: [{ rotate: spin }] },
              ]}
            />
            <Text style={statusStyles.message}>
              Please wait while we process your payment
            </Text>
          </>
        ) : (
          <>
            <View style={statusStyles.successIconContainer}>
              <Ionicons name="checkmark" size={40} color={colors.white} />
            </View>
            <Text style={statusStyles.title}>Payment Successful</Text>
            <Text style={statusStyles.message}>
              Your wallet has been topped up successfully. We’ve sent your
              receipt to your email.
            </Text>
          </>
        )}
      </YStack>
    </SafeAreaView>
  );
};

const statusStyles = StyleSheet.create({
  spinnerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: "rgba(14, 14, 85, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderTopColor: colors.ACTION_NAVY_BLUE,
    borderLeftColor: colors.ACTION_NAVY_BLUE,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.SUCCESS_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.headerText,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.secondaryGray,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

export default PaymentStatusScreen;
