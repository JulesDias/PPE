import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';

const SitesInformationsUtiles = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

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

      {/* Page Title - Moved lower */}
      <Text style={styles.pageTitle}>SITES ET INFORMATIONS UTILES</Text>

      {/* Links Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sites du Ministère de la Santé :</Text>
        <TouchableOpacity onPress={() => handleLinkPress('https://www.service-public.fr/particuliers/vosdroits/F724')}>
          <Text style={styles.linkText}>Calendrier des vaccinations | Service-Public.fr</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sites de l’Institut Pasteur :</Text>
        <TouchableOpacity onPress={() => handleLinkPress('https://www.pasteur.fr/fr/centre-medical/vaccination/calendrier-vaccinal')}>
          <Text style={styles.linkText}>Calendrier vaccinal - Centre de vaccination Institut Pasteur</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLinkPress('https://www.pasteur.fr/fr/centre-medical/preparer-son-voyage')}>
          <Text style={styles.linkText}>Informations et vaccins voyage - Centre médical Institut Pasteur</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sites de l’Assurance Maladie :</Text>
        <TouchableOpacity onPress={() => handleLinkPress('https://www.ameli.fr/assure/sante/themes/vaccination/vaccination-voyage')}>
          <Text style={styles.linkText}>Vaccination : conseils avant un voyage | ameli.fr</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLinkPress('https://www.ameli.fr/assure/sante/themes/vaccination/vaccins-obligatoires')}>
          <Text style={styles.linkText}>Les vaccins obligatoires | ameli.fr</Text>
        </TouchableOpacity>
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
    marginTop: 60, // Increased to prevent overlap with icons
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#233468',
    marginBottom: 5,
  },
  linkText: {
    fontSize: 16,
    color: '#233468',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
});

export default SitesInformationsUtiles;
