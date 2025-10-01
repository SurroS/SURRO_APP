import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

// const CustomToast = () => {
//   return (
//     <View>
//       <Text>CustomToast</Text>
//     </View>
//   )
// }

// const ToastConfig = {
//     customSuccess:(props:any) => (
//         <View>

//         </View>
//     )

//     }

// export default ToastConfig

const CustomToast = ({ text1, text2, hide, iconColor }: { text1: string, text2: string, hide: () => void, iconColor: string }) => (
    <View style={styles.customToast}>
        <Ionicons name='star' size={24} color={iconColor || '#FFD700'} />
        <View style={styles.textContainer}>
            <Text style={styles.customTitle}>{text1}</Text>
            {text2 && <Text style={styles.customMessage}>{text2}</Text>}
        </View>
        <Ionicons name='close' size={20} color='#fff' onPress={hide} />
    </View>
)

// Custom toast configuration
const toastConfig = {
    customSuccess: (props: any) => (
        <View style={styles.customSuccessToast}>
            <Ionicons name='checkmark-circle' size={24} color='#fff' />
            <View style={styles.textContainer}>
                <Text style={styles.customTitle}>{props.text1}</Text>
                {props.text2 && <Text style={styles.customMessage}>{props.text2}</Text>}
            </View>
        </View>
    ),
    custom: (props: any) => <CustomToast {...props} />,
    customError: (props: any) => (
        <View style={styles.customErrorToast}>
            <Ionicons name='alert-circle' size={24} color='#fff' />
            <View style={styles.textContainer}>
                <Text style={styles.customTitle}>{props.text1}</Text>
                {props.text2 && <Text style={styles.customMessage}>{props.text2}</Text>}
            </View>
        </View>
    ),
}

export default toastConfig

const styles = StyleSheet.create({
    customToast: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: '#0E0E55',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    textContainer: {
        flex: 1,
        marginHorizontal: 12,
    },
    customTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        lineHeight: 20,
        marginBottom: 2,
    },
    customMessage: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 18,
        fontWeight: '400',
    },
    customSuccessToast: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#22C55E',
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#1A8B3A',
    },
    customErrorToast: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#EF4444',
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#DC2626',
    },
})