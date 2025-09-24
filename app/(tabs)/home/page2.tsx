import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Image, ImageBackground } from 'react-native'
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui'

export default function Page2() {
  const router = useRouter()

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      contentContainerStyle={{ alignItems: 'center', padding: 16, marginTop: 0 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Left Avatar + Progress */}
      <XStack position="absolute" top={60} left={20} alignItems="center" gap={10}>
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
            source={require('../../../assets/images/avatar.jpg')}
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
        </YStack>

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

      {/* Top Right Shape */}
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
        <Ionicons name="menu" size={16} color="#FFFFFF" />
        <YStack position="absolute" top={-4} right={-4}>
          <Ionicons name="search" size={14} color="#FFFFFF" />
        </YStack>
      </YStack>

      {/* Behind image (upright) */}
      <Image
        source={require('../../../assets/images/behind.jpg')}
        style={{
          width: 335,
          height: 500,
          marginTop: 137,
          borderRadius: 8,
          position: 'absolute',
        }}
      />

      {/* Main Image rotated -3 degrees with overlay text + icons rotated -3 degrees */}
      <ImageBackground
        source={require('../../../assets/images/page.jpg')}
        style={{
          width: 335,
          height: 500,
          marginTop: 120,
          borderRadius: 8,
          overflow: 'hidden',
          justifyContent: 'flex-start',
          transform: [{ rotate: '-3deg' }],
        }}
        imageStyle={{ resizeMode: 'cover', borderRadius: 8 }}
      >
        {/* Overlay text + icons */}
        <YStack
          width={129}
          paddingVertical={8}
          marginTop={235}
          marginLeft={16}
          gap={6}
          style={{ transform: [{ rotate: '-3deg' }] }} // rotate container
        >
          <Text fontSize={18} fontWeight="bold" color="white">
            Michelle John
          </Text>

          <XStack
            alignItems="center"
            gap={6}
            style={{ transform: [{ rotate: '-3deg' }] }} // rotate icons + text
          >
            <Ionicons name="location-sharp" size={16} color="white" />
            <Text fontSize={16} color="white">
              California
            </Text>
          </XStack>

          <XStack
            alignItems="center"
            gap={6}
            style={{ transform: [{ rotate: '-3deg' }] }} // rotate icons + text
          >
            <Ionicons name="calendar" size={16} color="white" />
            <Text fontSize={16} color="white">
              29 Years
            </Text>
          </XStack>
        </YStack>
      </ImageBackground>

      {/* Action Buttons */}
      <XStack marginTop={24} gap={16} width="100%">
        <Button
          size="$6"
          backgroundColor="#EBF4FE"
          borderRadius={8}
          flex={1}
          pressStyle={{ backgroundColor: '#D8EAFE' }}
        >
          <Text color="#0E0E55" fontWeight="400">
            Ignore
          </Text>
        </Button>

        <Button
          size="$6"
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

      {/* Navigation Button */}
      <Button
        size="$5"
        marginTop={24}
        onPress={() => router.push('/home/page3')} // 🔹 Navigate to Page 3
      >
        Next
      </Button>
    </ScrollView>
  )
}
