import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase';

const SuppressionCompte = () => {
  const handleDeleteAccount = async () => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Utilisateur non authentifié :', userError?.message);
      return;
    }

    const userId = user.id;

    try {
      // 1. Supprimer les enregistrements liés dans les tables dépendantes
      const { error: vaccinsError } = await supabase.from('Vaccins').delete().eq('ID_utilisateur', userId);
      const { error: rdvsError } = await supabase.from('rdvs').delete().eq('ID_utilisateur', userId);

      if (vaccinsError || rdvsError) {
        console.error('Erreur suppression données liées :', vaccinsError || rdvsError);
        return;
      }

      // 2. Supprimer l'utilisateur de la table "utilisateurs"
      const { error: userDeleteError } = await supabase.from('utilisateurs').delete().eq('id', userId);

      if (userDeleteError) {
        console.error('Erreur suppression utilisateur :', userDeleteError.message);
        return;
      }

      // 3. Supprimer le compte d'authentification Supabase
      const { error: authError } = await supabase.auth.admin.deleteUser(userId); // Nécessite des privilèges admin

      if (authError) {
        console.error('Erreur suppression compte auth :', authError.message);
        return;
      }

      // 4. Déconnexion
      await supabase.auth.signOut();

      // 5. Redirection vers l'accueil
      router.replace('/login');
    } catch (err) {
      console.error('Erreur inattendue lors de la suppression :', err);
    }
  };

  const confirmerSuppression = () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr(e) de vouloir supprimer votre compte ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Oui, supprimer", onPress: handleDeleteAccount, style: "destructive" }
      ]
    );
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
        <TouchableOpacity style={styles.confirmButton} onPress={confirmerSuppression}>
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
