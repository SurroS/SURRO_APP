// app/home/_layout.tsx
import { Stack } from "expo-router";

export default function surrogateLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
    >
      {/* surrogateProfileScreen moved to /surrogate/surrogateProfileScreen */}
    </Stack>
  );
}
