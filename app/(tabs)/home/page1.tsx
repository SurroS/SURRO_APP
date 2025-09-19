import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Image, ImageBackground } from 'react-native'
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui'

export default function Page1() {
  const router = useRouter()

  return (
    <ScrollView
      flex={1}
      backgroundColor="#FFFFFF"
      contentContainerStyle={{ alignItems: 'center', padding: 16, marginTop: 0 }} // 🔹 control page vertical offset here
      showsVerticalScrollIndicator={false}
    >
      {/* 🔹 Top Left Avatar + Progress Shape */}
      <XStack position="absolute" top={60} left={20} alignItems="center" gap={10}>
        {/* Avatar Shape */}
        <YStack
          width={50}
          height={50}
          borderRadius={100}
          backgroundColor="#FFFFFF"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          shadowColor="#000"
          shadowOpacity={0.1}
          shadowRadius={4}
        >
          <Image
            source={require('@/assets/images/avatar.jpg')}
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
        </YStack>

        {/* Progress Shape */}
        <XStack
          height={23}
          paddingHorizontal={8}
          borderRadius={12}
          borderWidth={1}
          borderColor="#6A1B4D"
          backgroundColor="#FFF3FA"
          alignItems="center"
          justifyContent="center"
          gap={10}
        >
          <Text fontSize={14} color="#6A1B4D">
            0% completed
          </Text>
        </XStack>
      </XStack>

      {/* 🔹 Top Right Shape with Overlapping Icons */}
      <YStack
        position="absolute"
        top={60}
        right={20}
        width={40}
        height={40}
        borderRadius={100}
        backgroundColor="#545453"
        alignItems="center"
        justifyContent="center"
        padding={12}
      >
        {/* Menu Icon */}
        <Ionicons name="menu" size={16} color="#FFFFFF" />

        {/* Search Icon overlapping top-right */}
        <YStack position="absolute" top={-4} right={-4}>
          <Ionicons name="search" size={14} color="#FFFFFF" />
        </YStack>
      </YStack>

      {/* 🔹 Image with overlay content */}
      <ImageBackground
        source={require('@/assets/images/page.jpg')}
        style={{
          width: 335,
          height: 500,
          marginTop: 120, // 🔹 adjust to push entire image down
          borderRadius: 8,
          overflow: 'hidden',
          justifyContent: 'flex-start',
        }}
        imageStyle={{ resizeMode: 'cover', borderRadius: 8 }}
      >
        {/* Overlay Info */}
        <YStack width={129} paddingVertical={8} marginTop={235} marginLeft={16} gap={6}>
          <Text fontSize={18} fontWeight="bold" color="white">
            Michelle John
          </Text>

          {/* Location */}
          <XStack alignItems="center" gap={6}>
            <Ionicons name="location-sharp" size={16} color="white" />
            <Text fontSize={16} color="white">
              California
            </Text>
          </XStack>

          {/* Calendar */}
          <XStack alignItems="center" gap={6}>
            <Ionicons name="calendar" size={16} color="white" />
            <Text fontSize={16} color="white">
              29 Years
            </Text>
          </XStack>
        </YStack>
      </ImageBackground>

      {/* 🔹 Action Buttons */}
      <XStack marginTop="$6" gap="$4" width="100%">
        {/* Ignore */}
        <Button
          size="$6"
          backgroundColor="#EBF4FE"
          borderRadius={8}
          flex={1}
          pressStyle={{ backgroundColor: '#D8EAFE' }}
        >
          <Text color="#0E0E55" fontWeight="00">
            Ignore
          </Text>
        </Button>

        {/* View Profile */}
        <Button
          size="$4"
          backgroundColor="#0E0E55"
          borderRadius={8}
          flex={1}
          pressStyle={{ backgroundColor: '#080836' }}
          onPress={() => console.log('View Profile pressed')}
        >
          <Text color="white" fontWeight="600">
            View Profile
          </Text>
        </Button>
      </XStack>

      {/* 🔹 Navigation Button */}
      <Button size="$5" marginTop="$6" onPress={() => router.push('/home/page2')}>
        Next
      </Button>
    </ScrollView>
  )
}
