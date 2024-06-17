import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../src/services/firebaseConfig";
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                setUser(user);

                navigation.navigate('HomeLogin');
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                setError(errorMessage);
            });
    };

    const handleSignup = () => {
        navigation.navigate('Cadastro');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Entrar</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Não tem uma conta?</Text>
            <TouchableOpacity
                style={[styles.button, styles.signupButton]}
                onPress={handleSignup}
            >
                <Text style={styles.buttonText}>Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#333333',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'white',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: 'white',
        backgroundColor: '#4C8C41',
    },
    button: {
        backgroundColor: '#268317',
        width: '100%',
        paddingVertical: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    signupButton: {
        height: 40,
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 5,
    },
    backButtonText: {
        fontSize: 16,
        color: 'white',
    },
});

export default LoginScreen;
