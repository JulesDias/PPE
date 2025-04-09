import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';

const Vaccination = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  // Liste des boutons avec leurs destinations
  const buttons = [
    { title: 'Obligatoire', route: '/Vaccination/VaccinationObligatoire' },
    { title: 'Recommandée', route: '/Vaccination/VaccinationRecommandee' },
    { title: "Je pars à l'étranger", route: '/Vaccination/VaccinationEtranger' },
    { title: 'Ressources utiles', route: '/Vaccination/VaccinationRessourcesUtiles' }
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
      <Text style={styles.pageTitle}>LA VACCINATION</Text>

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
  buttonsContainer: {
    marginTop: 50,
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

export default Vaccination;
