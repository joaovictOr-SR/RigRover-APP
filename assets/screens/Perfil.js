import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, firestore } from "../../src/services/firebaseConfig";
import { signOut, updateProfile, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updateEmail, updatePassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getAuth, sendEmailVerification as sendEmailVerificationModular } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const db = getFirestore();

const formatPhoneNumber = (value) => {
  // Remove todos os caracteres não numéricos
  const cleaned = ('' + value).replace(/\D/g, '');

  // Aplica a formatação para o telefone
  if (cleaned.length <= 11) {
    const match = cleaned.match(/(\d{0,2})(\d{0,2})(\d{0,5})(\d{0,4})/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
  }

  return value; // Retorna o valor limpo sem formatação se exceder o comprimento
};

const Perfil = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(require('../avatar.png'));
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [showConfirmNewEmail, setShowConfirmNewEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false); // Novo estado para verificar se o email foi verificado

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        setEmailVerified(user.emailVerified); // Atualiza o estado do email verificado
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
    if (!password) {
      Alert.alert('Erro', 'Por favor, insira sua senha para confirmar.');
      return;
    }

    try {
      const user = auth.currentUser;

      if (user) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await deleteDoc(doc(db, 'users', user.uid));
        await deleteUser(user);
        navigation.navigate('Login');
        Alert.alert('Sucesso', 'Conta excluída com sucesso.');
        setModalVisible(false);
      }
    } catch (error) {
      let errorMessage = 'Ocorreu um erro ao excluir a conta.';

      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Credenciais inválidas. Verifique sua senha e tente novamente.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Sua sessão expirou. Faça login novamente e tente excluir a conta.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado. A conta pode já ter sido excluída.';
      }

      Alert.alert('Erro', errorMessage);
      console.error('Erro ao excluir a conta:', error);
    }
  };

  const handleSave = async (field, value) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        if (field === 'name') {
          await updateProfile(user, { displayName: value });
          setName(value);
          await setDoc(doc(db, 'users', user.uid), { name: value }, { merge: true });
          setEditingField(null);
        } else if (field === 'phone') {
          const formattedPhone = formatPhoneNumber(value);
          setPhone(formattedPhone);
          await setDoc(doc(db, 'users', user.uid), { phone: formattedPhone }, { merge: true });
          setEditingField(null);
        } else if (field === 'email') {
          if (currentPassword) {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            // Envia o email de verificação
            await sendEmailVerificationModular(user);
            setEmailModalVisible(false); // Fecha o modal após o envio do email
            // Adiciona um listener para verificar o email
            const unsubscribe = auth.onAuthStateChanged((user) => {
              if (user.emailVerified) {
                setEmailVerified(true);
                // Após a verificação, atualiza o email da conta
                updateEmail(user, newEmail)
                  .then(() => {
                    setEmail(newEmail);
                    Alert.alert('Sucesso', 'E-mail atualizado com sucesso.');
                  })
                  .catch((error) => {
                    Alert.alert('Erro', 'Ocorreu um erro ao atualizar o e-mail.');
                    console.error('Erro ao atualizar o e-mail:', error);
                  });
                // Remove o listener
                unsubscribe();
              }
            });
          } else {
            Alert.alert('Erro', 'Por favor, insira sua senha atual para confirmar a alteração do e-mail.');
          }
        } else if (field === 'password') {
          if (newPassword === confirmPassword) {
            await updatePassword(user, newPassword);
            Alert.alert('Sucesso', 'Senha alterada com sucesso.');
            setNewPassword('');
            setConfirmPassword('');
            setPassword('');
            setPasswordModalVisible(false);
            setEditingField(null);
          } else {
            Alert.alert('Erro', 'As novas senhas não coincidem.');
          }
        }
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar as informações. Por favor, tente novamente.');
        console.error('Erro ao salvar:', error);
      }
    }
  };

  const sendEmailVerification = async (user) => {
    try {
      await user.sendEmailVerification();
      console.log('E-mail de verificação enviado.');
    } catch (error) {
      console.error('Erro ao enviar e-mail de verificação:', error);
    }
  };

  const handlePhoneChange = (text) => {
    setNewPhone(text);
  };

  const handleConfirmEmailChange = (text) => {
    setConfirmNewEmail(text);
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
      <Text style={[styles.userInfo, { color: 'white' }]}>E-mail: {email}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: 'white' }]}>Nome:</Text>
          {editingField === 'name' ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[styles.input, { color: 'white' }]}
                value={newName}
                onChangeText={(text) => setNewName(text)}
                placeholder="Novo nome"
              />
              <TouchableOpacity onPress={() => handleSave('name', newName)}>
                <Text style={[styles.saveText, { color: 'white' }]}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[styles.infoValue, { color: 'white' }]}>{name || 'Nome não adicionado'}</Text>
              <TouchableOpacity onPress={() => setEditingField('name')}>
                <Icon name="edit" size={20} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: 'white' }]}>Telefone:</Text>
          {editingField === 'phone' ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[styles.input, { color: 'white' }]}
                value={newPhone}
                onChangeText={handlePhoneChange}
                placeholder="Novo telefone"
                keyboardType="phone-pad"
              />
              <TouchableOpacity onPress={() => handleSave('phone', newPhone)}>
                <Text style={[styles.saveText, { color: 'white' }]}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[styles.infoValue, { color: 'white' }]}>{phone || 'Telefone não adicionado'}</Text>
              <TouchableOpacity onPress={() => setEditingField('phone')}>
                <Icon name="edit" size={20} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: 'white' }]}>Senha:</Text>
          <TouchableOpacity onPress={() => setPasswordModalVisible(true)}>
            <Text style={[styles.editText, { color: 'white' }]}>Alterar senha</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: 'white' }]}>E-mail:</Text>
          <TouchableOpacity onPress={() => setEmailModalVisible(true)}>
            <Text style={[styles.editText, { color: 'white' }]}>Alterar e-mail</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={[styles.deleteText]}>Deseja excluir sua conta?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        animationType="slide"
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar Senha</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Senha atual"
                secureTextEntry={!showCurrentPassword}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.eyeIcon}>
                <FontAwesome name={showCurrentPassword ? 'eye' : 'eye-slash'} size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Nova senha"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                <FontAwesome name={showNewPassword ? 'eye' : 'eye-slash'} size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Confirmar nova senha"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <FontAwesome name={showConfirmPassword ? 'eye' : 'eye-slash'} size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setPasswordModalVisible(false)} />
              <Button title="Alterar" onPress={() => handleSave('password')} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={emailModalVisible}
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alterar E-mail</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Senha atual"
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={(text) => setCurrentPassword(text)}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.eyeIcon}>
                <FontAwesome name={showCurrentPassword ? 'eye' : 'eye-slash'} size={20} color="black" />
              </TouchableOpacity>
            </View>
            {currentPassword ? (
              <>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Novo e-mail"
                    value={newEmail}
                    onChangeText={(text) => setNewEmail(text)}
                  />
                </View>
                <View style={styles.modalInputContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Confirmar novo e-mail"
                    value={confirmNewEmail}
                    onChangeText={handleConfirmEmailChange}
                  />
                </View>
                <View style={styles.modalButtons}>
                  <Button title="Cancelar" onPress={() => setEmailModalVisible(false)} />
                  <Button title="Confirmar" onPress={() => sendVerificationEmail(newEmail)} />
                </View>
              </>
            ) : (
              <Text style={styles.modalInput}>Insira sua senha atual para prosseguir.</Text>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Excluir Conta</Text>
            <Text>Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.</Text>
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Digite sua senha para confirmar"
                secureTextEntry={!showCurrentPassword}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.eyeIcon}>
                <FontAwesome name={showCurrentPassword ? 'eye' : 'eye-slash'} size={20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Excluir" onPress={handleAccountDeletion} />
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
    padding: 20,
    backgroundColor: '#171717',
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
    marginVertical: 20,
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
    marginVertical: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    flex: 2,
  },
  editText: {
    fontSize: 16,
    color: 'blue',
    marginLeft: 10,
  },
  deleteText: {
    fontSize: 16,
    color: 'red',
    marginLeft: 10,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginRight: 10,
    flex: 1,
  },
  saveText: {
    color: 'blue',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  modalInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default Perfil;