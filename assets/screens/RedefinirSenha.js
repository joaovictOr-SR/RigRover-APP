import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from "../../src/services/firebaseConfig";
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';

// Função para atualizar o e-mail no Firestore
const updateEmailInFirestore = async (newEmail) => {
    try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, { email: newEmail });
    } catch (error) {
        console.error("Erro ao atualizar o e-mail no Firestore:", error.message);
    }
};

const RedefinirSenha = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);

            if (email !== auth.currentUser.email) {
                await updateEmailInFirestore(email);
            }

            setSuccess('E-mail de redefinição de senha enviado. Verifique sua caixa de entrada.');
            setEmail('');
            setError('');
        } catch (error) {
            const errorMessage = error.message;
            console.log(errorMessage);
            setError(errorMessage);
            setSuccess('');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={require('../mascoterigrover.png')}
                resizeMode="contain"
                style={styles.logo}
            />
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Redefinir Senha</Text>
            <TextInput
                style={styles.input}
                placeholder="Insira o seu e-mail"
                value={email}
                onChangeText={setEmail}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}
            <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
            >
                <Text style={styles.buttonText}>Enviar e-mail de redefinição</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
    success: {
        color: 'green',
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
});

export default RedefinirSenha;
