// import React from 'react';
// import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

// const NoticiasScreen = ({ navigation }) => {
//   const noticias = [
//     { id: 1, title: "Novo jogo \"All game come\"", description: "gato charro papagaio chapéu casa e abelha", date: "22/02/24", time: "22:99", likes: 204 },
//     { id: 2, title: "Novo jogo \"All game come\"", description: "gato charro papagaio chapéu casa e abelha", date: "22/02/24", time: "22:99", likes: 204 },
//     { id: 3, title: "Novo jogo \"All game come\"", description: "gato charro papagaio chapéu casa e abelha", date: "22/02/24", time: "22:99", likes: 204 },
//     { id: 4, title: "Novo jogo \"All game come\"", description: "gato charro papagaio chapéu casa e abelha", date: "22/02/24", time: "22:99", likes: 204 },
//     { id: 5, title: "Novo jogo \"All game come\"", description: "gato charro papagaio chapéu casa e abelha", date: "22/02/24", time: "22:99", likes: 204 },
//     { id: 6, title: "Novo jogo \"All game come\"", description: "gato charro papagaio chapéu casa e abelha", date: "22/02/24", time: "22:99", likes: 204 },
//     { id: 7, title: "Novo jogo \"All game come\"", description: "gato charro papagaio chapéu casa e abelha", date: "22/02/24", time: "22:99", likes: 204 },
//     { id: 8, title: "Novo jogo \"All game come\"", description: "gato charro papagaio chapéu casa e abelha", date: "22/02/24", time: "22:99", likes: 204 },
//     { id: 9, title: "Novo jogo \"All game come\"", description: "gato charro papagaio chapéu casa e abelha", date: "22/02/24", time: "22:99", likes: 204 },
//     { id: 10, title: "Novo jogo \"All game come\"", description: "gato charro papagaio chapéu casa e abelha", date: "22/02/24", time: "22:99", likes: 204 },
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.greeting}>Olá, Usuário</Text>
//         <Image source={require('./assets/avatar.png')} style={styles.avatar} />
//       </View>
//       <Text style={styles.subheader}>Veja as notícias recentes sobre o mundo dos games</Text>
//       <View style={styles.searchContainer}>
//         <Image source={require('./assets/lupa.png')} style={styles.searchIcon} />
//         <TextInput style={styles.searchInput} placeholder="Procurar notícia" />
//       </View>
//       <View style={styles.filterContainer}>
//         <View style={styles.filterItem}>
//           <Image source={require('./assets/tudo.png')} style={styles.filterIcon} />
//           <Text style={styles.filterText}>Tudo</Text>
//         </View>
//         <View style={styles.filterItem}>
//           <Image source={require('./assets/controle.png')} style={styles.filterIcon} />
//           <Text style={styles.filterText}>Jogos</Text>
//         </View>
//         <View style={styles.filterItem}>
//           <Image source={require('./assets/hardware.png')} style={styles.filterIcon} />
//           <Text style={styles.filterText}>Hardware</Text>
//         </View>
//         <View style={styles.filterItem}>
//           <Image source={require('./assets/eventos.png')} style={styles.filterIcon} />
//           <Text style={styles.filterText}>Eventos</Text>
//         </View>
//       </View>
//       <ScrollView style={styles.newsContainer}>
//         {noticias.map((noticia) => (
//           <View key={noticia.id} style={styles.newsItem}>
//             <Image source={require('./assets/celular.png')} style={styles.newsImage} />
//             <View style={styles.newsTextContainer}>
//               <Text style={styles.newsTitle}>{noticia.title}</Text>
//               <Text style={styles.newsDescription}>{noticia.description}</Text>
//               <View style={styles.newsFooter}>
//                 <Text style={styles.newsDate}>{`${noticia.date} às ${noticia.time}`}</Text>
//                 <View style={styles.likesContainer}>
//                   <Image source={require('./assets/coracao.png')} style={styles.likesIcon} />
//                   <Text style={styles.likesText}>{noticia.likes}</Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         ))}
//       </ScrollView>
//       <View style={styles.navContainer}>
//         <TouchableOpacity>
//           <Image source={require('./assets/noticia.png')} style={styles.navIcon} />
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <Image source={require('./assets/mensagem.png')} style={styles.navIcon} />
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <Image source={require('./assets/agenda.png')} style={styles.navIcon} />
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <Image source={require('./assets/perfil.png')} style={styles.navIcon} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#333',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//   },
//   greeting: {
//     fontSize: 18,
//     color: '#fff',
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//   },
//   subheader: {
//     fontSize: 14,
//     color: '#fff',
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#0f0',
//     borderRadius: 8,
//     marginHorizontal: 16,
//     padding: 8,
//   },
//   searchIcon: {
//     width: 24,
//     height: 24,
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#000',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#888',
//     padding: 8,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   filterItem: {
//     alignItems: 'center',
//   },
//   filterIcon: {
//     width: 24,
//     height: 24,
//   },
//   filterText: {
//     color: '#fff',
//     marginTop: 4,
//   },
//   newsContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   newsItem: {
//     flexDirection: 'row',
//     backgroundColor: '#555',
//     borderRadius: 8,
//     padding: 8,
//     marginVertical: 8,
//   },
//   newsImage: {
//     width: 50,
//     height: 50,
//     marginRight: 8,
//   },
//   newsTextContainer: {
//     flex: 1,
//   },
//   newsTitle: {
//     fontSize: 16,
//     color: '#fff',
//   },
//   newsDescription: {
//     fontSize: 14,
//     color: '#ddd',
//     marginVertical: 4,
//   },
//   newsFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   newsDate: {
//     fontSize: 12,
//     color: '#aaa',
//   },
//   likesContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   likesIcon: {
//     width: 16,
//     height: 16,
//     marginRight: 4,
//   },
//   likesText: {
//     fontSize: 12,
//     color: '#fff',
//   },
//   navContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#0f0',
//     padding: 16,
//   },
//   navIcon: {
//     width: 24,
//     height: 24,
//   },
// });

// export default NoticiasScreen;
