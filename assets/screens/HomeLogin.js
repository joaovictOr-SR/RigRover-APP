import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { auth } from '../../src/services/firebaseConfig'; // Importe o objeto auth do Firebase

const newsData = [
    { id: '1', type: 'game', title: 'Novo jogo "Genshin Impact"', description: 'Nova atualização do Genshin Impact traz novos personagens e missões.', date: '01/03/24 às 12:00', image: require('../genshin.jpg'), likes: 200, liked: false },
    { id: '2', type: 'game', title: 'Lançamento de "Honkai Star Rail"', description: 'Honkai Star Rail chega com novos sistemas de batalha e histórias emocionantes.', date: '02/03/24 às 14:30', image: require('../rail.avif'), likes: 150, liked: false },
    { id: '3', type: 'game', title: 'Zenless Zone Zero "Revelation"', description: 'Zenless Zone Zero recebe uma atualização significativa com novos conteúdos.', date: '03/03/24 às 18:00', image: require('../zzz.jpg'), likes: 300, liked: false },
    { id: '4', type: 'hardware', title: 'Placa de Vídeo "GeForce RTX 4090"', description: 'Chegada da nova placa de vídeo com desempenho inigualável.', date: '04/03/24 às 09:00', image: require('../placavideo.jpg'), likes: 175, liked: false },
    { id: '5', type: 'hardware', title: 'Placa-Mãe "ASUS ROG Strix"', description: 'Nova placa-mãe com suporte para as últimas gerações de processadores.', date: '05/03/24 às 11:00', image: require('../placamae.jpg'), likes: 400, liked: false },
    { id: '6', type: 'hardware', title: 'Processador "AMD Ryzen 9 7950X"', description: 'Lançamento do processador de alto desempenho da AMD.', date: '06/03/24 às 15:00', image: require('../processa.jpg'), likes: 125, liked: false },
    { id: '7', type: 'hardware', title: 'SSD "Samsung 970 Evo"', description: 'Novo SSD com velocidades de leitura e gravação ultrarrápidas.', date: '07/03/24 às 16:00', image: require('../ssd.jpg'), likes: 180, liked: false },
    { id: '8', type: 'event', title: 'BGS 2024', description: 'A Brasil Game Show traz grandes novidades do mundo dos games.', date: '08/03/24 às 10:00', image: require('../bgs.jpg'), likes: 200, liked: false },
    { id: '9', type: 'event', title: 'Evento de Tecnologia no Brasil', description: 'Conferência de tecnologia com foco em inovação e tendências futuras.', date: '09/03/24 às 12:00', image: require('../evento.webp'), likes: 150, liked: false },
];

const HomeLoginScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [newsList, setNewsList] = useState(newsData);
    const [userName, setUserName] = useState('Usuário'); // Inicialize o nome do usuário

    useEffect(() => {
        // Observe as alterações no estado de autenticação do usuário
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                // Se o usuário estiver autenticado, defina o nome de usuário
                setUserName(user.displayName || 'Usuário'); // Use o displayName ou 'Usuário' como padrão
            } else {
                // Se o usuário não estiver autenticado, defina o nome como 'Usuário'
                setUserName('Usuário');
            }
        });

        return () => unsubscribe(); // Limpe o listener quando o componente for desmontado
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleLike = (id) => {
        const newNewsList = newsList.map(news => {
            if (news.id === id) {
                const liked = !news.liked;
                return {
                    ...news,
                    likes: liked ? news.likes + 1 : news.likes - 1,
                    liked,
                };
            }
            return news;
        });
        setNewsList(newNewsList);
    };

    const filteredNews = newsList.filter((news) => {
        const matchesSearch = news.title.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || news.type === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const NewsSection = () => (
        <View style={styles.newsSection}>
            {filteredNews.map((news) => (
                <NewsItem key={news.id} news={news} onLike={() => handleLike(news.id)} />
            ))}
        </View>
    );

    const NewsItem = ({ news, onLike }) => {
        const [animation] = useState(new Animated.Value(news.liked ? 1 : 0));

        useEffect(() => {
            Animated.timing(animation, {
                toValue: news.liked ? 1 : 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }, [news.liked]);

        const interpolatedColor = animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['white', 'red'],
        });

        const scale = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1],
        });

        return (
            <View style={styles.newsItem}>
                <Image source={news.image} style={styles.newsImage} />
                <View style={styles.newsContent}>
                    <Text style={styles.newsTitle}>{news.title}</Text>
                    <Text style={styles.newsDescription}>{news.description}</Text>
                    <Text style={styles.newsDate}>{news.date}</Text>
                    <TouchableOpacity style={styles.likeButton} onPress={onLike}>
                        <Animated.Image
                            source={require('../coracao.png')}
                            style={[styles.likeIcon, {
                                tintColor: interpolatedColor,
                                transform: [{ scale }],
                            }]}
                        />
                        <Text style={styles.likeCount}>{news.likes}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.headerText}>
                            <Text style={styles.greeting}>Olá, {userName}</Text> {/* Use o userName aqui */}
                            <Text style={styles.subGreeting}>Veja as notícias recentes sobre o mundo dos games</Text>
                        </View>
                        <Image source={require('../avatar.png')} style={styles.avatar} />
                    </View>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Procurar Notícia"
                        placeholderTextColor="#FFFFFF"
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                </View>
                <View style={styles.menuContainer}>
                    <View style={styles.menu}>
                        <TouchableOpacity
                            style={[styles.menuItem, selectedCategory === 'all' && styles.selectedIcon]}
                            onPress={() => handleCategorySelect('all')}
                        >
                            <Image source={require('../tela.png')} style={[styles.menuIcon, { tintColor: selectedCategory === 'all' ? '#306D1A' : 'white' }]} />
                            <Text style={styles.menuText}>Tudo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.menuItem, selectedCategory === 'game' && styles.selectedIcon]}
                            onPress={() => handleCategorySelect('game')}
                        >
                            <Image source={require('../controle.png')} style={[styles.menuIcon, { tintColor: selectedCategory === 'game' ? '#306D1A' : 'white' }]} />
                            <Text style={styles.menuText}>Jogos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.menuItem, selectedCategory === 'hardware' && styles.selectedIcon]}
                            onPress={() => handleCategorySelect('hardware')}
                        >
                            <Image source={require('../hardware.png')} style={[styles.menuIcon, { tintColor: selectedCategory === 'hardware' ? '#306D1A' : 'white' }]} />
                            <Text style={styles.menuText}>Hardware</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.menuItem, selectedCategory === 'event' && styles.selectedIcon]}
                            onPress={() => handleCategorySelect('event')}
                        >
                            <Image source={require('../confete.png')} style={[styles.menuIcon, { tintColor: selectedCategory === 'event' ? '#306D1A' : 'white' }]} />
                            <Text style={styles.menuText}>Eventos</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <NewsSection />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171717',
    },
    scrollViewContent: {
        paddingVertical: 20,
        paddingBottom: 75,
    },
    header: {
        backgroundColor: '#2C2C2C',
        padding: 10,
        paddingTop: 30,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 20,
    },
    headerText: {
        flex: 1,
        paddingRight: 10,
        paddingTop: 20,
    },
    greeting: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subGreeting: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    searchInput: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#306D1A',
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#000000',
    },
    menuContainer: {
        backgroundColor: '#2C2C2C',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 20,
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    menuItem: {
        alignItems: 'center',
        paddingVertical: 5,
        marginBottom: 5,
    },
    selectedIcon: {
        borderRadius: 5,
    },
    menuIcon: {
        width: 30,
        height: 30,
        marginBottom: 5,
    },
    menuText: {
        fontSize: 12,
        color: '#FFFFFF',
    },
    newsSection: {
        paddingHorizontal: 20,
    },
    newsItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#2C2C2C',
        borderRadius: 10,
        overflow: 'hidden',
    },
    newsImage: {
        width: 100,
        height: '100%',
    },
    newsContent: {
        flex: 1,
        padding: 10,
    },
    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    newsDescription: {
        fontSize: 14,
        color: '#AAAAAA',
        marginVertical: 5,
    },
    newsDate: {
        fontSize: 12,
        color: '#AAAAAA',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    likeIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    likeCount: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#268317',
    },
    footerButton: {
        alignItems: 'center',
    },
    footerIcon: {
        width: 30,
        height: 30,
    },
});

export default HomeLoginScreen;