import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../logo2.png')}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text style={styles.title}>Equipando sua jornada, elevando seu jogo.</Text>
      <Text style={styles.subtitle}>
        RigRover, lançado pela Infinite Nexus em março de 2024, é uma plataforma gamer inovadora,
        acesse notícias sobre a comunidade geek e tire dúvidas em um fórum.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignUp')}
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
  logo: {
    width: '80%',
    aspectRatio: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#268317',
    width: '80%',
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
});

export default HomeScreen;
