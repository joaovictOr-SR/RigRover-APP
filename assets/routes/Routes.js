import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Text, View, StyleSheet } from 'react-native';
import LoginScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import HomeLoginScreen from '../screens/HomeLogin';
import CadastroScreen from '../screens/Cadastro';
import RedefinirSenha from '../screens/RedefinirSenha';
import ForumScreen from '../screens/Forum';
import ConversationScreen from '../screens/Conversation';
import EventScreen from '../screens/Eventos';
import ProfileScreen from '../screens/Perfil';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabBarIcon = ({ icon, label, color, size }) => (
    <View style={styles.iconContainer}>
        <Image source={icon} style={{ width: size, height: size, tintColor: color }} />
        <Text style={[styles.iconLabel, { color: color }]}>{label}</Text>
    </View>
);

const TabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                let iconName;
                let label;

                if (route.name === 'HomeLoginTab') {
                    iconName = require('../casa.png');
                    label = 'Home';
                } else if (route.name === 'Forum') {
                    iconName = require('../mensagem.webp');
                    label = 'Forum';
                } else if (route.name === 'Evento') {
                    iconName = require('../evento.png');
                    label = 'Eventos';
                } else if (route.name === 'Perfil') {
                    iconName = require('../perfil.png');
                    label = 'Perfil';
                }

                return <TabBarIcon icon={iconName} label={label} color={color} size={size} />;
            },
            tabBarLabel: () => null,
            tabBarActiveTintColor: '#90EE90',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: {
                backgroundColor: '#0B3C19',
                borderTopWidth: 0,
                height: 65,
                paddingBottom: 5,
                paddingTop: 5,
            },
            tabBarItemStyle: {
                backgroundColor: 'transparent',
            }
        })}
    >
        <Tab.Screen
            name="HomeLoginTab"
            component={HomeLoginScreen}
            options={{ headerShown: false }}
        />
        <Tab.Screen
            name="Forum"
            component={ForumScreen}
            options={{ headerShown: false }}
        />
        <Tab.Screen
            name="Evento"
            component={EventScreen}
            options={{ headerShown: false }}
        />
        <Tab.Screen
            name="Perfil"
            component={ProfileScreen}
            options={{ headerShown: false }}
        />
    </Tab.Navigator>
);

const Routes = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeLogin" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Conversation" component={ConversationScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};


const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    iconLabel: {
        marginTop: 4,
        fontSize: 12,
    },
});

export default Routes;
