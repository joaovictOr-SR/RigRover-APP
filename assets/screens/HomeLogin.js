import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Animated } from 'react-native';

const HomeLoginScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ScrollView>
                <Text>s</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#171717',
        height: 1000,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingTop: 20,
        paddingBottom: 75,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    logo: {
        width: '100%',
        height: 100,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#FFFFFF',
        textTransform: 'capitalize',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#FFFFFF',
        textTransform: 'capitalize',
    },
    sectionBackground: {
        marginBottom: 20,
        borderRadius: 10,
    },
    sectionImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    sectionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#268317',
        width: '80%',
        alignSelf: 'center',
        paddingVertical: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#FFFFFF',
        textTransform: 'capitalize',
    },
});

export default HomeLoginScreen;
