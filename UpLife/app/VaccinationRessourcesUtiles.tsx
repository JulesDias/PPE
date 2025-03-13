import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

const VaccinationRessourcesUtiles = () => {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrow-left" size={30} color="white" />
      </TouchableOpacity>

      {/* Home Button */}
      <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.homeButton}>
        <Icon name="home" size={30} color="white" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>Ressources utiles sur la vaccination</Text>

        <View style={{ height: 20 }} />
        <Text style={styles.text}>
          Pour en savoir plus sur la vaccination, ses obligations, ses recommandations et les précautions à prendre avant un voyage, voici des sources fiables et officielles :
        </Text>

        <View style={{ height: 20 }} />
        <Text style={styles.bold}>Vaccinations obligatoires et recommandées</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.service-public.fr/particuliers/vosdroits/F724')}>
          <Text style={styles.link}>Service Public - Vaccination en France : Informations officielles sur les vaccins obligatoires et recommandés</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.pasteur.fr/fr/centre-medical/vaccination/calendrier-vaccinal')}>
          <Text style={styles.link}>Institut Pasteur - Calendrier vaccinal : Calendrier des vaccinations à suivre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.ameli.fr/assure/sante/themes/vaccination/vaccins-obligatoires')}>
          <Text style={styles.link}>Ameli - Vaccins obligatoires : Liste des vaccins obligatoires selon l’âge et la situation</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />

        <Text style={styles.bold}>Vaccinations et voyages</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.pasteur.fr/fr/centre-medical/preparer-son-voyage')}>
          <Text style={styles.link}>Institut Pasteur - Préparer son voyage : Recommandations vaccinales par pays</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.ameli.fr/assure/sante/themes/vaccination/vaccination-voyage')}>
          <Text style={styles.link}>Air France - Vaccins et voyage : Vaccins recommandés et conseils pour voyager en toute sécurité</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContainer: {
    padding: 20,
  },
  backButton: {
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
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
  },
  bold: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
    fontWeight: 'bold',
  },
  link: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
});

export default VaccinationRessourcesUtiles;
