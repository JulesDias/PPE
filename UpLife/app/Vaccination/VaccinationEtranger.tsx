import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';
import vaccinationData from '@/data/vaccinEtrangerInfo.json'; // Import du JSON

const VaccinationEtranger = () => {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  interface Country {
    pays: string;
    recommandations: string;
  }

  const handleSearch = (text: string) => {
    setSearch(text);
    const country = vaccinationData.find((c: Country) => c.pays.toLowerCase() === text.toLowerCase());
    setSelectedCountry(country || null);
  };

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
        <Text style={styles.pageTitle}>Vaccination à l'étranger</Text>
        <View style={{ height: 20 }} />
        <Text style={styles.text}>Veuillez rechercher un pays:</Text>

        <TextInput
          placeholder="Rechercher un pays..."
          placeholderTextColor="grey"
          onChangeText={handleSearch}
          value={search}
          style={styles.searchBar}
        />

        {selectedCountry && (
          <View>
            <Text style={styles.bold}>{selectedCountry.pays}</Text>
            <Text style={styles.italic}>Recommandations: {selectedCountry.recommandations}</Text>
          </View>
        )}
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
  italic: {
    fontSize: 14,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
    fontStyle: 'italic',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});

export default VaccinationEtranger;
