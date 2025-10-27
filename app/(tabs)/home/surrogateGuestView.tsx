// app/(tabs)/home/guessview/index.tsx
import GuestView from "@/components/guest/GuestView";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuessViewScreen() {
  return (
    <SafeAreaView>
      <GuestView />
    </SafeAreaView>
  );
}
