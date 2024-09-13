import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore, deleteUser } from "../../src/services/firebaseConfig";
import { signOut, updateProfile } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

const db = getFirestore();

const Perfil = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(require('../avatar.png'));
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        getUserName(user.uid).then(setName);
        getUserPhone(user.uid).then(setPhone);
      } else {
        setUser(null);
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, []);

  const getUserName = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().name : '';
  };

  const getUserPhone = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().phone : '';
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
      Alert.alert('Logout', 'Você foi desconectado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer logout. Por favor, tente novamente.');
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleAccountDeletion = async () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;

              if (user) {
                // Deletar o documento do usuário no Firestore
                await deleteDoc(doc(db, 'users', user.uid));
                
                // Deletar o usuário do Firebase Auth
                await deleteUser(user);

                // Navegar para a tela de login
                navigation.navigate('Login');
              }
            } catch (error) {
              Alert.alert(
                'Erro',
                'Ocorreu um erro ao excluir a conta. Por favor, tente novamente.'
              );
              console.error('Erro ao excluir a conta:', error);
            }
          },
        },
      ],
      { cancelable: false } // Isso garante que o alerta não possa ser fechado clicando fora
    );
  };

  const handleSave = async (field, value) => {
    const user = auth.currentUser;
    if (user) {
      try {
        if (field === 'name') {
          await updateProfile(user, { displayName: value });
          setName(value);
          await setDoc(doc(db, 'users', user.uid), { name: value }, { merge: true });
        } else if (field === 'phone') {
          setPhone(value);
          await setDoc(doc(db, 'users', user.uid), { phone: value }, { merge: true });
        }
        setEditingField(null);
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar as informações. Por favor, tente novamente.');
        console.error('Erro ao salvar:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Image source={profileImage} style={styles.profileImage} />
      </View>
      <Text style={styles.userInfo}>E-mail: {email}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nome:</Text>
          {editingField === 'name' ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={(text) => setNewName(text)}
                placeholder="Novo nome"
              />
              <TouchableOpacity onPress={() => handleSave('name', newName)}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.infoValue}>{name || 'Nome aleatório'}</Text>
              <TouchableOpacity onPress={() => setEditingField('name')}>
                <Icon name="edit" size={20} color="black" />
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Telefone:</Text>
          {editingField === 'phone' ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={newPhone}
                onChangeText={(text) => setNewPhone(text)}
                placeholder="Novo telefone"
              />
              <TouchableOpacity onPress={() => handleSave('phone', newPhone)}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.infoValue}>{phone || 'Telefone não adicionado'}</Text>
              <TouchableOpacity onPress={() => setEditingField('phone')}>
                <Icon name="edit" size={20} color="black" />
              </TouchableOpacity>
            </>
          )}
        </View>
        <TouchableOpacity onPress={handleAccountDeletion}>
          <Text style={styles.deleteAccount}>Excluir conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  logoutButton: {
    padding: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginRight: 10,
    flex: 1,
    fontSize: 16,
  },
  saveText: {
    color: 'blue',
    fontSize: 16,
  },
  deleteAccount: {
    color: 'red',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Perfil;
