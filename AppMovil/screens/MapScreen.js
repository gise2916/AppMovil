import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB48ufFPuJ-5fcAzCxZIKYB71VEqUWvL6g';

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);

    if (!location && !errorMsg) {
        return <ActivityIndicator style={styles.centered} size="large" />;
    }

    if (errorMsg) {
        return <Text style={styles.centered}>{errorMsg}</Text>;
    }

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=15&size=600x300&markers=color:red%7C${location.latitude},${location.longitude}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tu ubicación actual:</Text>
            <Image
                source={{ uri: mapUrl }}
                style={{ width: 600, height: 300 }}
                resizeMode="cover"
            />
            <Text>Latitud: {location.latitude}</Text>
            <Text>Longitud: {location.longitude}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 100,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
