// ConnectivityTest.tsx
import axios from "axios";
import authApi from "@/services/authApi";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

const ConnectivityTest = () => {
  const [message, setMessage] = React.useState("Testing...");

  useEffect(() => {
    const test = async () => {
      try {
        // Test signup endpoint (this will fail with existing email, but tests connectivity)
        const res = await authApi.signup({
          email: "test@example.com",
          password: "testpassword123",
          role: "AGENT",
        });

        setMessage("✅ API reachable, response: " + JSON.stringify(res));
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            setMessage(
              `✅ API reachable, but error response: ${error.response.status} ${error.response.data?.message || "Validation error"}`,
            );
          } else if (error.request) {
            setMessage("❌ No response from server: " + error.message);
          } else {
            setMessage("❌ Error: " + error.message);
          }
        } else {
          setMessage("❌ Unexpected error: " + String(error));
        }
      }
    };

    test();
  }, []);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text>{message}</Text>
    </View>
  );
};

export default ConnectivityTest;
