import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Conversation = ({ route }) => {
  const { topic } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const navigation = useNavigation();

  const handleSend = () => {
    if (messageText.trim()) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([...messages, { text: messageText, user: 'Você', timestamp }]);
      setMessageText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../setavoltar.png')} style={styles.backIcon} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{topic.title}</Text>
      </View>
      <ScrollView style={styles.messageContainer}>
        {messages.map((message, index) => (
          <View key={index} style={styles.message}>
            <Text style={styles.messageText}>{message.user}: {message.text}</Text>
            <Text style={styles.timestamp}>{message.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={handleSend}>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2C2C2C',
  },
  backButton: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
  headerText: {
    fontSize: 20,
    color: '#FFFFFF',
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
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
});

export default Conversation;
