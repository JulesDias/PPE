import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

const SuppressionCompte = () => {
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
        <Text style={styles.pageTitle}>Suppression de compte</Text>

        <Text style={styles.text}>
          Êtes-vous sûr(e) de vouloir supprimer votre compte ? Cette action est définitive et entraînera la perte irréversible de toutes vos données personnelles.
        </Text>

        <Text style={styles.text}>
          Une fois votre compte supprimé, vous ne pourrez plus récupérer vos informations.
        </Text>

        <Text style={styles.boldText}>
          Confirmez-vous la suppression de votre compte ?
        </Text>

        {/* Confirmation Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={() => alert('Compte supprimé')}>
          <Text style={styles.confirmButtonText}>Je supprime mon compte</Text>
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
  boldText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'justify',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SuppressionCompte;