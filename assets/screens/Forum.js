import React, { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const messagesData = [
  {
    title: 'Qual é o melhor processador atualmente? (custo benefício)',
    subtitle: 'Estou querendo melhorar minha máquina mas não estou com muita grana.',
    icon: require('../mensagem.webp'),
  },
  {
    title: 'Melhores jogos de 2024',
    subtitle: 'Quais são os jogos mais aguardados para este ano?',
    icon: require('../mensagem.webp'),
  },
  {
    title: 'Novas tendências em hardware',
    subtitle: 'O que esperar das novas GPUs que estão por vir?',
    icon: require('../mensagem.webp'),
  },
  {
    title: 'Conferência de desenvolvedores',
    subtitle: 'Alguém vai na conferência de desenvolvedores este ano?',
    icon: require('../mensagem.webp'),
  },
  {
    title: 'Lançamento do PS5',
    subtitle: 'Vale a pena comprar o PS5 agora ou esperar mais um pouco?',
    icon: require('../mensagem.webp'),
  },
  {
    title: 'PC vs Console',
    subtitle: 'Quais são as vantagens e desvantagens de cada um?',
    icon: require('../mensagem.webp'),
  },
  {
    title: 'Melhores periféricos para gamers',
    subtitle: 'Recomendações de teclados, mouses e headsets para jogar.',
    icon: require('../mensagem.webp'),
  },
  {
    title: 'Eventos de eSports',
    subtitle: 'Quais eventos de eSports vocês estão acompanhando?',
    icon: require('../mensagem.webp'),
  },
];

const Forum = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredMessages = messagesData.filter((message) =>
    message.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Forum</Text>
        <Image source={require('../avatar.png')} style={styles.avatar} />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Procurar"
        placeholderTextColor="#AAAAAA"
        value={searchText}
        onChangeText={handleSearch}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {filteredMessages.map((message, index) => (
          <View key={index} style={styles.messageItem}>
            <Text style={styles.messageTitle}>{message.title}</Text>
            <Text style={styles.messageSubtitle}>{message.subtitle}</Text>
            <Image source={message.icon} style={styles.messageIcon} />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.fab}>
        <Image source={require('../lapis.png')} style={styles.fabIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchInput: {
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#2C2C2C',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  messageItem: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  messageTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  messageSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  messageIcon: {
    width: 20,
    height: 20,
    alignSelf: 'flex-end',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#306D1A',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    width: 30,
    height: 30,
  },
});

export default Forum;
