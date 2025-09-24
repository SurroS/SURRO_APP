import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Image,
  ImageBackground,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native'
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui'

export default function Page3() {
  const router = useRouter()
  const [showVerificationAlert, setShowVerificationAlert] = useState(false)

  // Animated values
  const pageOpacity = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(300)).current // modal starts offscreen

  useEffect(() => {
    if (showVerificationAlert) {
   
      // Slide modal up
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    } else {
      // Restore background
      Animated.timing(pageOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()

      // Slide modal down
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [showVerificationAlert])

  return (
    <View style={{ flex: 1 }}>
      {/* Main Page Content */}
      <ScrollView
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        contentContainerStyle={{ alignItems: 'center', padding: 16, marginTop: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ flex: 1, width: '100%', opacity: pageOpacity }}>
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

          {/* Behind image (upright faded) */}
          <Image
            source={require('../../../assets/images/behind.jpg')}
            style={{
              width: 335,
              height: 500,
              marginTop: 137,
              borderRadius: 8,
              position: 'absolute',
              overflow: 'hidden',
              justifyContent: 'flex-start',
            }}
          />

          {/* Main Profile Image (rotated & faded) */}
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
            {/* Overlay text */}
            <YStack width={129} paddingVertical={8} marginTop={235} marginLeft={16} gap={6}>
              <Text fontSize={18} fontWeight="bold" color="white">
                Michelle John
              </Text>

              <XStack alignItems="center" gap={6}>
                <Ionicons name="location-sharp" size={16} color="white" />
                <Text fontSize={16} color="white">
                  California
                </Text>
              </XStack>

              <XStack alignItems="center" gap={6}>
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
              borderRadius={12}
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
              borderRadius={12}
              flex={1}
              pressStyle={{ backgroundColor: '#080836' }}
              onPress={() => setShowVerificationAlert(true)}
            >
              <Text color="white" fontWeight="600">
                View Profile
              </Text>
            </Button>
          </XStack>
        </Animated.View>
      </ScrollView>

      {/* Verification Modal */}
      {showVerificationAlert && (
        <Modal
          visible={showVerificationAlert}
          transparent
          animationType="none"
          onRequestClose={() => setShowVerificationAlert(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              justifyContent: 'flex-end',
            }}
          >
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
              }}
            >
              <YStack
                backgroundColor="#FFFFFF"
                borderTopLeftRadius={32}
                borderTopRightRadius={32}
                paddingHorizontal={20}
                paddingTop={12}
                paddingBottom={24}
                alignItems="center"
                width="100%"
              >
                {/* Top Handle Shape */}
                <YStack
                  width={117}
                  height={6}
                  borderRadius={3}
                  backgroundColor="#DDD"
                  marginBottom={16}
                />

                {/* Warning Banner */}
                <XStack
                  width={353}
                  minHeight={56}
                  backgroundColor="#FEF3E9"
                  borderRadius={12}
                  alignItems="center"
                  justifyContent="center"
                  paddingHorizontal={12}
                  marginBottom={16}
                >
                  <Text fontSize={16} fontWeight="600" color="#945016" textAlign="center">
                    Your account is not verified
                  </Text>
                </XStack>

                {/* Description */}
                <Text
                  fontSize={14}
                  color="#444"
                  textAlign="center"
                  marginBottom={20}
                >
                  You need to complete your account setup and verify your profile before
                  you can view this profile.
                </Text>

                {/* Action Buttons */}
                <XStack gap={12} width="100%">
                  <Button
                    flex={1}
                    size="$6"
                    backgroundColor="#EBF4FE"
                    borderRadius={12}
                    onPress={() => setShowVerificationAlert(false)}
                  >
                    <Text color="#0E0E55" fontWeight="500">
                      Dismiss
                    </Text>
                  </Button>

                  <Button
                    flex={1}
                    size="$6"
                    backgroundColor="#0E0E55"
                    borderRadius={12}
                    onPress={() => {
                      setShowVerificationAlert(false)
                      router.push('/verify')
                    }}
                  >
                    <Text color="white" fontWeight="600">
                      Verify profile
                    </Text>
                  </Button>
                </XStack>
              </YStack>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  )
}
