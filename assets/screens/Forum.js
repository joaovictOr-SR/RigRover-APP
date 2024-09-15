import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from '../../src/services/firebaseConfig';
import { collection, getDocs, addDoc, onSnapshot, query, orderBy, doc } from 'firebase/firestore';

const Forum = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [messages, setMessages] = useState([]); // Array para armazenar tópicos do Firestore
  const [selectedTopic, setSelectedTopic] = useState(null); // Estado para o tópico selecionado
  const [chatMessages, setChatMessages] = useState([]); // Estado para as mensagens do chat
  const scrollViewRef = useRef(); // Referência para o ScrollView do chat

  // Observa as alterações na coleção "forum"
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'forum'), (snapshot) => {
      const messageData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messageData);
    });

    return unsubscribe;
  }, []);

  // Observa as alterações na coleção de mensagens do tópico selecionado
  useEffect(() => {
    if (selectedTopic) {
      const unsubscribe = onSnapshot(
        query(
          collection(firestore, 'forum', selectedTopic.id, 'messages'),
          orderBy('timestamp', 'asc') // Ordena as mensagens por data
        ),
        (snapshot) => {
          const chatMessageData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChatMessages(chatMessageData);
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      );

      return unsubscribe;
    }
  }, [selectedTopic]);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredMessages = messages.filter((message) =>
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
          <TouchableOpacity
            key={index}
            style={styles.messageItem}
            onPress={() => {
              setSelectedTopic(message); // Define o tópico selecionado
              navigation.navigate('Conversation', { topic: message }); 
            }}
          >
            <View style={styles.messageContent}>
              <Text style={styles.messageTitle}>{message.title}</Text>
              <Text style={styles.messageSubtitle}>{message.subtitle}</Text>
            </View>
            <Image source={require('../mensagem.webp')} style={styles.messageIcon} />
          </TouchableOpacity>
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
    paddingTop: 50,
    padding: 10,
    position: 'sticky',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 0,
    zIndex: 1000,
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
  messageItem: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'left',
  },
  messageContent: {
    flex: 1,
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
    width: 25,
    height: 25,
    tintColor: '#FFFFFF',
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
    tintColor: '#FFFFFF',
  },
});

export default Forum;