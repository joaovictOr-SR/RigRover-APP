import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../../src/services/firebaseConfig';
import { collection, getDocs, addDoc, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';

const Forum = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const scrollViewRef = useRef();

  const [isModalVisible, setModalVisible] = useState(false);
  const [forumTitle, setForumTitle] = useState('');
  const [forumSubtitle, setForumSubtitle] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'forum'), (snapshot) => {
      const messageData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messageData);
      setIsLoading(false);
    }, (error) => {
      setError(error);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredMessages = messages.filter((message) =>
    message.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const createForum = async () => {
    if (forumTitle.length > 15) {
      alert('O título deve ter no máximo 15 caracteres');
      return;
    }

    if (!forumTitle || !forumSubtitle) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const forumQuery = query(collection(firestore, 'forum'), where('title', '==', forumTitle));
      const querySnapshot = await getDocs(forumQuery);

      if (!querySnapshot.empty) {
        alert('Já existe um fórum com esse título');
        return;
      }

      const newForumRef = await addDoc(collection(firestore, 'forum'), {
        title: forumTitle,
        subtitle: forumSubtitle,
        timestamp: new Date(),
        posts: []
      });

      setModalVisible(false);
      setForumTitle('');
      setForumSubtitle('');
    } catch (error) {
      console.error('Erro ao criar o fórum:', error);
      alert('Erro ao criar o fórum. Tente novamente.');
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
        <Text>Erro ao carregar os fóruns: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Forum</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Procurar"
        placeholderTextColor="#AAAAAA"
        value={searchText}
        onChangeText={handleSearch}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent} ref={scrollViewRef}>
        {filteredMessages.length === 0 ? (
          <Text style={styles.noResultsText}>Nenhum fórum encontrado.</Text>
        ) : (
          filteredMessages.map((message, index) => (
            <TouchableOpacity
              key={index}
              style={styles.messageItem}
              onPress={() => {
                setSelectedTopic(message);
                navigation.navigate('Conversation', { topic: message });
              }}
            >
              <View style={styles.messageContent}>
                <Text style={styles.messageTitle}>{message.title}</Text>
                <Text style={styles.messageSubtitle}>{message.subtitle}</Text>
              </View>
              <Image source={require('../mensagem.webp')} style={styles.messageIcon} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Image source={require('../lapis.png')} style={styles.fabIcon} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Novo Fórum</Text>
            <TextInput
              style={styles.input}
              placeholder="Título (máximo 25 caracteres)"
              placeholderTextColor="#AAAAAA"
              value={forumTitle}
              onChangeText={setForumTitle}
              maxLength={25}
            />
            <TextInput
              style={styles.input}
              placeholder="Subtítulo"
              placeholderTextColor="#AAAAAA"
              value={forumSubtitle}
              onChangeText={setForumSubtitle}
              multiline={true}
              numberOfLines={4}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={createForum}>
                <Text style={styles.buttonText}>Criar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#FF0000' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 80,
  },
  messageItem: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageContent: {
    flex: 1,
  },
  messageTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  messageIcon: {
    width: 30,
    height: 30,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 350,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 15,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#306D1A',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#AAAAAA',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Forum;