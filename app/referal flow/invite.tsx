import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Clipboard, Image, Linking, ScrollView } from 'react-native'
import { Button, Text, XStack, YStack } from 'tamagui'

export default function InviteScreen() {
  const router = useRouter()
  const [inviteLink] = useState('https://yourapp.com/invite/abcd1234') // replace or set dynamically
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await Clipboard.setString(inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
      Alert.alert('Copied', 'Invite link copied to clipboard')
    } catch (e) {
      console.error(e)
      Alert.alert('Error', 'Failed to copy link')
    }
  }

  const handleShare = (mode: 'whatsapp' | 'facebook' | 'mail' | 'x') => {
    // lightweight share actions - replace with real share module as needed
    switch (mode) {
      case 'whatsapp':
        Linking.openURL(`whatsapp://send?text=${encodeURIComponent(inviteLink)}`).catch(() =>
          Alert.alert('Unable', 'WhatsApp not available')
        )
        break
      case 'facebook':
        Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}`)
        break
      case 'mail':
        Linking.openURL(`mailto:?subject=Join%20me&body=${encodeURIComponent(inviteLink)}`)
        break
      case 'x':
        Linking.openURL(`https://twitter.com/intent/tweet?text=${encodeURIComponent(inviteLink)}`)
        break
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      contentContainerStyle={{ padding: 16, alignItems: 'stretch' }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <XStack alignItems="center" justifyContent="space-between" marginBottom={18}>
        <Button
          size="$3"
          backgroundColor="transparent"
          onPress={() => router.back()}
          pressStyle={{ opacity: 0.8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#0E0E55" />
        </Button>

        <Text fontSize={18} fontWeight="700" color="#0E0E55">
          Refer a friend
        </Text>

        {/* placeholder for alignment */}
        <YStack width={36} />
      </XStack>

      {/* Hero row: gift image (tilted) + title & redeem button */}
      <XStack alignItems="center" gap={12} marginBottom={18}>
        {/* Rotated gift card (keeps design consistency) */}
        <YStack
          width={120}
          height={120}
          borderRadius={12}
          overflow="hidden"
          justifyContent="center"
          alignItems="center"
          style={{ transform: [{ rotate: '-3deg' }] }}
          backgroundColor="#FFF"
          shadowColor="#000"
          // subtle shadow
        >
          <Image
            source={require('@/assets/images/gift.png')}
            style={{ width: 100, height: 100, resizeMode: 'contain' }}
          />
        </YStack>

        <YStack flex={1} justifyContent="center" gap={8}>
          <Text fontSize={20} fontWeight="800" color="#0E0E55">
            INVITE AND{'\n'}GET $5
          </Text>

          <Button
            size="$4"
            backgroundColor="#EBF4FE"
            borderRadius={12}
            alignSelf="flex-start"
            onPress={() => Alert.alert('Redeem', 'Redeem flow placeholder')}
          >
            <Text color="#0E0E55" fontWeight="600">
              Redeem price
            </Text>
          </Button>
        </YStack>
      </XStack>

      {/* Invite link box */}
      <YStack
        backgroundColor="#F7F7FA"
        borderRadius={12}
        padding={12}
        marginBottom={14}
        justifyContent="center"
      >
        <XStack alignItems="center" gap={10} justifyContent="space-between">
          <Text numberOfLines={1} ellipsizeMode="middle" flex={1} color="#333">
            {inviteLink}
          </Text>

          <Button
            size="$3"
            backgroundColor="#0E0E55"
            borderRadius={8}
            onPress={handleCopy}
          >
            <Text color="white" fontWeight="600">
              {copied ? 'Copied' : 'Copy'}
            </Text>
          </Button>
        </XStack>
      </YStack>

      {/* Share buttons */}
      <YStack marginBottom={20}>
        <Text fontSize={14} fontWeight="600" color="#0E0E55" marginBottom={8}>
          Share to
        </Text>

        <XStack gap={12}>
          <Button
            backgroundColor="#FFFFFF"
            borderRadius={12}
            size="$3"
            onPress={() => handleShare('whatsapp')}
            style={{ paddingHorizontal: 12 }}
          >
            <Image
              source={require('@/assets/images/whatsapp.png')}
              style={{ width: 22, height: 22 }}
            />
          </Button>

          <Button
            backgroundColor="#FFFFFF"
            borderRadius={12}
            size="$3"
            onPress={() => handleShare('x')}
            style={{ paddingHorizontal: 12 }}
          >
            <Image
              source={require('../../assets/images/google.png')}
              style={{ width: 22, height: 22 }}
            />
          </Button>

          <Button
            backgroundColor="#FFFFFF"
            borderRadius={12}
            size="$3"
            onPress={() => handleShare('facebook')}
            style={{ paddingHorizontal: 12 }}
          >
            <Image
              source={require('../../assets/images/facebook.svg')}
              style={{ width: 22, height: 22 }}
            />
          </Button>

          <Button
            backgroundColor="#FFFFFF"
            borderRadius={12}
            size="$3"
            onPress={() => handleShare('mail')}
            style={{ paddingHorizontal: 12 }}
          >
            <Image
              source={require('../../assets/images/mail_icon.png')}
              style={{ width: 22, height: 22 }}
            />
          </Button>
        </XStack>
      </YStack>

      {/* How it works */}
      <YStack marginBottom={24} gap={12}>
        <Text fontSize={16} fontWeight="700" color="#0E0E55">
          How it works
        </Text>

        <YStack gap={8}>
          <XStack gap={10} alignItems="flex-start">
            <YStack
              width={28}
              height={28}
              borderRadius={14}
              backgroundColor="#0E0E55"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="#fff" fontSize={12} fontWeight="700">
                1
              </Text>
            </YStack>
            <YStack flex={1}>
              <Text fontSize={14} fontWeight="600" color="#111">
                Invite a Friend
              </Text>
              <Text color="#666" fontSize={13}>
                Share your referral link above with a friend
              </Text>
            </YStack>
          </XStack>

          <XStack gap={10} alignItems="flex-start">
            <YStack
              width={28}
              height={28}
              borderRadius={14}
              backgroundColor="#0E0E55"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="#fff" fontSize={12} fontWeight="700">
                2
              </Text>
            </YStack>
            <YStack flex={1}>
              <Text fontSize={14} fontWeight="600" color="#111">
                They Join
              </Text>
              <Text color="#666" fontSize={13}>
                Your friend registers and verifies their account.
              </Text>
            </YStack>
          </XStack>

          <XStack gap={10} alignItems="flex-start">
            <YStack
              width={28}
              height={28}
              borderRadius={14}
              backgroundColor="#0E0E55"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="#fff" fontSize={12} fontWeight="700">
                3
              </Text>
            </YStack>
            <YStack flex={1}>
              <Text fontSize={14} fontWeight="600" color="#111">
                They Take Action
              </Text>
              <Text color="#666" fontSize={13}>
                To activate your reward, your friend must complete a qualifying action.
              </Text>
            </YStack>
          </XStack>

          <XStack gap={10} alignItems="flex-start">
            <YStack
              width={28}
              height={28}
              borderRadius={14}
              backgroundColor="#0E0E55"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="#fff" fontSize={12} fontWeight="700">
                4
              </Text>
            </YStack>
            <YStack flex={1}>
              <Text fontSize={14} fontWeight="600" color="#111">
                You Earn
              </Text>
              <Text color="#666" fontSize={13}>
                Once all steps are completed, your reward is unlocked.
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </YStack>

      {/* Footer / bottom actions */}
      <YStack marginBottom={36} alignItems="center">
        <Button
          size="$4"
          backgroundColor="#0E0E55"
          borderRadius={12}
          onPress={() => Alert.alert('Share', 'Open share sheet placeholder')}
          style={{ width: 160 }}
        >
          <Text color="white" fontWeight="700">
            Redeem all
          </Text>
        </Button>
      </YStack>

      {/* Bottom nav (visual only) */}
      <XStack
        justifyContent="space-around"
        alignItems="center"
        paddingVertical={12}
        borderTopWidth={1}
        borderTopColor="#EFEFEF"
        backgroundColor="#fff"
      >
        <XStack alignItems="center">
          <Ionicons name="home" size={20} color="#0E0E55" />
          <Text marginLeft={6} color="#0E0E55">
            Home
          </Text>
        </XStack>

        <XStack alignItems="center">
          <Ionicons name="chatbubble" size={20} color="#9AA0B0" />
          <Text marginLeft={6} color="#9AA0B0">
            Chat
          </Text>
        </XStack>

        <XStack alignItems="center">
          <Ionicons name="albums" size={20} color="#9AA0B0" />
          <Text marginLeft={6} color="#9AA0B0">
            Resources
          </Text>
        </XStack>

        <XStack alignItems="center">
          <Ionicons name="settings" size={20} color="#9AA0B0" />
          <Text marginLeft={6} color="#9AA0B0">
            Settings
          </Text>
        </XStack>
      </XStack>
    </ScrollView>
  )
}
