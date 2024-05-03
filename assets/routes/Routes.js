import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import HomeLoginScreen from '../screens/HomeLogin';
import CadastroScreen from '../screens/Cadastro';

const Stack = createStackNavigator();

const Routes = () => {
    return (
        <Stack.Navigator initialRouteName="HomeLogin">
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <Stack.Screen name="HomeLogin" component={HomeLoginScreen} options={{ title: 'Home - Logado' }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Cadastro' }} />
        </Stack.Navigator>
    );
};

export default Routes;