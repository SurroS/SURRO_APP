import { Feather, Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, XStack, YStack, } from 'tamagui'

const texthead ='$4'
const body ='$3.2'
const smallGap ='$2' 
const bigGap ='$3'
const iconSize = 18
const addIcon = 25

const Contact = () => {
    return (
        <YStack gap={smallGap} flex={1}>
            <YStack gap={smallGap}>
                    <Text fontSize={texthead} fontWeight="bold" color="black">Contact</Text>
                <XStack alignItems="center" justifyContent="space-between" >
                    <XStack alignItems="center" flexWrap='wrap' gap={smallGap}>
                        <XStack alignItems="center" gap={smallGap}>
                            <Feather name="phone" size={iconSize} color="#000" />
                            <Text fontSize={body} color="black">237650810984</Text>
                        </XStack>
                        <XStack alignItems="center" gap={smallGap}>
                            <Feather name="mail" size={iconSize} color="#000" />
                            <Text fontSize={body} color="black">surrogate@gmail.com</Text>
                        </XStack>
                    </XStack>
                    {/* add button */}
                    <TouchableOpacity >
                        <Ionicons name="add-circle" size={addIcon} color="#0E0E55"alignSelf={"flex-end"} />
                    </TouchableOpacity>
                </XStack>
            </YStack>





            <YStack gap={bigGap}>
                <XStack alignItems="center" justifyContent="space-between" >
                    <Text fontSize={texthead} fontWeight="bold" color="black">Socials</Text>
                </XStack>
                <XStack alignItems="center" justifyContent="space-between" gap={smallGap}>
                    {/* social */}
                    <XStack alignItems="center" flexWrap='wrap' gap={smallGap}>
                        <XStack alignItems="center" gap={smallGap}>
                            <Ionicons name="logo-instagram" size={iconSize} color="$primary" />
                            <Text fontSize={body} color="black">@mich</Text>
                        </XStack>
                        <XStack alignItems="center" gap={smallGap}>
                            <Ionicons name="logo-facebook" size={iconSize} color="#000" />
                            <Text fontSize={body} color="black">@mich</Text>
                        </XStack>
                    </XStack>
                    {/* add button */}
                    <TouchableOpacity>
                        <Ionicons name="add-circle" size={addIcon} color="#0E0E55" alignSelf={"flex-end"}/>
                    </TouchableOpacity>
                </XStack>
            </YStack>
        </YStack>
    )
}

export default Contact

const styles = StyleSheet.create({

})