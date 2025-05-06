import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const PlacesScreen = () => {
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
    ]

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lugares de Senderismo</Text>
            <FlatList
                data={places}
                renderItem={({ item }) => (
                    <View style={styles.placeItem}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <Text style={styles.placeName}>{item.name}</Text>
                        <Text>{item.description}</Text>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    placeItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
    },
    placeName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 5,
    },
});

export default PlacesScreen;