import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';

// For reading/writing local copies of JSON
import * as FileSystem from 'expo-file-system';

// 🔹 BUNDLED (READ-ONLY) JSON FILES:
import utilisateursJson from '@/data/utilisateurs.json';
import vaccinsJson from '@/data/vaccins.json';

// Local file paths in documentDirectory
const userFileUri = FileSystem.documentDirectory + 'utilisateurs.json';
const vaccinesFileUri = FileSystem.documentDirectory + 'vaccins.json';

const UserProfile = () => {
  // ========== STATES ==========
  // We'll store all users and all vaccines from the local JSON copies
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allVaccines, setAllVaccines] = useState<any[]>([]);

  // Just the single user we show (like your code: the first in the array)
  const [userData, setUserData] = useState<any>(null);

  // UI states
  const [menuVisible, setMenuVisible] = useState(false);
  const [showVaccins, setShowVaccins] = useState(false);

  // Edit user modal
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);

  // Add vaccine modal
  const [addVaccineModalVisible, setAddVaccineModalVisible] = useState(false);
  const [newVaccine, setNewVaccine] = useState<any>({
    userID: null,
    name: '',
    lastDose: '',
    nextDose: ''
  });

  // Edit vaccine modal
  const [editVaccineModalVisible, setEditVaccineModalVisible] = useState(false);
  // We'll keep track of the vaccine's data and also the "index" in the array
  const [editVaccineData, setEditVaccineData] = useState<{
    index: number;
    userID: number;
    name: string;
    lastDose: string;
    nextDose: string;
  } | null>(null);

  // ========== INIT ==========
  useEffect(() => {
    initFilesAndLoadData();
  }, []);

  // Copy utilisateurs.json and vaccins.json to the doc directory if they don’t exist
  const initFilesAndLoadData = async () => {
    try {
      // USERS
      const userInfo = await FileSystem.getInfoAsync(userFileUri);
      if (!userInfo.exists) {
        await FileSystem.writeAsStringAsync(
          userFileUri,
          JSON.stringify(utilisateursJson, null, 2)
        );
      }
      const rawUsers = await FileSystem.readAsStringAsync(userFileUri);
      const parsedUsers = JSON.parse(rawUsers);
      setAllUsers(parsedUsers);

      // VACCINES
      const vaccInfo = await FileSystem.getInfoAsync(vaccinesFileUri);
      if (!vaccInfo.exists) {
        await FileSystem.writeAsStringAsync(
          vaccinesFileUri,
          JSON.stringify(vaccinsJson, null, 2)
        );
      }
      const rawVaccines = await FileSystem.readAsStringAsync(vaccinesFileUri);
      const parsedVaccines = JSON.parse(rawVaccines);
      setAllVaccines(parsedVaccines);

      // For the example, pick the first user
      const currentUser = parsedUsers[0];
      setUserData(currentUser);
    } catch (error) {
      console.log('Error initializing files:', error);
    }
  };

  // Save users to local file
  const saveAllUsersToFile = async (updatedUsers: any[]) => {
    try {
      const newData = JSON.stringify(updatedUsers, null, 2);
      await FileSystem.writeAsStringAsync(userFileUri, newData);
    } catch (error) {
      console.log('Error saving users to file:', error);
    }
  };

  // Save vaccines to local file
  const saveAllVaccinesToFile = async (updatedVaccines: any[]) => {
    try {
      const newData = JSON.stringify(updatedVaccines, null, 2);
      await FileSystem.writeAsStringAsync(vaccinesFileUri, newData);
    } catch (error) {
      console.log('Error saving vaccines to file:', error);
    }
  };

  // ========== USER EDIT ==========
  const handleEditUserPress = () => {
    setEditUserModalVisible(true);
  };

  const handleCancelEditUser = () => {
    setEditUserModalVisible(false);
  };

  const handleSaveEditUser = async () => {
    if (!userData) return;

    // Overwrite the first user in the array
    const updatedUsers = [...allUsers];
    updatedUsers[0] = userData; // in your code: the "current user" is always index 0
    setAllUsers(updatedUsers);

    await saveAllUsersToFile(updatedUsers);
    setEditUserModalVisible(false);
  };

  // ========== VACCINES ==========
  // Filter vaccines by the user’s ID. If your user has ID 1, we filter on userID=1
  const userVaccines = userData
    ? allVaccines.filter((v: any) => v.userID === userData.ID_utilisateur)
    : [];

  // ---- ADD VACCINE ----
  const onAddVaccinePress = () => {
    setNewVaccine({
      userID: userData ? userData.ID_utilisateur : null,
      name: '',
      lastDose: '',
      nextDose: ''
    });
    setAddVaccineModalVisible(true);
  };

  const handleCancelAddVaccine = () => {
    setAddVaccineModalVisible(false);
  };

  const handleSaveAddVaccine = async () => {
    if (!newVaccine || !userData) return;

    // Just push a new entry
    const newRecord = {
      userID: userData.ID_utilisateur,
      name: newVaccine.name,
      lastDose: newVaccine.lastDose,
      nextDose: newVaccine.nextDose
    };

    const updatedVaccines = [...allVaccines, newRecord];
    setAllVaccines(updatedVaccines);

    await saveAllVaccinesToFile(updatedVaccines);
    setAddVaccineModalVisible(false);
  };

  // ---- EDIT VACCINE ----
  // Since we have no `id` field, we rely on array index for editing
  const onEditVaccinePress = (vaccine: any, indexInUserList: number) => {
    // We need to figure out the index in the "allVaccines" array
    // by scanning for the nth occurrence matching userID, name, lastDose, etc.
    // Alternatively, we can pass the "global index" from the map. For simplicity, we can map over the userVaccines and find its matching element in allVaccines.
    // We'll do a direct approach below.

    const globalIndex = allVaccines.findIndex(
      (v) =>
        v.userID === vaccine.userID &&
        v.name === vaccine.name &&
        v.lastDose === vaccine.lastDose &&
        v.nextDose === vaccine.nextDose
    );

    if (globalIndex === -1) {
      console.warn('Could not find vaccine in allVaccines array.');
      return;
    }

    setEditVaccineData({
      index: globalIndex,
      userID: vaccine.userID,
      name: vaccine.name,
      lastDose: vaccine.lastDose,
      nextDose: vaccine.nextDose
    });
    setEditVaccineModalVisible(true);
  };

  const handleCancelEditVaccine = () => {
    setEditVaccineModalVisible(false);
    setEditVaccineData(null);
  };

  const handleSaveEditVaccine = async () => {
    if (!editVaccineData) return;

    const { index, userID, name, lastDose, nextDose } = editVaccineData;

    // Update the vaccine at the given index
    const updated = [...allVaccines];
    updated[index] = { userID, name, lastDose, nextDose };
    setAllVaccines(updated);

    await saveAllVaccinesToFile(updated);
    setEditVaccineModalVisible(false);
    setEditVaccineData(null);
  };

  // ========== RENDER ==========

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Menu Button */}
      {!menuVisible && (
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={{ position: 'absolute', top: 15, left: 15, zIndex: 10 }}
        >
          <Icon name="bars" size={30} color="black" />
        </TouchableOpacity>
      )}

      {/* Home Button */}
      <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.homeButton}>
        <Icon name="home" size={30} color="black" />
      </TouchableOpacity>

      <Text style={styles.pageTitle}>MON COMPTE</Text>

      <ScrollView>
        {/* PERSONAL INFORMATION */}
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
          <ProfileField
            label="Sexe"
            value={userData.Sexe === 'F' ? 'Femme' : 'Homme'}
          />
          <ProfileField label="Poids" value={`${userData.Poids} kg`} />
          <ProfileField label="Taille" value={`${userData.Taille} cm`} />
          <ProfileField label="Groupe sanguin" value={userData.G_sanguin} />
        </View>

        {/* VACCINES */}
        <TouchableOpacity
          onPress={() => setShowVaccins(!showVaccins)}
          style={styles.vaccineToggle}
        >
          <Text style={styles.toggleText}>Mes Vaccins</Text>
          <Icon
            name={showVaccins ? 'angle-up' : 'angle-down'}
            size={20}
            color="#233468"
          />
        </TouchableOpacity>

        {showVaccins && (
          <View style={styles.vaccineContainer}>
            {userVaccines.length === 0 ? (
              <Text style={{ fontStyle: 'italic', marginBottom: 10 }}>
                Aucun vaccin enregistré pour cet utilisateur.
              </Text>
            ) : (
              userVaccines.map((vac: any, idx: number) => (
                <View key={idx} style={styles.vaccineCard}>
                  <Text style={styles.vaccineLabel}>{vac.name}:</Text>
                  <Text>Dernière dose: {vac.lastDose}</Text>
                  <Text>Prochain rappel: {vac.nextDose}</Text>

                  {/* Edit button: we pass the vaccine + its index among the userVaccines */}
                  <TouchableOpacity
                    style={styles.vaccineEditButton}
                    onPress={() => onEditVaccinePress(vac, idx)}
                  >
                    <Text style={styles.vaccineEditButtonText}>Modifier</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}

            {/* Add a new Vaccine */}
            <TouchableOpacity style={styles.addButton} onPress={onAddVaccinePress}>
              <Text style={styles.addButtonText}>+ Ajouter un nouveau vaccin</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* EDIT USER INFO BUTTON */}
        <TouchableOpacity style={styles.editButton} onPress={handleEditUserPress}>
          <Text style={styles.editButtonText}>Modifier mes informations</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* SIDEBAR */}
      <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />

      {/* ========== MODALS ========== */}

      {/* EDIT USER INFO MODAL */}
      <Modal
        visible={editUserModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancelEditUser}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier mes informations</Text>

            <ScrollView style={{ maxHeight: '70%' }}>
              <Text style={styles.modalLabel}>Nom</Text>
              <TextInput
                style={styles.modalInput}
                value={userData.Nom}
                onChangeText={(text) => setUserData({ ...userData, Nom: text })}
              />

              <Text style={styles.modalLabel}>Prénom</Text>
              <TextInput
                style={styles.modalInput}
                value={userData.Prenom}
                onChangeText={(text) => setUserData({ ...userData, Prenom: text })}
              />

              <Text style={styles.modalLabel}>E-mail</Text>
              <TextInput
                style={styles.modalInput}
                value={userData.Email}
                onChangeText={(text) => setUserData({ ...userData, Email: text })}
              />

              <Text style={styles.modalLabel}>Téléphone</Text>
              <TextInput
                style={styles.modalInput}
                value={userData.Tel_perso}
                onChangeText={(text) => setUserData({ ...userData, Tel_perso: text })}
              />

              <Text style={styles.modalLabel}>Date de Naissance</Text>
              <TextInput
                style={styles.modalInput}
                value={userData.D_naissance}
                onChangeText={(text) =>
                  setUserData({ ...userData, D_naissance: text })
                }
              />

              <Text style={styles.modalLabel}>Sexe (F/H)</Text>
              <TextInput
                style={styles.modalInput}
                value={userData.Sexe}
                onChangeText={(text) => setUserData({ ...userData, Sexe: text })}
              />

              <Text style={styles.modalLabel}>Poids (kg)</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={String(userData.Poids)}
                onChangeText={(text) =>
                  setUserData({ ...userData, Poids: parseInt(text) || 0 })
                }
              />

              <Text style={styles.modalLabel}>Taille (cm)</Text>
              <TextInput
                style={styles.modalInput}
                keyboardType="numeric"
                value={String(userData.Taille)}
                onChangeText={(text) =>
                  setUserData({ ...userData, Taille: parseInt(text) || 0 })
                }
              />

              <Text style={styles.modalLabel}>Groupe sanguin</Text>
              <TextInput
                style={styles.modalInput}
                value={userData.G_sanguin}
                onChangeText={(text) =>
                  setUserData({ ...userData, G_sanguin: text })
                }
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={handleCancelEditUser}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#b6d379' }]}
                onPress={handleSaveEditUser}
              >
                <Text style={styles.modalButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ADD VACCINE MODAL */}
      <Modal
        visible={addVaccineModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancelAddVaccine}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un vaccin</Text>

            <Text style={styles.modalLabel}>Nom du vaccin</Text>
            <TextInput
              style={styles.modalInput}
              value={newVaccine.name}
              onChangeText={(text) => setNewVaccine({ ...newVaccine, name: text })}
            />

            <Text style={styles.modalLabel}>Dernière dose</Text>
            <TextInput
              style={styles.modalInput}
              value={newVaccine.lastDose}
              onChangeText={(text) => setNewVaccine({ ...newVaccine, lastDose: text })}
            />

            <Text style={styles.modalLabel}>Prochain rappel</Text>
            <TextInput
              style={styles.modalInput}
              value={newVaccine.nextDose}
              onChangeText={(text) => setNewVaccine({ ...newVaccine, nextDose: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={handleCancelAddVaccine}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#b6d379' }]}
                onPress={handleSaveAddVaccine}
              >
                <Text style={styles.modalButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT VACCINE MODAL */}
      <Modal
        visible={editVaccineModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCancelEditVaccine}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le vaccin</Text>

            {editVaccineData && (
              <>
                <Text style={styles.modalLabel}>Nom du vaccin</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editVaccineData.name}
                  onChangeText={(text) =>
                    setEditVaccineData({ ...editVaccineData, name: text })
                  }
                />

                <Text style={styles.modalLabel}>Dernière dose</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editVaccineData.lastDose}
                  onChangeText={(text) =>
                    setEditVaccineData({ ...editVaccineData, lastDose: text })
                  }
                />

                <Text style={styles.modalLabel}>Prochain rappel</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editVaccineData.nextDose}
                  onChangeText={(text) =>
                    setEditVaccineData({ ...editVaccineData, nextDose: text })
                  }
                />
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={handleCancelEditVaccine}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#b6d379' }]}
                onPress={handleSaveEditVaccine}
              >
                <Text style={styles.modalButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 🔹 FIELD COMPONENT
const ProfileField = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput value={value} editable={false} style={styles.input} />
  </View>
);

// 🔹 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FEFEFE'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFEFE'
  },
  loadingText: {
    fontSize: 18,
    color: '#233468'
  },
  homeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#233468',
    fontFamily: 'Sora-Medium',
    marginBottom: 15
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
  vaccineContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10
  },
  vaccineCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5
  },
  vaccineLabel: {
    fontWeight: 'bold',
    color: '#233468'
  },
  vaccineEditButton: {
    backgroundColor: '#233468',
    padding: 6,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start'
  },
  vaccineEditButtonText: {
    color: '#fff',
    fontWeight: '600'
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
  editButton: {
    backgroundColor: '#233468',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#233468',
    textAlign: 'center'
  },
  modalLabel: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#233468'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
    color: 'black'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  modalButton: {
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  modalButtonText: {
    color: '#000',
    fontWeight: '600'
  }
});

export default UserProfile;
