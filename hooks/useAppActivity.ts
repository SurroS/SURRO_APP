import { useEffect } from "react";
import { AppState } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEY = "lastActiveAt";

export const useAppActivity = () => {
  useEffect(() => {
    const update = async () => {
      await SecureStore.setItemAsync(KEY, Date.now().toString());
    };

    update();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") update();
    });

    return () => sub.remove();
  }, []);
};

export const getLastActive = async () => {
  const v = await SecureStore.getItemAsync(KEY);
  return v ? Number(v) : null;
};
