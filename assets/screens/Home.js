import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, StatusBar } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#171717" barStyle="light-content" /> {/* Add Status Bar styling */}
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
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cadastro')}>
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
    backgroundColor: '#171717',
  },
  logo: {
    width: '80%',
    maxWidth: 300, // Add maxWidth for better responsiveness
    aspectRatio: 1, //Maintain aspect ratio
    marginBottom: 30, // Increased spacing
  },
  title: {
    fontSize: 28, // Increased font size for better visibility
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15, //Adjusted spacing
    color: '#FFFFFF',
    fontFamily: 'Arial', // Or any other font you prefer
  },
  subtitle: {
    fontSize: 18, // Increased font size
    textAlign: 'center',
    marginBottom: 30, // Increased spacing
    color: '#FFFFFF',
    lineHeight: 24, // Added lineHeight for better readability
    fontFamily: 'Arial', // Or any other font you prefer
  },
  button: {
    backgroundColor: '#268317',
    width: '100%', // Take full width
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20, //Increased font size
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold', //Added fontWeight
    fontFamily: 'Arial', // Or any other font you prefer
  },
});

export default HomeScreen;