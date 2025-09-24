import { Ionicons } from '@expo/vector-icons'
import { Image, ScrollView } from 'react-native'
import { Button, Text, View, XStack, YStack } from 'tamagui'

export default function ProfilePage() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ padding: 16 }}
    >
      {/* Header Profile Section */}
      <XStack alignItems="center" gap={12}>
        {/* Profile Picture */}
        <Image
          source={require('@/assets/images/profile.jpg')} // replace with your image
          style={{ width: 72, height: 72, borderRadius: 8 }}
        />

        {/* Name, Handle, Location, Age, Status */}
        <YStack flex={1} gap={4}>
          <Text fontSize={18} fontWeight="600" color="#000">
            Michelle John
          </Text>
          <Text fontSize={14} color="#666">
            @Micah
          </Text>
          <XStack gap={6} alignItems="center">
            <Ionicons name="location-sharp" size={16} color="#666" />
            <Text fontSize={14} color="#666">
              California
            </Text>
          </XStack>
          <XStack gap={6} alignItems="center">
            <Ionicons name="calendar" size={16} color="#666" />
            <Text fontSize={14} color="#666">
              29 Years
            </Text>
            <View
              style={{
                backgroundColor: '#E6F9ED',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 6,
                marginLeft: 8,
              }}
            >
              <Text fontSize={12} fontWeight="600" color="#0A9B4D">
                Available
              </Text>
            </View>
          </XStack>
        </YStack>
      </XStack>

      {/* About Section */}
      <YStack marginTop={20} gap={6}>
        <Text fontSize={16} fontWeight="600" color="#000">
          About
        </Text>
        <Text fontSize={14} color="#444">
          Becoming a surrogate is deeply personal for me. I’ve had smooth, joyful
          pregnancies and believe that helping someone start or grow their family is
          one of the most meaningful…
        </Text>
        <Text fontSize={14} color="#0A84FF" fontWeight="600">
          Read more
        </Text>
      </YStack>

      {/* Contact Section */}
      <YStack marginTop={20} gap={6}>
        <Text fontSize={16} fontWeight="600" color="#000">
          Contact
        </Text>
        <XStack alignItems="center" gap={8}>
          <Ionicons name="mail" size={16} color="#444" />
          <Text fontSize={14} color="#444">
            michelle@gmail.com
          </Text>
        </XStack>
        <XStack alignItems="center" gap={8}>
          <Ionicons name="call" size={16} color="#444" />
          <Text fontSize={14} color="#444">
            2363487892
          </Text>
        </XStack>
      </YStack>

      {/* Socials Section */}
      <YStack marginTop={20} gap={6}>
        <Text fontSize={16} fontWeight="600" color="#000">
          Socials
        </Text>
        <XStack gap={12}>
          <Ionicons name="logo-facebook" size={20} color="#1877F2" />
          <Ionicons name="logo-instagram" size={20} color="#E1306C" />
          <Text fontSize={14} color="#444">
            @mich123
          </Text>
        </XStack>
      </YStack>

      {/* Preview as Guest */}
      <Button
        size="$5"
        borderRadius={8}
        marginTop={20}
        backgroundColor="#F6F8FA"
        pressStyle={{ backgroundColor: '#EAEFF3' }}
      >
        <Text color="#000">Preview profile as a guest</Text>
      </Button>

      {/* Wallet + Gallery Section */}
      <XStack marginTop={20} gap={12} width="100%">
        {/* Wallet Card */}
        <YStack
          flex={1}
          backgroundColor="#0E0E55"
          borderRadius={12}
          padding={16}
          gap={8}
        >
          <Text fontSize={14} color="#fff" fontWeight="500">
            Surro wallet
          </Text>
          <Text fontSize={20} fontWeight="700" color="#fff">
            $40,000.00
          </Text>
          <Text fontSize={12} color="#ddd">
            TOTAL BALANCE
          </Text>
        </YStack>

        {/* Gallery Card */}
        <YStack
          width={120}
          borderRadius={12}
          backgroundColor="#F6F6F6"
          overflow="hidden"
          alignItems="center"
        >
          <Image
            source={require('@/assets/images/gallery.jpg')} // replace with your gallery image
            style={{ width: '100%', height: 120 }}
          />
          <Text fontSize={12} marginVertical={8}>
            Gallery
          </Text>
        </YStack>
      </XStack>

      {/* Finish Setup Progress */}
      <XStack
        marginTop={20}
        padding={12}
        backgroundColor="#FFF5E5"
        borderRadius={12}
        alignItems="center"
        gap={12}
      >
        <Ionicons name="warning" size={20} color="#F59E0B" />
        <YStack flex={1}>
          <Text fontSize={14} fontWeight="600" color="#F59E0B">
            Finish setting up your account
          </Text>
        </YStack>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </XStack>
    </ScrollView>
  )
}
