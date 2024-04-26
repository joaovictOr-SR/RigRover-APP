import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../logo2.png')}
        resizeMode="contain" // Define como a imagem deve ser redimensionada
        style={styles.logo}
      />
      <Text style={styles.title}>Equipando Sua Jornada, Elevando Seu Jogo.</Text>
      <Text style={styles.subtitle}>
        RigRover, lançado pela Infinite Nexus em março de 2024, é uma plataforma gamer inovadora,
        acesse noticias sobre a comunidade geek e tire dúvidas em um fórum.
      </Text>
      <Button
        title="Entrar"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Cadastre-se"
        onPress={() => navigation.navigate('SignUp')} // Substitua 'SignUp' pelo nome da tela de cadastro, se existir
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#333333', // Define o fundo como cinza escuro
  },
  logo: {
    width: '80%', // Define a largura da imagem como 80% do container
    aspectRatio: 1, // Mantém a proporção da imagem
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF', // Define a cor do texto como branca
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF', // Define a cor do texto como branca
  },
});

export default HomeScreen;
