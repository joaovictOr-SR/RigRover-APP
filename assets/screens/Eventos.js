import React, { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const eventsData = [
  {
    name: 'Conferência de Desenvolvedores Google I/O 2024',
    description: 'Um evento imperdível para desenvolvedores com as últimas inovações da Google.',
    image: require('../evento1.jpg'),
    link: 'https://events.google.com/io/',
  },
  {
    name: 'Feira de Tecnologia CES 2024',
    description: 'Explore as últimas tendências em tecnologia e inovação na CES.',
    image: require('../evento2.avif'),
    link: 'https://www.ces.tech/',
  },
  {
    name: 'Campeonato de eSports The International 2024',
    description: 'Os melhores jogadores competindo em Dota 2.',
    image: require('../evento3.png'),
    link: 'https://www.dota2.com/international/',
  },
  {
    name: 'WWDC 2024',
    description: 'Conferência anual da Apple para desenvolvedores e entusiastas.',
    image: require('../evento4.jpg'),
    link: 'https://developer.apple.com/wwdc24/',
  },
  {
    name: 'Microsoft Build 2024',
    description: 'Evento para desenvolvedores com os mais recentes anúncios e workshops.',
    image: require('../evento5.webp'),
    link: 'https://mybuild.microsoft.com/',
  },
  {
    name: 'South by Southwest (SXSW) 2024',
    description: 'Festival de música, cinema e tecnologia em Austin, Texas.',
    image: require('../evento6.webp'),
    link: 'https://www.sxsw.com/',
  },
  {
    name: 'Game Developers Conference (GDC) 2024',
    description: 'A maior conferência de desenvolvedores de jogos do mundo.',
    image: require('../evento7.webp'),
    link: 'https://gdconf.com/',
  },
  {
    name: 'Comic-Con International 2024',
    description: 'A maior convenção de cultura pop e entretenimento.',
    image: require('../evento8.jpg'),
    link: 'https://www.comic-con.org/',
  },
  {
    name: 'Amazon Web Services (AWS) re:Invent 2024',
    description: 'Evento anual da AWS com foco em tecnologia e inovações em nuvem.',
    image: require('../evento9.png'),
    link: 'https://reinvent.awsevents.com/',
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

  const handleReadMore = (url) => {
    Linking.openURL(url);
  };

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
            <View style={styles.imageContainer}>
              <Image source={event.image} style={styles.eventImage} />
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <TouchableOpacity 
                style={styles.readMoreButton} 
                onPress={() => handleReadMore(event.link)}
              >
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
    width: 60,
    height: 60,
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
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
    backgroundColor: '#333333',
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
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
