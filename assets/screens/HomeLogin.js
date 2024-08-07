import React, { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const newsData = [
    { type: 'game', title: 'Novo jogo "JEF"', description: 'Gato cachorro papagaio chapéu casa abelha', date: '22/02/24 às 22:99', image: require('../silksong.jpg') },
    { type: 'game', title: 'Lançamento do "Super Game"', description: 'Descrição do novo lançamento de jogo', date: '23/02/24 às 14:30', image: require('../silksong.jpg') },
    { type: 'game', title: 'Atualização "Mega Patch"', description: 'Detalhes sobre a atualização', date: '24/02/24 às 18:00', image: require('../silksong.jpg') },
    { type: 'event', title: 'Evento de Games 2024', description: 'Evento de lançamento de jogos', date: '25/02/24 às 10:00', image: require('../silksong.jpg') },
    { type: 'event', title: 'Conferência de Desenvolvedores', description: 'Conferência anual de desenvolvedores', date: '26/02/24 às 12:00', image: require('../silksong.jpg') },
    { type: 'hardware', title: 'Novo Processador "X300"', description: 'Lançamento do novo processador', date: '27/02/24 às 09:00', image: require('../silksong.jpg') },
    { type: 'hardware', title: 'Placa de Vídeo "RX800"', description: 'Chegada da nova placa de vídeo', date: '28/02/24 às 11:00', image: require('../silksong.jpg') },
    { type: 'hardware', title: 'Monitor Ultra HD', description: 'Novo monitor com resolução Ultra HD', date: '29/02/24 às 15:00', image: require('../silksong.jpg') },
    { type: 'hardware', title: 'Teclado Mecânico RGB', description: 'Lançamento do teclado mecânico com iluminação RGB', date: '30/02/24 às 16:00', image: require('../silksong.jpg') },
];

const HomeLoginScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const handleSearch = (text) => {
        setSearchText(text);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const filteredNews = newsData.filter((news) => {
        const matchesSearch = news.title.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || news.type === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const NewsSection = () => (
        <View style={styles.newsSection}>
            {filteredNews.map((news, index) => (
                <View key={index} style={styles.newsItem}>
                    <Image source={news.image} style={styles.newsImage} />
                    <View style={styles.newsContent}>
                        <Text style={styles.newsTitle}>{news.title}</Text>
                        <Text style={styles.newsDescription}>{news.description}</Text>
                        <Text style={styles.newsDate}>{news.date}</Text>
                        <TouchableOpacity style={styles.likeButton}>
                            <Image source={require('../coracao.png')} style={styles.likeIcon} />
                            <Text style={styles.likeCount}>200</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerText}>
                        <Text style={styles.greeting}>Olá, (Usuário)</Text>
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
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.menuContainer}>
                    <View style={styles.menu}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => handleCategorySelect('all')}>
                            <Image source={require('../tela.png')} style={[styles.menuIcon, { tintColor: 'white' }]} />
                            <Text style={styles.menuText}>Tudo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuItem, styles.menuJogos]} onPress={() => handleCategorySelect('game')}>
                            <Image source={require('../controle.png')} style={[styles.menuIcon, { tintColor: 'white' }]} />
                            <Text style={styles.menuText}>Jogos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => handleCategorySelect('hardware')}>
                            <Image source={require('../hardware.png')} style={[styles.menuIcon, { tintColor: 'white' }]} />
                            <Text style={styles.menuText}>Hardware</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => handleCategorySelect('event')}>
                            <Image source={require('../confete.png')} style={[styles.menuIcon, { tintColor: 'white' }]} />
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
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 40,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 25,
    },
    headerText: {
        flex: 1,
        paddingRight: 10,
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
