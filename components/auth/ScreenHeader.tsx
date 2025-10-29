import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScreenHeaderProps {
    title: string;
    onBackPress: () => void;
    style?: any;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
    title,
    onBackPress,
    style,
}) => (
    <View style={[styles.container, style]}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        padding: 4,
    },
    title: {
        fontSize: 21,
        fontWeight:"bold",
        color: '#000',
    },
});
