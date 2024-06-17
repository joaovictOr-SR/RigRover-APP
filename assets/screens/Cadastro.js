import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../src/services/firebaseConfig";
import { useNavigation } from '@react-navigation/native';

const CadastroScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleCadastro = () => {
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                alert('Cadastro bem-sucedido. Você será redirecionado para a tela de login.');
                navigation.navigate('Login');
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                setError(errorMessage);
            });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Cadastro</Text>
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha (Mínimo 6 caracteres)"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirme a senha"
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
                style={styles.button}
                onPress={handleCadastro}
            >
                <Text style={styles.buttonText}>Cadastrar</Text>
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

export default CadastroScreen;
