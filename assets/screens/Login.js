import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../src/services/firebaseConfig";
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../src/services/firebaseConfig'; // Atualize o caminho conforme necessário
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user);
                setUser(user);

                // Optional: Fetch user data from Firestore if needed
                const userDoc = doc(firestore, 'users', user.uid);
                const userSnap = await getDoc(userDoc);

                if (userSnap.exists()) {
                    console.log('User data:', userSnap.data());
                    // Use user data as needed
                } else {
                    console.log('No such document!');
                }

                navigation.navigate('HomeLogin');
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                setError(errorMessage);
            });
    };

    const handleSenha = () => {
        navigation.navigate('RedefinirSenha');
    };

    const handleSignup = () => {
        navigation.navigate('Cadastro');
    };

    const handleGoHome = () => {
        navigation.navigate('Home');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoHome}
            >
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            <Image
                source={require('../mascoterigrover.png')}
                resizeMode="contain"
                style={styles.logo}
            />
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
            <View style={styles.spacer} />
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleSenha}
            >
                <Text style={styles.buttonText}>Esqueceu a sua senha? Redefina aqui</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleSignup}
            >
                <Text style={styles.signupText}>Não tem uma conta? Crie aqui</Text>
            </TouchableOpacity>
            <View style={styles.spacer} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#171717',
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
    signupText: {
        color: 'white',
        fontSize: 18,
    },
    button: {
        backgroundColor: '#268317',
        width: '100%',
        paddingVertical: 10,
        marginBottom: 10,
        borderRadius: 10,
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
        backgroundColor: 'green',
        color: 'white',
        height: 25,
        textAlign: 'center',
        borderRadius: 5,
        width: 70,
        paddingVertical: 2,
    },
    logo: {
        height: 100,
        margin: 15,
    },
    spacer: {
        height: 20,
    },
});

export default LoginScreen;
