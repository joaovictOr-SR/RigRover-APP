import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, firestore } from '../../src/services/firebaseConfig';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

const Conversation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { topic } = route.params;
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const flatListRef = useRef(null); // Use FlatList instead of ScrollView

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
          timestamp: doc.data().timestamp.toDate(),
        }));
        setChatMessages(chatMessageData);
        flatListRef.current?.scrollToEnd({ animated: true }); // Scroll to bottom
        setIsLoading(false);
      },
      (error) => {
        setError(error);
        setIsLoading(false);
        console.error("Error fetching messages:", error); // Log error for debugging
      }
    );
    return unsubscribe;
  }, [topic.id]);

  const handleSendChatMessage = async () => {
    if (newChatMessage.trim() === '') return;

    setIsLoading(true); // Show loading indicator
    setError(null); // Clear previous errors
    try {
      await addDoc(collection(firestore, 'forum', topic.id, 'messages'), {
        content: newChatMessage,
        timestamp: serverTimestamp(),
        sender: auth.currentUser?.uid,
      });
      setNewChatMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError("Erro ao enviar mensagem. Verifique sua conexão.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  if (isLoading) {
    return <LoadingIndicator />; // Reusable loading component
  }

  if (error) {
    return <ErrorDisplay message={error} />; // Reusable error component
  }

  const renderItem = ({ item }) => (
    <View style={styles.message}>
      {item.sender === auth.currentUser?.uid && <Text style={styles.senderLabel}>Você:</Text>}
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <BackButton navigation={navigation} />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerText}>{topic.title}</Text>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageContainer}
      />
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          value={newChatMessage}
          onChangeText={setNewChatMessage}
          onSubmitEditing={handleSendChatMessage}
        />
        <TouchableOpacity onPress={handleSendChatMessage}>
          <Image source={require('../setaenviar.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Reusable Loading Indicator Component
const LoadingIndicator = () => (
  <View style={[styles.container, styles.loadingContainer]}>
    <ActivityIndicator size="large" color="#fff" />
  </View>
);

// Reusable Error Display Component
const ErrorDisplay = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

const BackButton = ({navigation}) => (
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
    <Image source={require('../setavoltar.png')} style={styles.backIcon} />
    <Text style={styles.backText}>Voltar</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1C',
  },
  backButton: {
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageContainer: {
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
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: 30,
    height: 30,
    tintColor: '#FFFFFF',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Conversation;