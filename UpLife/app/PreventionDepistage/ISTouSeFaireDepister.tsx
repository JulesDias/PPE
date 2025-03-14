import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';

const ISTouSeFaireDepister = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  interface Centre {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  }

  const [centres, setCentres] = useState<Centre[]>([]);

  useEffect(() => {
    // Simuler une liste de centres de dépistage
    setCentres([
      { id: 1, name: 'Centre de dépistage A', latitude: 48.8566, longitude: 2.3522 },
      { id: 2, name: 'Centre de dépistage B', latitude: 48.8584, longitude: 2.2945 },
      { id: 3, name: 'Centre de dépistage C', latitude: 48.8506, longitude: 2.3376 },
      { id: 4, name: 'Centre de dépistage D', latitude: 48.8686, longitude: 2.3532 },
      { id: 5, name: 'Centre de dépistage E', latitude: 48.8514, longitude: 2.2925 },
      { id: 6, name: 'Centre de dépistage F', latitude: 48.8626, longitude: 2.3366 },
      { id: 7, name: 'Centre de dépistage G', latitude: 48.8455, longitude: 2.3522 },
      { id: 8, name: 'Centre de dépistage H', latitude: 48.8573, longitude: 2.2945 },
      { id: 9, name: 'Centre de dépistage I', latitude: 48.8529, longitude: 2.4959 },
      { id: 10, name: 'Centre de dépistage J', latitude: 48.7873, longitude: 2.1823}
    ]);
  }, []);

  return (
    <View style={styles.container}>
      {/* Menu Button */}
      {!menuVisible && (
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Icon name="bars" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* Home Button */}
      <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.homeButton}>
        <Icon name="home" size={30} color="white" />
      </TouchableOpacity>

      {/* Page Title */}
      <Text style={styles.pageTitle}>Où se faire dépister ?</Text>
      <Text style={styles.text}>Trouvez un centre de dépistage près de chez vous grâce à notre carte interactive.</Text>

      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}>
        {centres.map((centre) => (
          <Marker
            key={centre.id}
            coordinate={{ latitude: centre.latitude, longitude: centre.longitude }}
            title={centre.name}
          />
        ))}
      </MapView>

      {/* Sidebar Component */}
      <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  menuButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
    backgroundColor: '#233468',
    padding: 10,
    borderRadius: 8,
  },
  homeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: '#233468',
    padding: 10,
    borderRadius: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#233468',
    marginTop: 60,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  map: {
    flex: 1,
    marginTop: 10,
  },
});

export default ISTouSeFaireDepister;