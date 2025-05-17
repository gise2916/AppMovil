import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddCommentScreen = ({ navigation, route }) => {
    const [commentText, setCommentText] = useState('');

    const handleSaveComment = () => {
        if (commentText.trim()) {
            route.params.onAddComment(commentText);
            navigation.goBack();
        } else {
            alert('Por favor, escribe un comentario.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Comentario</Text>
            <TextInput
                style={styles.input}
                placeholder="Escribe tu comentario aquí..."
                multiline
                value={commentText}
                onChangeText={setCommentText}
            />
            <Button title="Guardar Comentario" onPress={handleSaveComment} />
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
    subtitle: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
    },
    placeItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
    },
    placeName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,

    },
    boton: {
        width: 200,
        marginBottom: 10,
        Color: 'forestgreen',


    }
});

export default AddCommentScreen;