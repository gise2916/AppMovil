import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import miVideoCharcoVerdeLocal from '../assets/video/mivideo.mp4';


const PlacesScreen = () => {
    const [ratings, setRatings] = useState({});

    const handleStarPress = (placeId, rating) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [placeId]: rating,
        }));
        Alert.alert("Calificación Guardada", `Has calificado ${rating} estrella(s) para el lugar ${placeId}`);
    };

    const handleMoreInfoPress = (placeName) => {
        Alert.alert("Más Información", `Aquí se mostraría información detallada sobre ${placeName}. Por ahora, es un placeholder.`);
    };

    const places = [
        {
            id: '1',
            name: 'Sendero La Romelia',
            description: 'Un hermoso sendero cerca de Manizales que permite a los visitantes caminar por senderos naturales que atraviesan cultivos agrícolas y áreas con orquídeas, bonsaís y cactus.',
            image: 'https://s2.wklcdn.com/image_121/3652175/132667424/84530213.400x300.jpg',
            videoAsset: null,
        },
        {
            id: '2',
            name: 'Parque Nacional Natural Los Nevados',
            description: 'Impresionantes paisajes de alta montaña; En este recorrido podrán observar una maravillosa vista de frailejones, el páramo y una hermosa panorámica del colosal nevado del Ruiz.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIart9n2fZlZYo2SAP6jwPlyb21Fj5RVRGtA&s',
            videoAsset: null,
        },
        {
            id: '3',
            name: 'Ruta Charco Verde',
            description: 'Charco Verde - peaje la estrella via manizales Neira: esta ubicado después del peaje la estrella, bajamos a la derecha con dirección Manizales Neira, vamos derecho por todo el camino hasta una finca donde se cultivan pimentones, de ahí a mano izquierda pasan por un Puente colgante continúan de nuevo a la izquierda y luego encontrarán una quebrada de ahí hacia la derecha suben por toda la Quebrada hasta llegar a charco verde.',
            image: 'https://s1.wklcdn.com/image_483/14498730/165486221/103491397.700x525.jpg',
            videoAsset: miVideoCharcoVerdeLocal,
        },
    ];

    const StarRating = ({ placeId, currentRating, onStarPress }) => {
        const stars = [1, 2, 3, 4, 5];
        return (
            <View style={styles.starsContainer}>
                {stars.map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => onStarPress(placeId, star)}
                        style={styles.starButton}
                    >
                        <Text style={[styles.star, currentRating >= star ? styles.filledStar : styles.emptyStar]}>
                            ★
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lugares de Senderismo</Text>
            <FlatList
                data={places}
                renderItem={({ item }) => (
                    <View style={styles.placeItem}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <Text style={styles.placeName}>{item.name}</Text>
                        <Text style={styles.placeDescription}>{item.description}</Text>

                        { }
                        {item.videoAsset && (
                            <Video
                                source={item.videoAsset}
                                style={styles.videoPlayer}
                                useNativeControls
                                resizeMode="contain"
                            />
                        )}

                        <Text style={styles.ratingLabel}>Califica este lugar:</Text>
                        <StarRating
                            placeId={item.id}
                            currentRating={ratings[item.id] || 0}
                            onStarPress={handleStarPress}
                        />

                        <TouchableOpacity
                            style={styles.moreInfoButton}
                            onPress={() => handleMoreInfoPress(item.name)}
                        >
                            <Text style={styles.moreInfoButtonText}>Más Información</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E0F2E0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2E8B57',
    },
    placeItem: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginBottom: 10,
    },
    videoPlayer: {
        width: '100%',
        height: width * 0.5625,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: 'black',
    },
    placeName: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 5,
        color: '#333333',
    },
    placeDescription: {
        fontSize: 14,
        color: '#555555',
        marginBottom: 10,
    },
    ratingLabel: {
        fontSize: 14,
        color: '#666666',
        marginTop: 10,
        marginBottom: 5,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    starButton: {
        padding: 5,
    },
    star: {
        fontSize: 24,
        color: '#CCCCCC',
    },
    filledStar: {
        color: '#FFD700',
    },
    emptyStar: {
        color: '#CCCCCC',
    },
    moreInfoButton: {
        backgroundColor: '#2E8B57',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    moreInfoButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PlacesScreen;