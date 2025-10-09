// app/(tabs)/home/guessview/index.tsx
import React from "react";
import GuessView from "@/components/guess/GuessView";

/**
 * Route bridge for GuessView component
 * -------------------------------------------------
 * Allows Expo Router to navigate to GuessView
 * while keeping the bottom tabs visible.
 */
export default function GuessViewScreen() {
  return <GuessView />;
}
