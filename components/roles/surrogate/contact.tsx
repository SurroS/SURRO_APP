import { Feather, Ionicons } from '@expo/vector-icons'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

const Contact = () => {
    return (
        <YStack gap="$8">
            <YStack gap="$4">
                <XStack alignItems="center" justifyContent="space-between" gap="$2">
                    <Text fontSize="$5" fontWeight="bold" color="black">Contact</Text>
                </XStack>
                <XStack alignItems="center" justifyContent="space-between" >
                    {/* social */}
                    <XStack alignItems="center" flexWrap='wrap' gap="$2">
                        <XStack alignItems="center" gap="$2">
                            <Feather name="phone" size={24} color="#000" />
                            <Text fontSize="$4" color="black">237650810984</Text>
                        </XStack>
                        <XStack alignItems="center" gap="$2">
                            <Feather name="mail" size={24} color="#000" />
                            <Text fontSize="$4" color="black">surrogate@gmail.com</Text>
                        </XStack>
                    </XStack>
                    {/* add button */}
                    <TouchableOpacity>
                        <Ionicons name="add-circle" size={30} color="#0E0E55" />
                    </TouchableOpacity>
                </XStack>
            </YStack>





            <YStack gap="$4">
                <XStack alignItems="center" justifyContent="space-between" >
                    <Text fontSize="$5" fontWeight="bold" color="black">Socials</Text>
                </XStack>
                <XStack alignItems="center" justifyContent="space-between" gap="$2">
                    {/* social */}
                    <XStack alignItems="center" flexWrap='wrap' gap="$2">
                        <XStack alignItems="center" gap="$2">
                            <Ionicons name="logo-instagram" size={24} color="$primary" />
                            <Text fontSize="$4" color="black">@mich</Text>
                        </XStack>
                        <XStack alignItems="center" gap="$2">
                            <Ionicons name="logo-facebook" size={24} color="#000" />
                            <Text fontSize="$4" color="black">@mich</Text>
                        </XStack>
                    </XStack>
                    {/* add button */}
                    <TouchableOpacity>
                        <Ionicons name="add-circle" size={30} color="#0E0E55" />
                    </TouchableOpacity>
                </XStack>
            </YStack>
        </YStack>
    )
}

export default Contact

const styles = StyleSheet.create({})