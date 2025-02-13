import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import medecinsData from '../data/medecins.json'; // Import direct du JSON

// Définition du type pour éviter l'erreur 'never'
interface Medecin {
  ID_medecin: number;
  Nom: string;
  Specialite: string;
  Adresse: string;
}

export default function MesProDeSante() {
  const [medecins] = useState<Medecin[]>(medecinsData); // On charge directement les données importées

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Entypo name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Mes professionnels de santé</Text>
        <TouchableOpacity onPress={() => alert('Action du bouton droit')}>
          <FontAwesome name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* LISTE DES MÉDECINS */}
      <FlatList
        data={medecins}
        keyExtractor={(item) => item.ID_medecin.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>Dr. {item.Nom}</Text>
            <Text style={styles.speciality}>{item.Specialite}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFEFEF', padding: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#26336A', padding: 15 },
  headerText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#26336A' },
  speciality: { fontSize: 14, color: '#555' },
});
