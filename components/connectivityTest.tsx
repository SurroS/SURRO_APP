// ConnectivityTest.tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import api from "@/services/api"; // <-- your axios instance

const ConnectivityTest = () => {
  const [message, setMessage] = React.useState("Testing...");

  useEffect(() => {
    const test = async () => {
      try {
        // Change to an endpoint you know exists
        const res = await api.post("/auth/sign_in", {
          email: "test@example.com",
          password: "wrongpassword",
        });

        setMessage("✅ API reachable, response: " + JSON.stringify(res.data));
      } catch (err: any) {
        if (err.response) {
          // The server responded with a status code (like 401)
          setMessage(
            `✅ API reachable, but error response: ${err.response.status} ${err.response.data?.message}`
          );
        } else if (err.request) {
          // The request was made but no response received
          setMessage("❌ No response from server: " + err.message);
        } else {
          // Something else happened
          setMessage("❌ Error: " + err.message);
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
