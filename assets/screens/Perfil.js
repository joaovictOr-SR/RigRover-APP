import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { auth, storage } from '../../src/services/firebaseConfig';
import { signOut, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const db = getFirestore();

const Perfil = () => {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [hover, setHover] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        getUserName(user.uid).then(setName);
        getUserPhone(user.uid).then(setPhone);
        getDownloadURL(ref(storage, `profile_images/${user.uid}.jpg`))
          .then(setProfileImage)
          .catch(() => {
            setProfileImage(require('../avatar.png'));
          });
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
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user, {
          url: 'https://your-app-url.com/confirm-deletion',
          handleCodeInApp: true
        });

        // Lógica de confirmação do e-mail e exclusão
        Alert.alert('Conta excluída', 'Sua conta foi excluída com sucesso.');
        navigation.navigate('Login');
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao excluir a conta. Por favor, tente novamente.');
        console.error('Erro ao excluir a conta:', error);
      }
    }
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
        } else if (field === 'email') {
          // Validar domínio do e-mail
          const allowedDomains = ['yourdomain.com', 'anotherdomain.com']; // Adicione os domínios permitidos aqui
          const emailDomain = newEmail.split('@')[1];
          
          if (!allowedDomains.includes(emailDomain)) {
            Alert.alert('Erro', 'O domínio do e-mail não é permitido.');
            return;
          }
  
          await user.updateEmail(newEmail);
          setEmail(newEmail);
          await setDoc(doc(db, 'users', user.uid), { email: newEmail }, { merge: true });
          Alert.alert('Sucesso', 'E-mail atualizado com sucesso.');
        }
        setEditingField(null);
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar as informações. Por favor, tente novamente.');
        console.error('Erro ao salvar:', error);
      }
    }
  };
  

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);
        await user.updatePassword(newPassword);
        Alert.alert('Sucesso', 'Senha alterada com sucesso.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao alterar a senha. Verifique se a senha antiga está correta e tente novamente.');
      console.error('Erro ao alterar a senha:', error);
    }
  };
  

  const chooseImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5
      });
  
      if (!result.didCancel && result.assets && result.assets[0]) { 
        const imagePath = result.assets[0].uri;
        const imageName = `${auth.currentUser.uid}.jpg`;
  
        // Cria uma referência para o local onde a imagem será armazenada
        const imageRef = ref(storage, `profile_images/${imageName}`);
  
        // Obtém o blob da imagem
        const response = await fetch(imagePath);
        const blob = await response.blob();
  
        // Faz o upload do blob para o Firebase Storage
        await uploadBytes(imageRef, blob);
  
        // Obtém a URL da imagem armazenada
        const downloadURL = await getDownloadURL(imageRef);
        setProfileImage(downloadURL);
  
        // Atualiza a URL da imagem no Firestore
        await setDoc(doc(db, 'users', auth.currentUser.uid), { profileImage: downloadURL }, { merge: true });
        Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso.');
      } else {
        Alert.alert('Erro', 'Você não selecionou nenhuma imagem.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao escolher a imagem. Por favor, tente novamente.');
      console.error('Erro ao escolher a imagem:', error);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={chooseImage}
        onPressIn={() => setHover(true)}
        onPressOut={() => setHover(false)}
        activeOpacity={0.7}
      >
        <Image
          source={profileImage ? { uri: profileImage } : require('../avatar.png')}
          style={[styles.profileImage, hover && styles.profileImageHover]}
        />
        {hover && (
          <View style={styles.iconOverlay}>
            <Icon name="edit" size={30} color="white" />
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.userInfo}>E-mail: {email}</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>E-mail:</Text>
          {editingField === 'email' ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={newEmail}
                onChangeText={(text) => setNewEmail(text)}
                placeholder="Novo e-mail"
              />
              <TouchableOpacity onPress={() => handleSave('email', newEmail)}>
                <Text style={styles.saveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.infoValue}>{email}</Text>
              <TouchableOpacity onPress={() => setEditingField('email')}>
                <Icon name="edit" size={20} color="black" />
              </TouchableOpacity>
            </>
          )}
        </View>
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
        <TouchableOpacity onPress={() => navigation.navigate('ChangePasswordScreen')}>
          <Text style={styles.changePassword}>Alterar senha</Text>
        </TouchableOpacity>
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
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImageHover: {
    opacity: 0.7,
  },
  iconOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
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
  changePassword: {
    color: 'blue',
    fontSize: 16,
    marginVertical: 10,
  },
  deleteAccount: {
    color: 'red',
    fontSize: 16,
    marginVertical: 10,
  },
});

export default Perfil;
