import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from "../../src/services/firebaseConfig";
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const updateEmailInFirestore = async (newEmail, uid) => { // Added UID parameter
    try {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, { email: newEmail });
    } catch (error) {
        console.error("Erro ao atualizar o e-mail no Firestore:", error);
        return false; // Indicate failure
    }
    return true; // Indicate success
};


const RedefinirSenha = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add loading state


    const handleResetPassword = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        if (!email.trim()) {
            setError('Por favor, insira seu e-mail.');
            setIsLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);

            //Only update email in firestore if it's different and the user is logged in.
            if (auth.currentUser && email !== auth.currentUser.email) {
              const success = await updateEmailInFirestore(email, auth.currentUser.uid); // Pass user UID
              if (!success) {
                  throw new Error("Erro ao atualizar e-mail no Firestore");
              }
            }

            setSuccess('E-mail de redefinição de senha enviado. Verifique sua caixa de entrada.');
            setEmail('');
        } catch (error) {
            console.error("Password reset error:", error);
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
                <Text style={styles.title}>Redefinir Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Insira o seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                {error && <Text style={styles.error}>{error}</Text>}
                {success && <Text style={styles.success}>{success}</Text>}
                {isLoading && <Text style={styles.loading}>Enviando...</Text>}
                <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={isLoading}>
                    <Text style={styles.buttonText}>Enviar e-mail de redefinição</Text>
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
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    success: {
        color: 'green',
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
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

export default RedefinirSenha;