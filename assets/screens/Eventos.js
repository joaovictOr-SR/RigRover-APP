import React, { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';

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
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state


  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredEvents = eventsData.filter((event) =>
    event.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleReadMore = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        setError('Link inválido'); //Handle unsupported link
      }
    } catch (error) {
      setError('Erro ao abrir o link'); // Handle other errors
    }
  };

  if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Eventos</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Procurar"
        placeholderTextColor="#AAAAAA"
        value={searchText}
        onChangeText={handleSearch}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {filteredEvents.length === 0 ? (
          <Text style={styles.noResultsText}>Nenhum evento encontrado.</Text>
        ) : (
          filteredEvents.map((event, index) => (
            <TouchableOpacity key={index} style={styles.eventItem} onPress={() => handleReadMore(event.link)}> {/* Make entire item clickable */}
              <View style={styles.imageContainer}>
                <Image source={event.image} style={styles.eventImage} />
              </View>
              <View style={styles.eventDetails}>
                <Text style={styles.eventName}>{event.name}</Text>
                <Text style={styles.eventDescription}>{event.description}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  searchInput: {
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
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
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
    overflow: 'hidden', //Prevent image overflow
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Cover entire container
  },
  eventDetails: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#AAAAAA',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Eventos;