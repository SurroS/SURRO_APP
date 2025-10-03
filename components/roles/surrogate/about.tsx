import { Feather } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import { Text, XStack, YStack } from 'tamagui'

const About = () => {
    return (
        <YStack gap="$4">
            <XStack alignItems="center" justifyContent="space-between" gap="$2">
                <Text fontSize="$5" fontWeight="bold" color="black">About</Text>
                <Feather name="edit-2" size={20} color="black" />
            </XStack>
            <Text fontSize="$4" color="black" textAlign="justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</Text>
        </YStack>
    )
}

export default About

const styles = StyleSheet.create({})