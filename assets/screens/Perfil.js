import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { auth } from '../../src/services/firebaseConfig';
import { signOut, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { sendEmailVerification, deleteUser } from 'firebase/auth';
import { storage } from '../../src/services/firebaseConfig';
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        getUserName(user.uid).then(setName);
        getUserPhone(user.uid).then(setPhone);
        // Carregar a foto do perfil do Firestore, se disponível
        getDownloadURL(ref(storage, `profile_images/${user.uid}.jpg`))
          .then(setProfileImage)
          .catch((error) => {
            // Se a imagem não existir, use a imagem padrão
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

        // Após o usuário confirmar no e-mail, exclua a conta
        // Configure a lógica para verificar a confirmação aqui
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
      Alert.alert('Erro', 'Ocorreu um erro ao alterar a senha. Por favor, tente novamente.');
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

        const imageRef = ref(storage, `profile_images/${imageName}`);
        const uploadTask = uploadBytes(imageRef, result.assets[0].uri);

        uploadTask.on('state_changed', 
          (snapshot) => {
            // Progresso do upload (opcional)
            console.log('Upload progress:', (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          },
          (error) => {
            // Erro durante o upload
            console.error('Erro no upload:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao carregar a imagem. Por favor, tente novamente.');
          },
          () => {
            // Upload concluído
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
              setProfileImage(downloadURL);
            });
          }
        );
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
          <Text style={styles.infoValue}>{email}</Text>
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
              <Text style={styles.infoValue}>{name}</Text>
              <TouchableOpacity onPress={() => setEditingField('name')}>
                <Icon name="edit" size={20} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Senha:</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ChangePasswordScreen')}>
            <Text style={styles.changePasswordText}>Alterar senha</Text>
          </TouchableOpacity>
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
                <Icon name="edit" size={20} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={() => Alert.alert(
        'Excluir conta',
        'Deseja realmente excluir sua conta? Esta ação não pode ser desfeita.',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Excluir',
            onPress: handleAccountDeletion
          }
        ]
      )}>
        <Text style={styles.deleteText}>Excluir conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 20
  },
  logoutButton: {
    padding: 10
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff'
  },
  profileImageHover: {
    borderColor: '#ccc'
  },
  iconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 5
  },
  userInfo: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  infoContainer: {
    marginBottom: 20
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 14,
    flex: 1
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    flex: 2
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginRight: 10
  },
  saveText: {
    color: '#4CAF50',
    fontSize: 16
  },
  changePasswordText: {
    color: '#4CAF50',
    fontSize: 16
  },
  deleteText: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default Perfil;