import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Animated } from 'react-native';

const HomeLoginScreen = ({ navigation }) => {
    const scrollY = new Animated.Value(0);

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                <View style={[styles.section, { backgroundColor: '#333333' }]}>
                    <Image
                        source={require('../logo2.png')}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Bem-vindo ao Rig Rover!</Text>
                    <Text style={styles.subtitle}>Sua jornada no mundo dos games começa aqui.</Text>
                </View>

                <View style={[styles.section, styles.sectionBackground, { backgroundColor: '#252330' }]}>
                    <Text style={styles.sectionTitle}>Eventos</Text>
                    <Image
                        source={require('../fundoiniciologado.png')}
                        resizeMode="cover"
                        style={styles.sectionImage}
                    />
                    <Text style={styles.sectionText}>
                        Descubra os eventos mais emocionantes do mundo dos games e garanta sua participação.
                        Desde conferências de desenvolvedores até competições de eSports, temos tudo para você.
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Eventos')}
                    >
                        <Text style={styles.buttonText}>Explore os eventos</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, styles.sectionBackground, { backgroundColor: '#171521' }]}>
                    <Text style={styles.sectionTitle}>Hardware</Text>
                    <Image
                        source={require('../hardwarehome.png')}
                        resizeMode="cover"
                        style={styles.sectionImage}
                    />
                    <Text style={styles.sectionText}>
                        Encontre as melhores opções de hardware para aprimorar sua experiência de jogo.
                        Desde placas de vídeo poderosas até periféricos de última geração, nós temos as recomendações certas para você.
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Hardwares')}
                    >
                        <Text style={styles.buttonText}>Explore os hardwares</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.section, styles.sectionBackground, { backgroundColor: '#252330' }]}>
                    <Text style={styles.sectionTitle}>Jogos</Text>
                    <Image
                        source={require('../gameshome.png')}
                        resizeMode="cover"
                        style={styles.sectionImage}
                    />
                    <Text style={styles.sectionText}>
                        Descubra os últimos lançamentos, análises de jogos e notícias sobre o universo dos games.
                        Esteja sempre atualizado sobre o que há de melhor para jogar, seja em consoles, PC ou dispositivos móveis.
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Games')}
                    >
                        <Text style={styles.buttonText}>Explore os jogos</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#333333',
        height: 1000,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingTop: 20,
        paddingBottom: 75,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    logo: {
        width: '100%',
        height: 100,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#FFFFFF',
        textTransform: 'capitalize',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#FFFFFF',
        textTransform: 'capitalize',
    },
    sectionBackground: {
        marginBottom: 20,
        borderRadius: 10,
    },
    sectionImage: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    sectionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#268317',
        width: '80%',
        alignSelf: 'center',
        paddingVertical: 15,
        marginBottom: 10,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#FFFFFF',
        textTransform: 'capitalize',
    },
});

export default HomeLoginScreen;
