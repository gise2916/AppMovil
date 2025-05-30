import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import * as Sharing from 'expo-sharing'; // Importa expo-sharing

const COMMENTS_KEY = '@app_comments'; // Clave para AsyncStorage

const AddCommentScreen = ({ navigation }) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]); // Nuevo estado para los comentarios guardados

    // --- Funciones para AsyncStorage ---

    // Cargar comentarios al iniciar la pantalla
    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        try {
            const storedComments = await AsyncStorage.getItem(COMMENTS_KEY);
            if (storedComments !== null) {
                setComments(JSON.parse(storedComments)); // Parsea los comentarios y los establece
            }
        } catch (error) {
            console.error("Error al cargar comentarios:", error);
            Alert.alert("Error", "No se pudieron cargar los comentarios.");
        }
    };

    // Guardar un nuevo comentario
    const handleSaveComment = async () => {
        if (commentText.trim()) {
            try {
                const newComment = {
                    id: Date.now().toString(), // ID único para el comentario
                    text: commentText.trim(),
                    date: new Date().toLocaleDateString('es-ES'), // Fecha actual
                };
                const updatedComments = [...comments, newComment]; // Agrega el nuevo comentario a la lista
                await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(updatedComments)); // Guarda en AsyncStorage
                setComments(updatedComments); // Actualiza el estado
                setCommentText(''); // Limpia el campo de texto
                Alert.alert("Éxito", "Comentario guardado.");
            } catch (error) {
                console.error("Error al guardar comentario:", error);
                Alert.alert("Error", "No se pudo guardar el comentario.");
            }
        } else {
            Alert.alert('Atención', 'Por favor, escribe un comentario.');
        }
    };

    // --- Función para compartir ---
    const handleShareComment = async (commentToShare) => {
        if (await Sharing.isAvailableAsync()) {
            try {
                await Sharing.shareAsync(`Mi experiencia de senderismo: "${commentToShare.text}" (Fecha: ${commentToShare.date}) #SenderismoApp`);
            } catch (error) {
                console.error("Error al compartir:", error);
                Alert.alert("Error", "No se pudo compartir el comentario.");
            }
        } else {
            Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
        }
    };

    // --- Función para eliminar un comentario (opcional, pero útil) ---
    const handleDeleteComment = async (idToDelete) => {
        Alert.alert(
            "Eliminar Comentario",
            "¿Estás seguro de que quieres eliminar este comentario?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    onPress: async () => {
                        try {
                            const filteredComments = comments.filter(comment => comment.id !== idToDelete);
                            await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(filteredComments));
                            setComments(filteredComments);
                            Alert.alert("Éxito", "Comentario eliminado.");
                        } catch (error) {
                            console.error("Error al eliminar comentario:", error);
                            Alert.alert("Error", "No se pudo eliminar el comentario.");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Comenta tu Experiencia</Text>
            <TextInput
                style={styles.input}
                placeholder="Escribe tu experiencia aquí..."
                multiline
                value={commentText}
                onChangeText={setCommentText}
                maxLength={500} // Limita la longitud del comentario
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveComment}>
                <Text style={styles.saveButtonText}>Guardar Comentario</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>Tus comentarios guardados:</Text>
            {comments.length === 0 ? (
                <Text style={styles.noCommentsText}>Aún no hay comentarios. ¡Sé el primero en compartir tu experiencia!</Text>
            ) : (
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.commentItem}>
                            <Text style={styles.commentDate}>{item.date}</Text>
                            <Text style={styles.commentText}>{item.text}</Text>
                            <View style={styles.commentActions}>
                                <TouchableOpacity style={styles.shareButton} onPress={() => handleShareComment(item)}>
                                    <Text style={styles.shareButtonText}>Compartir</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteComment(item.id)}>
                                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E0F2E0', // Fondo verde claro
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#2E8B57', // Verde oscuro
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 15,
        color: '#2E8B57',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ADD8E6', // Borde azul claro
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        minHeight: 100, // Altura mínima para el área de texto
        textAlignVertical: 'top', // Para que el texto empiece arriba en Android
        fontSize: 16,
        backgroundColor: '#FFFFFF', // Fondo blanco
        color: '#333333',
        shadowColor: '#000', // Sombra
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    saveButton: {
        backgroundColor: '#4CAF50', // Verde vibrante
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    commentItem: {
        backgroundColor: '#FFFFFF', // Fondo blanco para cada comentario
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D3D3D3', // Borde gris claro
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    commentDate: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
        textAlign: 'right',
    },
    commentText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    commentActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Alinea botones a la derecha
        marginTop: 10,
    },
    shareButton: {
        backgroundColor: '#1DA1F2', // Azul para compartir (ej. Twitter)
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    shareButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#FF6347', // Rojo para eliminar
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    noCommentsText: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#666',
        marginTop: 20,
    },
});

export default AddCommentScreen;