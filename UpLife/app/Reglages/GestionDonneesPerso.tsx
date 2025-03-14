import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

const GestionDonneesPerso = () => {
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
        <Text style={styles.pageTitle}>Gestion des données personnelles</Text>

        <View style={{ height: 10 }} />
        <Text style={styles.text}>
          Nous accordons une importance primordiale à la protection de vos données personnelles. Voici comment nous les traitons :
        </Text>

        <Text style={styles.text}>
          • <Text style={styles.bold}>Collecte et utilisation :</Text> Vos données (informations du profil, rendez-vous médicaux, préférences) sont collectées uniquement pour assurer le bon fonctionnement de l'application et améliorer votre expérience.
        </Text>

        <Text style={styles.text}>
          • <Text style={styles.bold}>Confidentialité:</Text> Vos données sont sécurisées et ne sont jamais partagées sans votre consentement.
        </Text>

        <Text style={styles.text}>
          • <Text style={styles.bold}>Accès et contrôle :</Text> Vous pouvez à tout moment consulter, modifier ou supprimer vos informations personnelles depuis les réglages ou Mon profil.
        </Text>

        <Text style={styles.text}>
          • <Text style={styles.bold}>Conservation et suppression :</Text> Vos données sont conservées aussi longtemps que nécessaire. En cas de suppression de compte, elles seront définitivement effacées.
        </Text>

        <Text style={styles.text}>
          • <Text style={styles.bold}>Vos droits :</Text> Conformément à la réglementation, vous pouvez exercer vos droits d'accès, de rectification ou de suppression en nous contactant via la rubrique Un problème à signaler.
        </Text>

        <Text style={styles.text}>
          Pour en savoir plus, consultez notre politique de confidentialité conforme au RGPD européen dans les <Text style={styles.link}>Mentions légales.</Text>
        </Text>

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
    textAlign: 'auto',
  },
  bold: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'auto',
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
});

export default GestionDonneesPerso;