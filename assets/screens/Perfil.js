// Perfil.js
import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../src/services/firebaseConfig";
import { signOut } from 'firebase/auth';

const Perfil = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
      Alert.alert('Logout', 'Você foi desconectado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer logout. Por favor, tente novamente.');
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela de Perfil</Text>
      <Button title="Logout" onPress={handleLogout} color="#FF6347" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default Perfil;
