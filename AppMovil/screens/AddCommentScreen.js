import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    ScrollView,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Platform,

} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const COMMENTS_KEY = '@app_comments';

const AddCommentScreen = ({ navigation }) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const loadComments = useCallback(async () => {
        try {
            const storedComments = await AsyncStorage.getItem(COMMENTS_KEY);
            setComments(storedComments ? JSON.parse(storedComments) : []);
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
            Alert.alert('Error', 'No se pudieron cargar los comentarios.');
        }
    }, []);

    useEffect(() => {
        loadComments();

        const requestPermissions = async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para añadir fotos.');
                }
            }
        };
        requestPermissions();
    }, [loadComments]);

    const pickImage = useCallback(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    }, []);

    const handleSaveComment = useCallback(async () => {
        if (!commentText.trim()) {
            Alert.alert('Atención', 'Por favor, escribe un comentario.');
            return;
        }

        try {
            const newComment = {
                id: Date.now().toString(),
                text: commentText.trim(),
                date: new Date().toLocaleDateString('es-ES'),
                imageUri: selectedImage,
            };
            const updatedComments = [...comments, newComment];
            await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(updatedComments));
            setComments(updatedComments);
            setCommentText('');
            setSelectedImage(null);
            Alert.alert('Éxito', 'Comentario y foto guardados.');
        } catch (error) {
            console.error('Error al guardar comentario:', error);
            Alert.alert('Error', 'No se pudo guardar el comentario.');
        }
    }, [commentText, comments, selectedImage]);

    const handleShareComment = useCallback(async (commentToShare) => {
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert('Error', 'La función de compartir no está disponible en este dispositivo.');
            return;
        }

        let shareContent = `¡Echa un vistazo a mi experiencia de senderismo!\n\n"${commentToShare.text}"\n\nFecha: ${commentToShare.date}\n\n#SenderismoApp #Aventura`;
        let options = {
            mimeType: 'text/plain',
            dialogTitle: 'Compartir experiencia de senderismo',
        };

        if (commentToShare.imageUri) {
            try {
                const fileName = commentToShare.imageUri.split('/').pop();
                const cacheUri = FileSystem.cacheDirectory + fileName;
                const fileInfo = await FileSystem.getInfoAsync(cacheUri);
                if (!fileInfo.exists) {
                    await FileSystem.copyAsync({
                        from: commentToShare.imageUri,
                        to: cacheUri,
                    });
                }

                await Sharing.shareAsync(cacheUri, {
                    ...options,
                    mimeType: 'image/jpeg',
                    UTI: 'public.jpeg',
                    text: shareContent,
                });
            } catch (shareError) {
                console.warn('Fallo al compartir imagen, intentando solo texto:', shareError);
                await Sharing.shareAsync(shareContent, options);
            }
        } else {
            await Sharing.shareAsync(shareContent, options);
        }
    }, []);

    const handleDeleteComment = useCallback(async (idToDelete) => {
        Alert.alert(
            'Eliminar Comentario',
            '¿Estás seguro de que quieres eliminar este comentario?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            const filteredComments = comments.filter((comment) => comment.id !== idToDelete);
                            await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(filteredComments));
                            setComments(filteredComments);
                            Alert.alert('Éxito', 'Comentario eliminado.');
                        } catch (error) {
                            console.error('Error al eliminar comentario:', error);
                            Alert.alert('Error', 'No se pudo eliminar el comentario.');
                        }
                    },
                    style: 'destructive',
                },
            ],
        );
    }, [comments]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Comenta tu Experiencia</Text>

            <TextInput
                style={styles.input}
                placeholder="Escribe tu experiencia aquí..."
                multiline
                value={commentText}
                onChangeText={setCommentText}
                maxLength={500}
            />

            <TouchableOpacity style={styles.selectImageButton} onPress={pickImage}>
                <Text style={styles.selectImageButtonText}>Seleccionar Foto</Text>
            </TouchableOpacity>

            {selectedImage && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                    <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.clearImageButton}>
                        <Text style={styles.clearImageButtonText}>X</Text>
                    </TouchableOpacity>
                </View>
            )}

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
                            {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.commentImage} />}
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
                    ItemSeparatorComponent={() => <View style={styles.commentSeparator} />}
                    contentContainerStyle={styles.flatListContent}
                    scrollEnabled={false} />
            )}
        </ScrollView>
    );
};

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
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 15,
        color: '#2E8B57',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ADD8E6',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        color: '#333333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    selectImageButton: {
        backgroundColor: '#8BC34A',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    selectImageButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imagePreviewContainer: {
        marginBottom: 15,
        alignItems: 'center',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#D3D3D3',
    },
    clearImageButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,0,0,0.7)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearImageButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
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
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D3D3D3',
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
    commentImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        marginTop: 10,
        resizeMode: 'contain',
    },
    commentActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    shareButton: {
        backgroundColor: '#8BC34A',
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
        backgroundColor: '#FF6347',
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
    commentSeparator: {
        height: 15,
    },
    flatListContent: {
        paddingBottom: 20,
    },
});

export default AddCommentScreen;