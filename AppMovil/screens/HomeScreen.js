import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';

const HomeScreen = ({ navigation }) => {
    const [sound, setSound] = useState(null);
    const [pressedButton, setPressedButton] = useState(null);

    const loadSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/audio/effect.mp3')
            );
            setSound(sound);
        } catch (error) {
            console.error("Error al cargar el sonido:", error);
            setSound(null);
        }
    };

    const playSound = async () => {
        if (sound) {
            try {
                await sound.replayAsync();
            } catch (error) {
                console.error("Error al reproducir el sonido:", error);
            }
        } else {
            console.log("El sonido no está cargado. Intentando cargarlo y reproducirlo.");
            await loadSound();
            if (sound) {
                await sound.replayAsync();
            }
        }
    };

    useEffect(() => {
        loadSound();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const handlePressIn = (buttonName) => {
        setPressedButton(buttonName);
        playSound();
    };

    const handlePressOut = (buttonName, navigateTo) => {
        setPressedButton(null);
        navigation.navigate(navigateTo);
    };

    return (
        <ImageBackground
            source={require('../assets/fondo_inicio.jpg')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.title}>¡Bienvenido a Senderismo!</Text>
                <View style={styles.buttonContainer}>
                    {/* Botón "Ver Ubicación Actual" */}
                    <TouchableOpacity
                        style={[
                            styles.customButton,
                            { backgroundColor: pressedButton === 'Ubicación' ? '#78C278' : '#90EE90' }
                        ]}
                        onPressIn={() => handlePressIn('Ubicación')}
                        onPressOut={() => handlePressOut('Ubicación', 'Ubicación')}
                        activeOpacity={1}
                    >
                        <Text style={styles.buttonText}>Ver Ubicación Actual</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonSeparator} />

                    {/* Botón "Explorar Lugares" */}
                    <TouchableOpacity
                        style={[
                            styles.customButton,
                            { backgroundColor: pressedButton === 'Lugares' ? '#78C278' : '#90EE90' }
                        ]}
                        onPressIn={() => handlePressIn('Lugares')}
                        onPressOut={() => handlePressOut('Lugares', 'Lugares')}
                        activeOpacity={1}
                    >
                        <Text style={styles.buttonText}>Explorar Lugares</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonSeparator} />

                    {/* Botón "Agregar Comentario" */}
                    <TouchableOpacity
                        style={[
                            styles.customButton,
                            { backgroundColor: pressedButton === 'Comenta tu Experiencia' ? '#78C278' : '#90EE90' }
                        ]}
                        onPressIn={() => handlePressIn('Comenta_tu_Experiencia')}
                        onPressOut={() => handlePressOut('Comenta_tu_Experiencia', 'Comenta_tu_Experiencia')}
                        activeOpacity={1}
                    >
                        <Text style={styles.buttonText}>Comenta tu Experiencia</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({

    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,


        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#006400 ',
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    buttonContainer: {
        width: '80%',
    },
    customButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2E8B57',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#2E8B57',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonSeparator: {
        height: 15,
    },
});

export default HomeScreen;