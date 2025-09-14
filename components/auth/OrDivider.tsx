import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface OrDividerProps {
    style?: any;
}

export const OrDivider: React.FC<OrDividerProps> = ({ style }) => (
    <View style={[styles.container, style]}>
        <View style={styles.line} />
        <Text style={styles.text}>OR</Text>
        <View style={styles.line} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#DEDEDE',
    },
    text: {
        marginHorizontal: 10,
        color: '#999',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});
