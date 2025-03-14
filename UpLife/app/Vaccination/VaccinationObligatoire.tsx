import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

// Hardcore de pas créer un component dans /components je suis solo nique Bill Gates
const TableVaccinationObligation = () => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableRowHeader}>
        <Text style={styles.tableHeader}>Vaccin</Text>
        <Text style={styles.tableHeader}>Population</Text>
        <Text style={styles.tableHeader}>Obligation</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>DTP</Text>
        <Text style={styles.tableCell}>Tous dès la naissance</Text>
        <Text style={styles.tableCell}>Exigé pour l'école</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Fièvre jaune</Text>
        <Text style={styles.tableCell}>Résidents en Guyane</Text>
        <Text style={styles.tableCell}>Obligatoire</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Tuberculose, hépatite B, typhoïde</Text>
        <Text style={styles.tableCell}>Travailleurs exposés (ex. medical)</Text>
        <Text style={styles.tableCell}>Obligatoire selon l’environnement professionnel</Text>
      </View>
    </View>
  );
};

const TableVaccinationDetails = () => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableRowHeader}>
        <Text style={styles.tableHeader}>Vaccin</Text>
        <Text style={styles.tableHeader}>Âge </Text>
        <Text style={styles.tableHeader}>Remarques</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>DTP</Text>
        <Text style={styles.tableCell}>Dès la naissance</Text>
        <Text style={styles.tableCell}>Rappels à 25, 45, 65 ans, puis tous les 10 ans</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Coqueluche</Text>
        <Text style={styles.tableCell}>2 mois</Text>
        <Text style={styles.tableCell}>Obligatoire</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Fièvre jaune</Text>
        <Text style={styles.tableCell}>12 mois (Guyane)</Text>
        <Text style={styles.tableCell}>Obligatoire pour résidents et visiteurs</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>Hépatite B</Text>
        <Text style={styles.tableCell}>2 mois</Text>
        <Text style={styles.tableCell}>Possible jusqu'à 15 ans si non fait avant 1 an</Text>
      </View>
    </View>
  );
};

const VaccinationObligatoire = () => {
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
        <Text style={styles.pageTitle}>Vaccination Obligatoire</Text>
        <View style={{ height: 20 }} />
        <Text style={styles.text}>
          La vaccination en France est destinée à tous quel que soit l'âge, et suit un calendrier mis à jour chaque année par le ministère de la Santé.
        </Text>
        <Text style={styles.text}>
          Certaines vaccinations sont <Text style={styles.bold}>obligatoires</Text>, sauf en cas de contre-indications médicales, évaluées par un professionnel de santé.
        </Text>
        <Text style={styles.text}>
          Les titulaires de l'autorité parentale doivent veiller au respect de cette obligation.
        </Text>
        
        <Text style={styles.bold}>Vaccinations obligatoires en France (pour les personnes nées avant 2018):</Text>

        <TableVaccinationObligation />

        <Text style={styles.italic}>
        Rappels DTP : recommandés à 25, 45, 65 ans, puis tous les 10 ans.
        </Text>
        
        <View style={{ height: 20 }} />
        <Text style={styles.text}>
          Depuis 2018, certaines vaccinations sont devenues obligatoires pour les enfants nés à partir de cette date. Voici le tableau détaillé :
        </Text>

        <Text style={styles.bold}>
        Vaccinations obligatoires en France (pour les personnes nées depuis 2018):
        </Text>
        
        <TableVaccinationDetails />
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
  tableContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#233468',
    padding: 10,
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
});

export default VaccinationObligatoire;
