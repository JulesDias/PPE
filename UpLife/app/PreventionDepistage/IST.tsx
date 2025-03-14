import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';

const IST = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  // Liste des boutons avec leurs destinations
  const buttons = [
    { title: 'Les IST en bref', route: '/PreventionDepistage/ISTenBref' },
    { title: 'Où se faire dépister ?', route: '/PreventionDepistage/ISTouSeFaireDepister' },
    { title: 'Ressources utiles', route: '/PreventionDepistage/ISTressourcesUtiles' },
  ];

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
      <Text style={styles.pageTitle}>C'est quoi une IST ?</Text>

      <View style={{ height: 20 }} />

      {/* Information Text */}
      <Text style={styles.infoText}>
        Une infection sexuellement transmissible (IST) est causée par des bactéries, virus ou parasites et se transmet lors de rapports sexuels.
      </Text>

      <Text style={styles.infoText}>
      Certaines sont asymptomatiques mais peuvent entraîner des complications graves si non traitées.
      </Text>

      <Text style={styles.infoText}>
      Se protéger et se dépister régulièrement permet d'éviter la transmission et de préserver sa santé.
      </Text>

      <View style={{ height: 20 }} />

      {/* Additional Question */}
      <Text style={styles.boldText}>Que faire en cas d'IST ?</Text>
      <Text style={styles.infoText}>
        Consultez un professionnel de santé pour un diagnostic et un traitement adapté.
      </Text>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        {buttons.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={styles.buttonText}>{item.title}</Text>
            <Icon name="chevron-right" size={16} color="#233468" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sidebar Component */}
      <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
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
    fontFamily: 'Sora-Medium',
    marginBottom: 20,
    marginTop: 60,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
  },
  boldText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: '#233468',
    fontWeight: '500',
  },
});

export default IST;
