import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '@/services/supabase';
import { router } from 'expo-router';
import Sidebar from '@/components/Sidebar';

const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput value={value} editable={false} style={styles.input} />
  </View>
);

export default function ProfileScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [prenom, setPrenom] = useState('');
  const [userData, setUserData] = useState<any>({});
  const [vaccins, setVaccins] = useState<any[]>([]);
  const [showVaccins, setShowVaccins] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newVaccine, setNewVaccine] = useState({ Nom: '', V_date: '', next_date: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Erreur de récupération de l'utilisateur:", error.message);
        return;
      }

      if (user) {
        const id = user.id;
        setUserId(id);

        const { data: utilisateurData, error: utilisateurError } = await supabase
          .from("utilisateurs")
          .select("*")
          .eq("id", id)
          .single();

        if (utilisateurError) {
          console.error("Erreur de récupération de l'utilisateur:", utilisateurError.message);
        } else if (utilisateurData) {
          setUserData(utilisateurData);
          setPrenom(utilisateurData.Prenom);
        }

        fetchVaccins(id); // charger les vaccins dès que l'ID est dispo
      }
    };

    fetchUser();
  }, []);

  const fetchVaccins = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('Vaccins')
        .select('*')
        .eq('ID_utilisateur', id);

      if (error) throw error;
      setVaccins(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des vaccins :', error);
    }
  };

  const addVaccine = async () => {
    try {
      const { error } = await supabase
        .from('Vaccins')
        .insert([{ ...newVaccine, ID_utilisateur: userId }]);

      if (error) throw error;

      fetchVaccins(userId);
      setModalVisible(false);
      setNewVaccine({ Nom: '', V_date: '', next_date: '' });
    } catch (error) {
      console.error("Erreur lors de l'ajout du vaccin :", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Bouton Menu*/}
      {!menuVisible && (
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ position: 'absolute', top: 15, left: 15, zIndex: 10 }}>
            <Icon name="bars" size={30} color="black" />
        </TouchableOpacity>
      )}

      {/* Home Button */}
      <TouchableOpacity onPress={() => router.push('/(tabs)')} style={{ position: 'absolute', top: 15, right: 15, zIndex: 10 }}>
        <Icon name="home" size={30} color="black" />
      </TouchableOpacity>

      <Text style={styles.pageTitle}>MON COMPTE</Text>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes informations</Text>
            <ProfileField label="Nom" value={userData.Nom} />
            <ProfileField label="Prénom" value={userData.Prenom} />
            <ProfileField label="E-mail" value={userData.Email} />
            <ProfileField label="Téléphone" value={userData.Tel_perso} />
        </View>
        {/* HEALTH DATA */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mes données de santé</Text>
            <ProfileField label="Date de Naissance" value={userData.D_naissance} />
            <ProfileField label="Sexe" value={userData.Sexe}/>
            <ProfileField label="Poids" value={`${userData.Poids} kg`} />
            <ProfileField label="Taille" value={`${userData.Taille} cm`} />
            <ProfileField label="Groupe sanguin" value={userData.G_sanguin} />
        </View>
        
        <TouchableOpacity style={styles.vaccineToggle} onPress={() => setShowVaccins(!showVaccins)}>
        <Text style={styles.toggleText}>Mes Vaccins</Text>
            <Icon
              name={showVaccins ? 'angle-up' : 'angle-down'}
              size={20}
              color="#233468"
            />
        </TouchableOpacity>

        {showVaccins && (
          <View style={styles.vaccineContainer}>
            {vaccins.length === 0 ? (
              <Text>Aucun vaccin enregistré</Text>
            ) : (
              vaccins.map((vac: any, idx: number) => (
                <View key={idx} style={styles.vaccineItem}>
                  <Text style={styles.vaccineLabel}>{vac.Nom} :</Text>
                  <Text>Dernière dose : {new Date(vac.V_date).toLocaleDateString()}</Text>
                  <Text>Prochain rappel : {new Date(vac.next_date).toLocaleDateString()}</Text>
                </View>
              ))
            )}
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}><Text style={styles.addButtonText}>+ Ajouter un nouveau vaccin</Text></TouchableOpacity>
          </View>
        )}

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.subtitle}>Ajouter un vaccin</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Nom du vaccin"
                placeholderTextColor="grey"
                value={newVaccine.Nom}
                onChangeText={(text) => setNewVaccine({ ...newVaccine, Nom: text })}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Date de la dernière dose (YYYY-MM-DD)"
                placeholderTextColor="grey"
                value={newVaccine.V_date}
                onChangeText={(text) => setNewVaccine({ ...newVaccine, V_date: text })}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Prochaine dose (YYYY-MM-DD)"
                placeholderTextColor="grey"
                value={newVaccine.next_date}
                onChangeText={(text) => setNewVaccine({ ...newVaccine, next_date: text })}
              />
              <Button title="Enregistrer" onPress={addVaccine} />
              <Button title="Annuler" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </ScrollView>
      <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  infoContainer: {
    marginBottom: 20,
  },
  vaccineContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10
  },
  vaccineItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eef',
    borderRadius: 8,
  },
  vaccineLabel: {
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalInput: {
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingVertical: 5,
    color: '#233468',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#233468',
    fontFamily: 'Sora-Medium',
    marginBottom: 15
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
  section: {
    backgroundColor: '#b6d379',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  sectionTitle: {
    fontFamily: 'Sora-Medium',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#233468',
    marginBottom: 10
  },
  fieldContainer: {
    marginBottom: 10
  },
  fieldLabel: {
    fontWeight: 'bold',
    color: '#233468'
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    color: 'black'
  },
  vaccineToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#b6d379',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  toggleText: {
    fontWeight: 'bold',
    color: '#233468'
  },
  addButton: {
    backgroundColor: '#b6d379',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center'
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
});
