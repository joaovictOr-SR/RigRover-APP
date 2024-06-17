import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import HomeScreen from '../screens/Home';
import HomeLoginScreen from '../screens/HomeLogin';
import CadastroScreen from '../screens/Cadastro';
// import NoticiasScreen from '../screens/Noticias';

const Stack = createStackNavigator();

const Routes = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeLogin" component={HomeLoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Noticias" component={NoticiasScreen} options={{ headerShown: false }} /> */}
        </Stack.Navigator>

    );
};

export default Routes;