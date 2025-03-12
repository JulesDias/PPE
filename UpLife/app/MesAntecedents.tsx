import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet
} from 'react-native';

// For reading/writing our local JSON copy
import * as FileSystem from 'expo-file-system';

// For icons
import Icon from 'react-native-vector-icons/FontAwesome';

// Import your sidebar
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';

// Import the data from your original /data/antecedent.json
// (Will copy it into the DocumentDirectory if needed.)
import antecedentData from '@/data/antecedent.json';

interface AntecedentPersonnel {
  id: number;
  titre: string;
  date: string;
  traitement: string;
  medecin: string;
  notes: string;
}

interface AntecedentFamilial {
  id: number;
  titre: string;
  membre: string;
  age_apparition: string;
  notes: string;
}

const MesAntecedents: React.FC = () => {
  // We keep arrays for each category
  const [personnels, setPersonnels] = useState<AntecedentPersonnel[]>([]);
  const [familiaux, setFamiliaux] = useState<AntecedentFamilial[]>([]);

  // Collapsed by default
  const [isPersonnelsOpen, setIsPersonnelsOpen] = useState<boolean>(false);
  const [isFamiliauxOpen, setIsFamiliauxOpen] = useState<boolean>(false);

  // States to handle modals for editing/adding
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<
    Partial<AntecedentPersonnel | AntecedentFamilial> & { category?: 'personnels' | 'familiaux' }
  >({});

  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<
    Partial<AntecedentPersonnel | AntecedentFamilial> & { category?: 'personnels' | 'familiaux' }
  >({});

  // Sidebar menu visibility
  const [menuVisible, setMenuVisible] = useState(false);

  // Where we’ll store the local path of antecedent.json
  const fileUri = FileSystem.documentDirectory + 'antecedent.json';

  useEffect(() => {
    // On mount, check if we have a local copy in documentDirectory.
    // If not, create one using the original imported data.
    initAntecedentData();
  }, []);

  const initAntecedentData = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        // Write the initial data to local documentDirectory
        await FileSystem.writeAsStringAsync(
          fileUri,
          JSON.stringify(antecedentData, null, 2)
        );
      }
      // Now read from the local file
      const json = await FileSystem.readAsStringAsync(fileUri);
      const parsed = JSON.parse(json);
      setPersonnels(parsed.personnels || []);
      setFamiliaux(parsed.familiaux || []);
    } catch (error) {
      console.log('Error initializing antecedent data:', error);
    }
  };

  // Save changes to local JSON
  const saveToJSONFile = async (
    updatedPersonnels: AntecedentPersonnel[],
    updatedFamiliaux: AntecedentFamilial[]
  ) => {
    try {
      const updatedData = { personnels: updatedPersonnels, familiaux: updatedFamiliaux };
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(updatedData, null, 2));
    } catch (error) {
      console.log('Error saving to JSON file:', error);
    }
  };

  // Toggle section expand/collapse
  const togglePersonnels = () => setIsPersonnelsOpen(!isPersonnelsOpen);
  const toggleFamiliaux = () => setIsFamiliauxOpen(!isFamiliauxOpen);

  // ---- EDIT FUNCTIONS ----
  const onEditPress = (
    item: AntecedentPersonnel | AntecedentFamilial,
    category: 'personnels' | 'familiaux'
  ) => {
    setEditItem({ ...item, category });
    setEditModalVisible(true);
  };

  const handleEditSave = async () => {
    const category = editItem.category;
    if (!category) return setEditModalVisible(false);

    if (category === 'personnels') {
      const updated = personnels.map((p) =>
        p.id === editItem.id
          ? {
            ...p,
            titre: editItem.titre || '',
            date: (editItem as AntecedentPersonnel).date || '',
            traitement: (editItem as AntecedentPersonnel).traitement || '',
            medecin: (editItem as AntecedentPersonnel).medecin || '',
            notes: (editItem as AntecedentPersonnel).notes || '',
          }
          : p
      );
      setPersonnels(updated);
      setEditModalVisible(false);
      setEditItem({});

      // Save to local JSON
      await saveToJSONFile(updated, familiaux);
    } else {
      const updated = familiaux.map((f) =>
        f.id === editItem.id
          ? {
            ...f,
            titre: editItem.titre || '',
            membre: (editItem as AntecedentFamilial).membre || '',
            age_apparition: (editItem as AntecedentFamilial).age_apparition || '',
            notes: (editItem as AntecedentFamilial).notes || '',
          }
          : f
      );
      setFamiliaux(updated);
      setEditModalVisible(false);
      setEditItem({});

      // Save to local JSON
      await saveToJSONFile(personnels, updated);
    }
  };

  // ---- ADD FUNCTIONS ----
  const onAddPress = (category: 'personnels' | 'familiaux') => {
    setNewItem({ category });
    setAddModalVisible(true);
  };

  const handleAddSave = async () => {
    const category = newItem.category;
    if (!category) return setAddModalVisible(false);

    if (category === 'personnels') {
      const newId = personnels.length > 0 ? personnels[personnels.length - 1].id + 1 : 1;
      const newPersonnel: AntecedentPersonnel = {
        id: newId,
        titre: newItem.titre || '',
        date: (newItem as AntecedentPersonnel).date || '',
        traitement: (newItem as AntecedentPersonnel).traitement || '',
        medecin: (newItem as AntecedentPersonnel).medecin || '',
        notes: (newItem as AntecedentPersonnel).notes || '',
      };
      const updated = [...personnels, newPersonnel];
      setPersonnels(updated);
      setAddModalVisible(false);
      setNewItem({});

      // Save to local JSON
      await saveToJSONFile(updated, familiaux);
    } else {
      const newId = familiaux.length > 0 ? familiaux[familiaux.length - 1].id + 1 : 1;
      const newFamilial: AntecedentFamilial = {
        id: newId,
        titre: newItem.titre || '',
        membre: (newItem as AntecedentFamilial).membre || '',
        age_apparition: (newItem as AntecedentFamilial).age_apparition || '',
        notes: (newItem as AntecedentFamilial).notes || '',
      };
      const updated = [...familiaux, newFamilial];
      setFamiliaux(updated);
      setAddModalVisible(false);
      setNewItem({});

      // Save to local JSON
      await saveToJSONFile(personnels, updated);
    }
  };

  return (
    <View style={styles.container}>
      {/* Burger icon (top-left) to open the sidebar if it’s closed */}
      {!menuVisible && (
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuIcon}>
          <Icon name="bars" size={30} color="black" />
        </TouchableOpacity>
      )}

      {/* Home icon (top-right) */}
      <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.homeIcon}>
        <Icon name="home" size={30} color="black" />
      </TouchableOpacity>

      {/* Title at the top */}
      <Text style={styles.pageTitle}>MES ANTÉCÉDENTS</Text>

      <ScrollView style={{ marginTop: 20 }}>
        {/* Personnels */}
        <TouchableOpacity onPress={togglePersonnels} style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Antécédents Personnels</Text>
          <Text style={styles.sectionHeaderIcon}>{isPersonnelsOpen ? '-' : '+'}</Text>
        </TouchableOpacity>
        {isPersonnelsOpen && (
          <View style={styles.sectionContent}>
            {personnels.length === 0 ? (
              <Text style={styles.emptyText}>Aucun antécédent personnel.</Text>
            ) : (
              personnels.map((item) => (
                <View key={item.id} style={styles.antecedentCard}>
                  <Text style={styles.itemTitle}>{item.titre}</Text>
                  <Text style={styles.itemSub}>Date : {item.date}</Text>
                  <Text style={styles.itemSub}>Traitement : {item.traitement}</Text>
                  <Text style={styles.itemSub}>Médecin : {item.medecin}</Text>
                  {item.notes ? <Text style={styles.itemSub}>Notes : {item.notes}</Text> : null}

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => onEditPress(item, 'personnels')}
                  >
                    <Text style={styles.editButtonText}>Modifier</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
            <TouchableOpacity style={styles.addButton} onPress={() => onAddPress('personnels')}>
              <Text style={styles.addButtonText}>+ Ajouter un antécédent personnel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Familiaux */}
        <TouchableOpacity onPress={toggleFamiliaux} style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Antécédents Familiaux</Text>
          <Text style={styles.sectionHeaderIcon}>{isFamiliauxOpen ? '-' : '+'}</Text>
        </TouchableOpacity>
        {isFamiliauxOpen && (
          <View style={styles.sectionContent}>
            {familiaux.length === 0 ? (
              <Text style={styles.emptyText}>Aucun antécédent familial.</Text>
            ) : (
              familiaux.map((item) => (
                <View key={item.id} style={styles.antecedentCard}>
                  <Text style={styles.itemTitle}>{item.titre}</Text>
                  <Text style={styles.itemSub}>Membre : {item.membre}</Text>
                  <Text style={styles.itemSub}>
                    Âge d&apos;apparition : {item.age_apparition}
                  </Text>
                  {item.notes ? <Text style={styles.itemSub}>Notes : {item.notes}</Text> : null}

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => onEditPress(item, 'familiaux')}
                  >
                    <Text style={styles.editButtonText}>Modifier</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
            <TouchableOpacity style={styles.addButton} onPress={() => onAddPress('familiaux')}>
              <Text style={styles.addButtonText}>+ Ajouter un antécédent familial</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier l’antécédent</Text>

            {/* Common field: Titre */}
            <TextInput
              style={styles.input}
              placeholder="Titre"
              value={editItem.titre}
              onChangeText={(text) => setEditItem({ ...editItem, titre: text })}
            />

            {/* Personnel fields */}
            {editItem.category === 'personnels' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Date"
                  value={(editItem as AntecedentPersonnel).date}
                  onChangeText={(text) => setEditItem({ ...editItem, date: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Traitement"
                  value={(editItem as AntecedentPersonnel).traitement}
                  onChangeText={(text) => setEditItem({ ...editItem, traitement: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Médecin"
                  value={(editItem as AntecedentPersonnel).medecin}
                  onChangeText={(text) => setEditItem({ ...editItem, medecin: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Notes"
                  value={(editItem as AntecedentPersonnel).notes}
                  onChangeText={(text) => setEditItem({ ...editItem, notes: text })}
                />
              </>
            )}

            {/* Familial fields */}
            {editItem.category === 'familiaux' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Membre de la famille"
                  value={(editItem as AntecedentFamilial).membre}
                  onChangeText={(text) => setEditItem({ ...editItem, membre: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Âge d'apparition"
                  value={(editItem as AntecedentFamilial).age_apparition}
                  onChangeText={(text) =>
                    setEditItem({ ...editItem, age_apparition: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Notes"
                  value={(editItem as AntecedentFamilial).notes}
                  onChangeText={(text) => setEditItem({ ...editItem, notes: text })}
                />
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#b6d379' }]}
                onPress={handleEditSave}
              >
                <Text style={styles.modalButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un nouvel antécédent</Text>

            {/* Personnel fields */}
            {newItem.category === 'personnels' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Titre"
                  value={newItem.titre || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, titre: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Date"
                  value={(newItem as AntecedentPersonnel).date || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, date: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Traitement"
                  value={(newItem as AntecedentPersonnel).traitement || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, traitement: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Médecin"
                  value={(newItem as AntecedentPersonnel).medecin || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, medecin: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Notes"
                  value={(newItem as AntecedentPersonnel).notes || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, notes: text })}
                />
              </>
            )}

            {/* Familial fields */}
            {newItem.category === 'familiaux' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Titre"
                  value={newItem.titre || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, titre: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Membre de la famille"
                  value={(newItem as AntecedentFamilial).membre || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, membre: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Âge d'apparition"
                  value={(newItem as AntecedentFamilial).age_apparition || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, age_apparition: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Notes"
                  value={(newItem as AntecedentFamilial).notes || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, notes: text })}
                />
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#b6d379' }]}
                onPress={handleAddSave}
              >
                <Text style={styles.modalButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sidebar overlay */}
      <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />
    </View>
  );
};

export default MesAntecedents;

// Example color constants
const COLORS = {
  primaryBlue: '#233468',
  secondaryGreen: '#b6d379',
  background: '#FEFEFE',
  lightGrey: '#f0f0f0',
  textDark: '#333',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  menuIcon: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
  },
  homeIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Sora-Medium', // or 'Nunito' if you prefer
  },
  sectionHeader: {
    backgroundColor: COLORS.secondaryGreen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 2,
    borderRadius: 5,
  },
  sectionHeaderText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeaderIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionContent: {
    backgroundColor: COLORS.lightGrey,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  antecedentCard: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: COLORS.primaryBlue,
  },
  itemSub: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 2,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#666',
    marginVertical: 10,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: COLORS.secondaryGreen,
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: COLORS.secondaryGreen,
    padding: 6,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.primaryBlue,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalButtonText: {
    color: '#000',
    fontWeight: '600',
  },
});
