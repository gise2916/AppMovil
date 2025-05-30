import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import PlacesScreen from './screens/PlacesScreen';
import AddCommentScreen from './screens/AddCommentScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Senderismo">
        <Stack.Screen name="Senderismo" component={HomeScreen} options={{ title: 'SENDERISMO' }} />
        <Stack.Screen name="Ubicación" component={MapScreen} options={{ title: 'UBICACION ACTUAL' }} />
        <Stack.Screen name="Lugares" component={PlacesScreen} options={{ title: 'LUGARES' }} />
        <Stack.Screen name="Comenta_tu_Experiencia" component={AddCommentScreen} options={{ title: 'COMENTA TU EXPERIENCIA' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
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
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
});

export default App;