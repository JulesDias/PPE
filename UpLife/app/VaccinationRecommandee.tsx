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
          <Text style={styles.tableCell}>BCG (tuberculose)</Text>
          <Text style={styles.tableCell}>Dès la naissance jusqu'à 15 ans</Text>
          <Text style={styles.tableCell}>Pour les enfants à risque élevé</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Coqueluche</Text>
          <Text style={styles.tableCell}>2 mois, entourage du nourrisson, femmes enceintes (20-36 SA)</Text>
          <Text style={styles.tableCell}>En absence de vaccination maternelle, recommandée aux proches du nourrisson</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Hépatite B</Text>
          <Text style={styles.tableCell}>2 mois</Text>
          <Text style={styles.tableCell}>Possible jusqu'à 15 ans, puis après 16 ans pour les personnes à risque</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Pneumocoque</Text>
          <Text style={styles.tableCell}>2 mois</Text>
          <Text style={styles.tableCell}>-</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Méningocoque C</Text>
          <Text style={styles.tableCell}>5 mois</Text>
          <Text style={styles.tableCell}>Rattrapage possible jusqu'à 24 ans</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Rougeole, oreillons, rubéole (ROR)</Text>
          <Text style={styles.tableCell}>12 mois (1ère dose), 16-18 mois (2e dose)</Text>
          <Text style={styles.tableCell}>Dose additionnelle pour les personnes nées après 1980 si 1ère dose avant 1 an</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Papillomavirus humains (HPV)</Text>
          <Text style={styles.tableCell}>11-14 ans (filles et garçons)</Text>
          <Text style={styles.tableCell}>Rattrapage jusqu'à 19 ans, campagne nationale en milieu scolaire</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Grippe</Text>
          <Text style={styles.tableCell}>Annuel à partir de 6 mois pour les personnes à risque</Text>
          <Text style={styles.tableCell}>Possible pour tous les enfants (12-18 ans), recommandée aux professionnels exposés</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Zona</Text>
          <Text style={styles.tableCell}>Dès 65 ans</Text>
          <Text style={styles.tableCell}>-</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Covid-19</Text>
          <Text style={styles.tableCell}>Selon recommandations officielles</Text>
          <Text style={styles.tableCell}>Règles spécifiques en fonction des variants et populations cibles</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Varicelle du singe</Text>
          <Text style={styles.tableCell}>Personnes à très haut risque d'exposition</Text>
          <Text style={styles.tableCell}>Campagne en cours pour sujets contacts</Text>
        </View>
      </View>
    );
  };
  

  const TableVaccinationDetails = () => {
    return (
      <View style={styles.tableContainer}>
        <View style={styles.tableRowHeader}>
          <Text style={styles.tableHeader}>Vaccin</Text>
          <Text style={styles.tableHeader}>Âge</Text>
          <Text style={styles.tableHeader}>Remarques</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>BCG (tuberculose)</Text>
          <Text style={styles.tableCell}>Dès la naissance jusqu'à 15 ans</Text>
          <Text style={styles.tableCell}>Pour les enfants à risque élevé</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Papillomavirus humains</Text>
          <Text style={styles.tableCell}>11-14 ans (filles et garçons)</Text>
          <Text style={styles.tableCell}>Rattrapage possible jusqu'à 19 ans</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Grippe</Text>
          <Text style={styles.tableCell}>Annuel dès 6 mois pour les personnes à risque</Text>
          <Text style={styles.tableCell}>Possible pour tous les enfants (2-18 ans) sans comorbidité</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Zona</Text>
          <Text style={styles.tableCell}>Dès 65 ans</Text>
          <Text style={styles.tableCell}>-</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Rotavirus</Text>
          <Text style={styles.tableCell}>Nourrissons de 6 semaines à 6 mois</Text>
          <Text style={styles.tableCell}>-</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Covid-19</Text>
          <Text style={styles.tableCell}>Selon recommandations officielles</Text>
          <Text style={styles.tableCell}>Règles spécifiques en fonction des variants et populations cibles</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Varicelle du singe</Text>
          <Text style={styles.tableCell}>Personnes à très haut risque d'exposition</Text>
          <Text style={styles.tableCell}>Campagne en cours pour sujets contacts</Text>
        </View>
      </View>
    );
  };
  

const VaccinationRecommandee = () => {
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
        <Text style={styles.pageTitle}>LA VACCINATION</Text>
        <Text style={styles.text}>
        La vaccination en France concerne tous les âges et suit un calendrier actualisé chaque année par le ministère de la Santé.
        </Text>
        <Text style={styles.text}>
        Certaines vaccinations sont obligatoires, sauf en cas de contre-indications médicales évaluées par un professionnel de santé. Les titulaires de l'autorité parentale doivent veiller au respect de cette obligation.
        </Text>
        <Text style={styles.text}>
        D'autres vaccinations sont <Text style={styles.bold}>recommandées</Text> pour assurer une protection optimale, en fonction de l'âge, des facteurs de risque et des situations particulières.
        </Text>
        
        <Text style={styles.bold}>Vaccinations recommandées en France (pour les personnes nées avant 2018)</Text>

        <TableVaccinationObligation />

        
        <View style={{ height: 20 }} />

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

export default VaccinationRecommandee;
