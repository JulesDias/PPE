import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';

const GestionPrefNotif = () => {
  const [preferences, setPreferences] = useState({
    medicalAppointments: false,
    treatmentReminders: false,
    screeningReminders: false,
    vaccinationReminders: false,
    preventionReminders: false,
    profileNotifications: false,
    healthAlerts: false,
    crisisAlerts: false,
  });

interface Preferences {
    medicalAppointments: boolean;
    treatmentReminders: boolean;
    screeningReminders: boolean;
    vaccinationReminders: boolean;
    preventionReminders: boolean;
    profileNotifications: boolean;
    healthAlerts: boolean;
    crisisAlerts: boolean;
}

const toggleSwitch = (key: keyof Preferences) => {
    setPreferences((prevPreferences) => ({
        ...prevPreferences,
        [key]: !prevPreferences[key],
    }));
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
        <Text style={styles.pageTitle}>Gestion des préférences et notifications</Text>

        <Text style={styles.sectionTitle}>Rappels et suivi personnel</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>Rappels de mes prises de rendez-vous médicaux</Text>
          <Switch value={preferences.medicalAppointments} onValueChange={() => toggleSwitch('medicalAppointments')} />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Rappels de prises de traitements (médicaments, renouvellements d’ordonnance)</Text>
          <Switch value={preferences.treatmentReminders} onValueChange={() => toggleSwitch('treatmentReminders')} />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Rappels de dépistages recommandés</Text>
          <Switch value={preferences.screeningReminders} onValueChange={() => toggleSwitch('screeningReminders')} />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Rappels liés à la vaccination (vaccins obligatoires et recommandés, rappels à effectuer)</Text>
          <Switch value={preferences.vaccinationReminders} onValueChange={() => toggleSwitch('vaccinationReminders')} />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Rappels de prévention personnalisée</Text>
          <Switch value={preferences.preventionReminders} onValueChange={() => toggleSwitch('preventionReminders')} />
        </View>

        <Text style={styles.sectionTitle}>Gestion du profil</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>Notifications pour compléter ou mettre à jour mon profil</Text>
          <Switch value={preferences.profileNotifications} onValueChange={() => toggleSwitch('profileNotifications')} />
        </View>

        <Text style={styles.sectionTitle}>Informations et alertes sanitaires</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>Notifications sur l’actualité sanitaire (épidémies, campagnes de prévention)</Text>
          <Switch value={preferences.healthAlerts} onValueChange={() => toggleSwitch('healthAlerts')} />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Alertes en cas de crise sanitaire ou rappel de produit médical</Text>
          <Switch value={preferences.crisisAlerts} onValueChange={() => toggleSwitch('crisisAlerts')} />
        </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#233468',
    marginTop: 20,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});

export default GestionPrefNotif;
