import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

const ISTressourcesUtiles = () => {
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
        <Text style={styles.pageTitle}>Ressources utiles sur les IST</Text>

        <View style={{ height: 20 }} />
        <Text style={styles.text}>
          Pour en savoir plus sur les IST, voici des sources fiables et officielles :
        </Text>

        <View style={{ height: 20 }} />
        <Text style={styles.bold}>Ministère du Trvail:</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://sante.gouv.fr/soins-et-maladies/maladies/infections-sexuellement-transmissibles/article/infections-sexuellement-transmissibles-ist')}>
          <Text style={styles.link}>Ministère du Travail, de la Santé, des Solidarités et des Familles - Infections sexuellement transmissibles (IST)</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />

        <Text style={styles.bold}>Sites de l'Assurance Maladie:</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://sante.gouv.fr/soins-et-maladies/maladies/infections-sexuellement-transmissibles/article/infections-sexuellement-transmissibles-ist')}>
          <Text style={styles.link}>Dépistage des IST en laboratoire sans ordonnance : Mon test IST</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.ameli.fr/assure/sante/themes/mst-ist/maladies-infections-sexuellement-transmissibles')}>
          <Text style={styles.link}>Assurance Maladie - Maladies et infections sexuellement transmissibles</Text>
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

export default ISTressourcesUtiles;
