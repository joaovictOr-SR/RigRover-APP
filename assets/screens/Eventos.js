import React, { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const eventsData = [
  {
    name: 'Conferência de Desenvolvedores',
    description: 'Um evento imperdível para desenvolvedores de todo o mundo.',
    image: require('../evento1.jpg'),
  },
  {
    name: 'Feira de Tecnologia',
    description: 'Explore as últimas tendências em tecnologia e inovação.',
    image: require('../evento2.jpg'),
  },
  {
    name: 'Campeonato de eSports',
    description: 'Os melhores jogadores competindo em jogos emocionantes.',
    image: require('../evento3.png'),
  },
];

const Eventos = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredEvents = eventsData.filter((event) =>
    event.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Eventos</Text>
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
        {filteredEvents.map((event, index) => (
          <View key={index} style={styles.eventItem}>
            <Image source={event.image} style={styles.eventImage} />
            <View style={styles.eventDetails}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>Ler mais</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#306D1A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  readMoreText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default Eventos;
