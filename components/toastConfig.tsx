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
}

export default toastConfig

const styles = StyleSheet.create({
    customToast: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    customTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    customMessage: {
        fontSize: 14,
        color: '#666',
    },
    customSuccessToast: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
})