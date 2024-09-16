import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, firestore } from '../../src/services/firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const Conversation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { topic } = route.params;
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const scrollViewRef = useRef(null);

  // Observa as alterações na coleção de mensagens do tópico
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, 'forum', topic.id, 'messages'),
        orderBy('timestamp', 'asc')
      ),
      (snapshot) => {
        const chatMessageData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: new Date(doc.data().timestamp.seconds * 1000) // Conversão do timestamp Firestore para Date
        }));
        setChatMessages(chatMessageData);
        // Rolagem para o final da lista de mensagens
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );
    return unsubscribe;
  }, [topic.id]);

  const handleSendChatMessage = async () => {
    if (newChatMessage.trim() === '') {
      return;
    }

    try {
      const newMessage = {
        content: newChatMessage,
        timestamp: new Date(),
        sender: auth.currentUser.uid,
      };
      await addDoc(collection(firestore, 'forum', topic.id, 'messages'), newMessage);
      setNewChatMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Forum')} // Assuming 'Forum' is your screen name
          style={styles.backButton}
        >
          <Image source={require('../setavoltar.png')} style={styles.backIcon} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerText}>{topic.title}</Text>
        </View>
      </View>
      <ScrollView ref={scrollViewRef} style={styles.messageContainer}>
        {chatMessages.map((message, index) => (
          <View key={index} style={styles.message}>
            {message.sender === auth.currentUser.uid ? (
              <Text style={styles.senderLabel}>Você:</Text>
            ) : null}
            <Text style={styles.messageText}>{message.content}</Text>
            <Text style={styles.timestamp}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          value={newChatMessage}
          onChangeText={setNewChatMessage}
        />
        <TouchableOpacity onPress={handleSendChatMessage}>
          <Image source={require('../setaenviar.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ajusta o espaço entre os elementos
    backgroundColor: '#1C1C1C',
  },
  backButton: {
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  headerTitleContainer: {
    flex: 1, // Garante que o título ocupe o espaço central
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 75,
  },
  headerText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageContainer: {
    flex: 1,
    padding: 20,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#2C2C2C',
    borderRadius: 5,
  },
  messageText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  senderLabel: {
    color: '#AAAAAA',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
});


export default Conversation;
