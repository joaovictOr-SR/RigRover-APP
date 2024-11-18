import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from "../../src/services/firebaseConfig";
import { useNavigation } from '@react-navigation/native';


const CadastroScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleLogin = () => {
        navigation.navigate('Login');
    };

    const handleCadastro = async () => {
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setIsLoading(false);
            return;
        }

        if (!email.trim() || !password.trim()) {
            setError('Por favor, preencha todos os campos.');
            setIsLoading(false);
            return;
        }

        // Basic email validation (can be improved)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Por favor, insira um endereço de e-mail válido.');
            setIsLoading(false);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(firestore, 'users', auth.currentUser.uid), {
                email: auth.currentUser.email,
                // Add other user data here
            });

            alert('Cadastro bem-sucedido. Você será redirecionado para a tela de login.');
            navigation.navigate('Login');
        } catch (error) {
            console.error("Cadastro error:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Image
                    source={require('../mascoterigrover.png')}
                    resizeMode="contain"
                    style={styles.logo}
                />
                <BackButton navigation={navigation} />
                <Text style={styles.title}>Cadastro</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Insira o seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Insira a sua senha"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirme a sua senha"
                    secureTextEntry={true}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                />
                {error && <Text style={styles.error}>{error}</Text>}
                {isLoading && <Text style={styles.loading}>Cadastrando...</Text>}
                <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={isLoading}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.loginText}>Já tem uma conta? Entre aqui</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};


// Reusable Back Button Component
const BackButton = ({ navigation }) => (
  <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
    },
    loginText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CadastroScreen;