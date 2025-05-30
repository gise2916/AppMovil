import React, { useState } from 'react'; // Importa useState para el estado de la calificación
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
// Si quieres añadir el efecto de sonido al botón "Más Información",
// también necesitarías importar Audio de expo-av aquí, similar a HomeScreen.
// import { Audio } from 'expo-av';

const PlacesScreen = () => {
    // Estado para almacenar la calificación de cada lugar.
    // Usaremos un objeto donde la clave es el ID del lugar y el valor es la calificación.
    const [ratings, setRatings] = useState({});

    // Función para manejar la calificación de estrellas
    const handleStarPress = (placeId, rating) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [placeId]: rating, // Actualiza la calificación para este lugar
        }));
        Alert.alert("Calificación Guardada", `Has calificado ${rating} estrella(s) para el lugar ${placeId}`);
        // Aquí podrías enviar la calificación a un backend o guardarla localmente si lo necesitas.
    };

    // Función para mostrar el botón "Más Información"
    const handleMoreInfoPress = (placeName) => {
        Alert.alert("Más Información", `Aquí se mostraría información detallada sobre ${placeName}. Por ahora, es un placeholder.`);
        // Aquí podrías navegar a una nueva pantalla con los detalles completos del lugar,
        // o abrir una URL externa si la información está en una web.
    };

    const places = [
        {
            id: '1',
            name: 'Sendero La Romelia',
            description: 'Un hermoso sendero cerca de Manizales.que permite a los visitantes caminar por senderos naturales que atraviesan cultivos agrícolas y áreas con orquídeas, bonsaís y cactus.',
            image: 'https://s2.wklcdn.com/image_121/3652175/132667424/84530213.400x300.jpg',
        },
        {
            id: '2',
            name: 'Parque Nacional Natural Los Nevados',
            description: 'Impresionantes paisajes de alta montaña; En este recorrido podrán observar una maravillosa vista de frailejones, el páramo y una hermosa panorámica del colosal nevado del Ruiz.',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIart9n2fZlZYo2SAP6jwPlyb21Fj5RVRGtA&s',
        },
    ];

    // Componente auxiliar para renderizar las estrellas
    const StarRating = ({ placeId, currentRating, onStarPress }) => {
        const stars = [1, 2, 3, 4, 5]; // Puedes cambiar el número de estrellas aquí
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

                        {/* Opciones de Calificación */}
                        <Text style={styles.ratingLabel}>Califica este lugar:</Text>
                        <StarRating
                            placeId={item.id}
                            currentRating={ratings[item.id] || 0} // Muestra 0 si no hay calificación
                            onStarPress={handleStarPress}
                        />

                        {/* Botón de Más Información */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E0F2E0', // Un verde muy claro para el fondo
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2E8B57',
    },
    placeItem: {
        backgroundColor: '#FFFFFF', // Fondo blanco para cada elemento del lugar
        padding: 15,
        marginBottom: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D3D3D3', // Borde gris claro
        elevation: 3, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    image: {
        width: '100%',
        height: 180, // Aumenta la altura para que la imagen se vea mejor
        borderRadius: 8,
        marginBottom: 10,
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
    // --- Estilos para las estrellas ---
    ratingLabel: {
        fontSize: 14,
        color: '#666666',
        marginTop: 10,
        marginBottom: 5,
    },
    starsContainer: {
        flexDirection: 'row', // Para que las estrellas estén en línea
        marginBottom: 15,
    },
    starButton: {
        padding: 5, // Área de toque más grande para las estrellas
    },
    star: {
        fontSize: 24,
        color: '#CCCCCC', // Color por defecto de estrella vacía
    },
    filledStar: {
        color: '#FFD700', // Color dorado para estrellas llenas
    },
    emptyStar: {
        color: '#CCCCCC', // Color gris para estrellas vacías
    },
    // --- Estilos para el botón "Más Información" ---
    moreInfoButton: {
        backgroundColor: '#2E8B57', // Verde oscuro
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
        alignSelf: 'flex-start', // Alinea el botón a la izquierda dentro del placeItem
        // alignSelf: 'center', // Descomenta si quieres que el botón esté centrado
    },
    moreInfoButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PlacesScreen;