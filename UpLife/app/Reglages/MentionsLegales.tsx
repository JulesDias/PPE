import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

const MentionsLegales = () => {
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
        <Text style={styles.pageTitle}>Mentions légales</Text>

        <View style={{ height: 30 }} />
        <Text style={styles.text}>
        Identification de l'éditeur:
        </Text>

        <Text style={styles.text}>
          Hébergeur de l'application:
        </Text>

        <Text style={styles.text}>
            Objet et fonctionnement de l'application:
        </Text>

        <Text style={styles.text}>
            Propriété intellectuelle:
        </Text>

        <Text style={styles.text}>
            Protection des données personnelles (RGPD):
        </Text>

        <Text style={styles.text}>
            Responsabilité et limitation
        </Text>

        <Text style={styles.text}>
            Conditions générales d'utilisation (CGU):
        </Text>

        <Text style={styles.text}>
            Droit applicable et juridiction compétente:
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

export default MentionsLegales;