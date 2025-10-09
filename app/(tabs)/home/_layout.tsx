// app/home/_layout.tsx
import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide headers for a clean UI
      }}
    >
      {/* Redirect entry (index) */}
      <Stack.Screen name="index" />

      {/* Main page with images */}
      <Stack.Screen name="HomeGallery" />

      {/* Placeholder for future pages */}
       <Stack.Screen name="GalleryScreen" />
        <Stack.Screen name="InviteScreen" />

       

    </Stack>
  )
}
