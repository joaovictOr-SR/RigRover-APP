import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity, Animated, Modal, Alert, Platform, ActivityIndicator } from 'react-native';
import { auth } from '../../src/services/firebaseConfig';

const newsData = [
    { id: '1', type: 'game', title: 'Novo jogo "Genshin Impact"', description: 'Nova atualização do Genshin Impact traz novos personagens e missões.', date: '01/03/24 às 12:00', image: require('../genshin.jpg'), likes: 200, liked: false },
    { id: '2', type: 'game', title: 'Lançamento de "Honkai Star Rail"', description: 'Honkai Star Rail chega com novos sistemas de batalha e histórias emocionantes.', date: '02/03/24 às 14:30', image: require('../rail.avif'), likes: 150, liked: false },
    { id: '3', type: 'game', title: 'Zenless Zone Zero "Revelation"', description: 'Zenless Zone Zero recebe uma atualização significativa com novos conteúdos.', date: '03/03/24 às 18:00', image: require('../zzz.jpg'), likes: 300, liked: false },
    { id: '4', type: 'hardware', title: 'Placa de Vídeo "GeForce RTX 4090"', description: 'Chegada da nova placa de vídeo com desempenho inigualável.', date: '04/03/24 às 09:00', image: require('../placavideo.jpg'), likes: 175, liked: false },
    { id: '5', type: 'hardware', title: 'Placa-Mãe "ASUS ROG Strix"', description: 'Nova placa-mãe com suporte para as últimas gerações de processadores.', date: '05/03/24 às 11:00', image: require('../placamae.jpg'), likes: 400, liked: false },
    { id: '6', type: 'hardware', title: 'Processador "AMD Ryzen 9 7950X"', description: 'Lançamento do processador de alto desempenho da AMD.', date: '06/03/24 às 15:00', image: require('../processa.jpg'), likes: 125, liked: false },
    { id: '7', type: 'hardware', title: 'SSD "Samsung 970 Evo"', description: 'Novo SSD com velocidades de leitura e gravação ultrarrápidas.', date: '07/03/24 às 16:00', image: require('../ssd.jpg'), likes: 180, liked: false },
    { id: '8', type: 'event', title: 'BGS 2024', description: 'A Brasil Game Show traz grandes novidades do mundo dos games.', date: '08/03/24 às 10:00', image: require('../bgs.jpg'), likes: 200, liked: false },
    { id: '9', type: 'event', title: 'Evento de Tecnologia no Brasil', description: 'Conferência de tecnologia com foco em inovação e tendências futuras.', date: '09/03/24 às 12:00', image: require('../eventonintendo.webp'), likes: 150, liked: false },
];

const HomeLoginScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [newsList, setNewsList] = useState(newsData);
    const [userName, setUserName] = useState('Usuário');
    const [showModal, setShowModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUserName(user?.displayName || 'Usuário');
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleLike = (id) => {
        const newNewsList = newsList.map((news) => {
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

    const handleNewsPress = (news) => {
        setSelectedNews(news);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setSelectedNews(null);
        setShowModal(false);
    };

    const filteredNews = newsList.filter((news) => {
        const titleMatch = news.title.toLowerCase().includes(searchText.toLowerCase());
        const categoryMatch = selectedCategory === 'all' || news.type === selectedCategory;
        return titleMatch && categoryMatch;
    });

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.greeting}>Olá, {userName}</Text>
                        <Text style={styles.subGreeting}>Veja as notícias recentes sobre o mundo dos games</Text>
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
                        {['all', 'game', 'hardware', 'event'].map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[styles.menuItem, selectedCategory === category && styles.selectedMenuItem]}
                                onPress={() => handleCategorySelect(category)}
                            >
                                <Image
                                    source={getCategoryIcon(category)}
                                    style={[styles.menuIcon, { tintColor: selectedCategory === category ? '#306D1A' : 'white' }]}
                                />
                                <Text style={styles.menuText}>{getCategoryLabel(category)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.newsSection}>
                    {filteredNews.length === 0 ? (
                        <Text style={styles.noResultsText}>Nenhuma notícia encontrada.</Text>
                    ) : (
                        filteredNews.map((news) => (
                            <NewsItem key={news.id} news={news} onLike={() => handleLike(news.id)} onPress={() => handleNewsPress(news)} />
                        ))
                    )}
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={handleModalClose}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeModal} onPress={handleModalClose}>
                            <Text style={styles.closeText}>X</Text>
                        </TouchableOpacity>
                        {selectedNews && (
                            <View style={styles.modalContent}>
                                <Image source={selectedNews.image} style={styles.modalImage} onError={(e) => { Alert.alert('Erro', 'Imagem não encontrada'); console.error(e) }} />
                                <Text style={styles.modalTitle}>{selectedNews.title}</Text>
                                <Text style={styles.modalDescription}>{selectedNews.description}</Text>
                                <Text style={styles.modalDate}>{selectedNews.date}</Text>
                                <Text style={styles.modalLikes}>{selectedNews.likes} likes</Text>
                            </View>
                        )}
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
};


const NewsItem = ({ news, onLike, onPress }) => {
    const [animation] = useState(new Animated.Value(news.liked ? 1 : 0));
    const [imageLoaded, setImageLoaded] = useState(false);

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

    const handleImageError = (error) => {
        Alert.alert('Erro', `Imagem não encontrada para ${news.title}`);
        console.error('Image error:', error);
        setImageLoaded(true);
    };

    return (
        <TouchableOpacity style={styles.newsItem} onPress={onPress}>
            <Image
                source={news.image}
                style={styles.newsImage}
                onLoadEnd={() => setImageLoaded(true)}
                onError={handleImageError}
            />
            {imageLoaded && (
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
            )}
        </TouchableOpacity>
    );
};

const getCategoryIcon = (category) => {
    switch (category) {
        case 'all': return require('../tela.png');
        case 'game': return require('../controle.png');
        case 'hardware': return require('../hardware.png');
        case 'event': return require('../confete.png');
        default: return null;
    }
};

const getCategoryLabel = (category) => {
    switch (category) {
        case 'all': return 'Tudo';
        case 'game': return 'Jogos';
        case 'hardware': return 'Hardware';
        case 'event': return 'Eventos';
        default: return 'Desconhecido';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171717',
    },
    scrollViewContent: {
        paddingBottom: 75,
    },
    header: {
        backgroundColor: '#2C2C2C',
        padding: 20,
        paddingTop: Platform.OS === 'android' ? 50 : 30,
    },
    headerText: {
        marginBottom: 10,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subGreeting: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    searchInput: {
        padding: 15,
        borderRadius: 10,
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
    selectedMenuItem: {
        borderBottomWidth: 2,
        borderBottomColor: '#306D1A',
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
        width: 150,
        height: 240,
        resizeMode: 'cover',
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#2C2C2C',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxWidth: 400,
    },
    modalImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    modalDescription: {
        fontSize: 14,
        color: 'lightgray',
        marginBottom: 10,
    },
    modalDate: {
        fontSize: 12,
        color: 'lightgray',
        marginBottom: 10,
    },
    modalLikes: {
        fontSize: 14,
        color: 'white',
    },
    closeModal: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    closeText: {
        fontSize: 24,
        color: 'white',
    },
    loadingText: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        color: 'white',
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'lightgray',
        marginTop: 20,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },

});

export default HomeLoginScreen;