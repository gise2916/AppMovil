import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation = useNavigation();
    return (
        <ImageBackground
            source={require('../assets/fondo_inicio.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Lugares')}
                >
                    <Text style={styles.buttonText}>Lugares</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Comentarios')}
                >
                    <Text style={styles.buttonText}>Comentarios</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    button: {
        backgroundColor: 'forestgreen',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 20,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default HomeScreen;