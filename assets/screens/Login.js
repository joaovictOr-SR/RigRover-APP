import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from "../../src/services/firebaseConfig";
import { getDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state


    const handleLogin = async () => {
        setIsLoading(true);
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('Por favor, preencha todos os campos.');
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user data from Firestore (optional, but good practice)
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                // Access user data here if needed.  Example:
                // const userData = userDocSnap.data();
                // console.log('User data:', userData);
            }

            navigation.navigate('HomeLogin', {user: user}); // Pass user data to the next screen
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
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
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <BackButton navigation={navigation} goHome={handleGoHome}/> {/* Reusable back button */}
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
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                />
                {error && <Text style={styles.error}>{error}</Text>}
                {isLoading && <Text style={styles.loading}>Entrando...</Text>}
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSenha}>
                    <Text style={styles.linkText}>Esqueceu a sua senha? Redefina aqui</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignup}>
                    <Text style={styles.linkText}>Não tem uma conta? Crie aqui</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

// Reusable Back Button Component
const BackButton = ({ navigation, goHome }) => (
    <TouchableOpacity style={styles.backButton} onPress={goHome}>
        <Text style={styles.backButtonText}>Voltar</Text>
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171717',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        marginBottom: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        color: 'white',
        backgroundColor: '#4C8C41',
        fontSize: 18,
    },
    linkText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center', // Center the text
    },
    button: {
        backgroundColor: '#268317',
        width: '100%',
        paddingVertical: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 24,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center', // Center the error message
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 5,
    },
    backButtonText: {
        color: 'white',
        backgroundColor: '#268317',
        height: 30,
        textAlign: 'center',
        borderRadius: 5,
        padding: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        height: 150,
        margin: 15,
    },
    loading: {
        color: 'white',
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },

});

export default LoginScreen;