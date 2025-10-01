import { useAuth } from '@/hooks/useAuth';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Image, Text, XStack, YStack } from 'tamagui';

const ProfileData = () => {
    const { user } = useAuth();

    const handleStatusPress = () => {
        console.log('Status pressed:', user?.status);
    };

    return (

        <XStack gap="$4" alignItems="flex-start" paddingVertical="$4" >
            <Image
                source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/avatar.jpg')}
                width={145}
                height={145}
                borderRadius="$3"
            />

            <YStack flex={1} gap="$3">
                <XStack alignItems="center" gap="$2">
                    <Text color="black" fontSize="$5">
                        {user?.name || 'No Name'}
                    </Text>
                    {user?.isVerified && (
                        <MaterialIcons name="verified" size={18} color="#22C55E" />
                    )}
                </XStack>

                {user?.username && (
                    <Text color="gray" fontSize="$3">
                        @{user.username}
                    </Text>
                )}

                <XStack alignItems="center" gap="$2">
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text color="black" fontSize="$3">
                        {user?.location || 'Location not set'}
                    </Text>
                </XStack>

                <XStack alignItems="center" gap="$2">
                    <Feather name="calendar" size={16} color="#666" />
                    <Text color="black" fontSize="$3">
                        {user?.dob || 'DOB not set'}
                    </Text>
                </XStack>

                <TouchableOpacity onPress={handleStatusPress} style={styles.statusButton}>
                    <Text color="black" fontSize="$3">
                        Status: {user?.status || 'Not Available'}
                    </Text>
                </TouchableOpacity>
            </YStack>
        </XStack>
    )
}

export default ProfileData

const styles = StyleSheet.create({
    statusButton: {
        backgroundColor: '#A6F4D8',
        padding: 10,
        borderRadius: 50,
    },
})