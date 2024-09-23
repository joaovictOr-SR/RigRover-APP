import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../../src/services/firebaseConfig';

import { collection, getDocs, addDoc, onSnapshot, query, where } from 'firebase/firestore';

const Forum = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [messages, setMessages] = useState([]); // Array para armazenar tópicos do Firestore
  const [selectedTopic, setSelectedTopic] = useState(null); // Estado para o tópico selecionado
  const scrollViewRef = useRef(); // Referência para o ScrollView do chat

  // Modal para criar fórum
  const [isModalVisible, setModalVisible] = useState(false);
  const [forumTitle, setForumTitle] = useState('');
  const [forumSubtitle, setForumSubtitle] = useState('');

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

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const filteredMessages = messages.filter((message) =>
    message.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Função para verificar se já existe um fórum com o mesmo título no Firestore
  const createForum = async () => {
    if (forumTitle.length > 15) {
      alert('O título deve ter no máximo 15 caracteres');
      return;
    }

    if (forumTitle && forumSubtitle) {
      try {
        // Verificar se já existe um fórum com o mesmo título
        const forumQuery = query(collection(firestore, 'forum'), where('title', '==', forumTitle));
        const querySnapshot = await getDocs(forumQuery);

        if (!querySnapshot.empty) {
          alert('Já existe um fórum com esse título');
          return;
        }

        // Criar novo fórum caso não exista
        await addDoc(collection(firestore, 'forum'), {
          title: forumTitle,
          subtitle: forumSubtitle,
          timestamp: new Date(),
        });

        setModalVisible(false); // Fecha o modal após a criação do fórum
        setForumTitle(''); // Limpa o campo de título
        setForumSubtitle(''); // Limpa o campo de subtítulo
      } catch (error) {
        console.error('Erro ao criar o fórum:', error);
      }
    }
  };

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

      {/* Botão de Lápis (Criar Fórum) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)} // Abre o modal para criar fórum
      >
        <Image source={require('../lapis.png')} style={styles.fabIcon} />
      </TouchableOpacity>

      {/* Modal para criar novo fórum */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Novo Fórum</Text>
            <TextInput
              style={styles.input}
              placeholder="Título (máximo 15 caracteres)"
              placeholderTextColor="#AAAAAA"
              value={forumTitle}
              onChangeText={setForumTitle}
              maxLength={15} // Limite de 15 caracteres no TextInput
            />
            <TextInput
              style={styles.input}
              placeholder="Subtítulo"
              placeholderTextColor="#AAAAAA"
              value={forumSubtitle}
              onChangeText={setForumSubtitle}
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#306D1A',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Forum;
