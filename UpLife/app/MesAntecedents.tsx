import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase';

interface AntecedentPersonnel {
  id: string;
  titre: string;
  date: string;
  traitement: string;
  medecin: string;
  notes: string;
}

interface AntecedentFamilial {
  id: string;
  titre: string;
  membre: string;
  age_apparition: string;
  notes: string;
}

const MesAntecedents: React.FC = () => {
  const [personnels, setPersonnels] = useState<AntecedentPersonnel[]>([]);
  const [familiaux, setFamiliaux] = useState<AntecedentFamilial[]>([]);
  const [isPersonnelsOpen, setIsPersonnelsOpen] = useState<boolean>(true);
  const [isFamiliauxOpen, setIsFamiliauxOpen] = useState<boolean>(true);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [addModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const [editItem, setEditItem] = useState<
    Partial<AntecedentPersonnel | AntecedentFamilial> & { category?: 'personnels' | 'familiaux'; id?: string }
  >({});

  const [newItem, setNewItem] = useState<
    Partial<AntecedentPersonnel | AntecedentFamilial> & { category?: 'personnels' | 'familiaux' }
  >({});

  useEffect(() => {
    fetchAntecedents();
  }, []);

  const getCurrentUserId = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Erreur de récupération de l'utilisateur:", error.message);
        throw error;
      }

      if (!user) {
        console.error("Aucun utilisateur connecté");
        throw new Error("Aucun utilisateur connecté");
      }

      return user.id;
    } catch (error) {
      console.error("Erreur dans getCurrentUserId:", error instanceof Error ? error.message : error);
      Alert.alert('Erreur', 'Impossible de récupérer votre identifiant.');
      throw error;
    }
  };

  const fetchAntecedents = async () => {
    setLoading(true);
    try {
      const userId = await getCurrentUserId();

      let { data: personnelsData, error: personnelsError } = await supabase
        .from('antecedents')
        .select('*')
        .eq('ID_utilisateur', userId);

      if (personnelsError) {
        console.error('Error fetching personal antecedents:', personnelsError);
        throw personnelsError;
      }

      let formattedPersonnels: AntecedentPersonnel[] = [];
      if (personnelsData && personnelsData.length > 0) {
        formattedPersonnels = personnelsData.map((item) => ({
          id: item.ID_antecedent,
          titre: item.Nom || '',
          date: item.date || '',
          traitement: item.traitement || '',
          medecin: item.medecins || '',
          notes: item.note || ''
        }));
      }

      let { data: familiauxData, error: familiauxError } = await supabase
        .from('antecedents_familiaux')
        .select('*')
        .eq('ID_utilisateur', userId);

      if (familiauxError) {
        console.error('Error fetching family antecedents:', familiauxError);
        throw familiauxError;
      }

      let formattedFamiliaux: AntecedentFamilial[] = [];
      if (familiauxData && familiauxData.length > 0) {
        formattedFamiliaux = familiauxData.map((item) => ({
          id: item.ID_antecedentsFam,
          titre: item.Nom || '',
          membre: item.membre || '',
          age_apparition: item.Age_Apparition || '',
          notes: item.Note || ''
        }));
      }

      setPersonnels(formattedPersonnels);
      setFamiliaux(formattedFamiliaux);
    } catch (error) {
      console.error('Error in fetchAntecedents:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les antécédents.');
    } finally {
      setLoading(false);
    }
  };

  const isValidYear = (year: string) => {
    const currentYear = new Date().getFullYear();
    const yearNumber = parseInt(year, 10);
    return !isNaN(yearNumber) && yearNumber >= 1900 && yearNumber <= currentYear;
  };

  const savePersonnelToDatabase = async (antecedent: AntecedentPersonnel) => {
    try {
      const userId = await getCurrentUserId();

      if (!isValidYear(antecedent.date)) {
        Alert.alert('Erreur', 'L\'année doit être comprise entre 1900 et l\'année en cours.');
        return false;
      }

      const result = await supabase
        .from('antecedents')
        .insert({
          ID_utilisateur: userId,
          Nom: antecedent.titre,
          date: antecedent.date,
          traitement: antecedent.traitement,
          medecins: antecedent.medecin,
          note: antecedent.notes
        });

      if (result.error) {
        console.error('Error saving personal antecedent:', result.error);
        Alert.alert('Erreur', 'Impossible d\'enregistrer l\'antécédent personnel.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Exception in savePersonnelToDatabase:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'enregistrement.');
      return false;
    }
  };

  const saveFamilialToDatabase = async (antecedent: AntecedentFamilial) => {
    try {
      const userId = await getCurrentUserId();

      const result = await supabase
        .from('antecedents_familiaux')
        .insert({
          ID_utilisateur: userId,
          Nom: antecedent.titre,
          membre: antecedent.membre,
          Age_Apparition: antecedent.age_apparition,
          Note: antecedent.notes
        });

      if (result.error) {
        console.error('Error saving familial antecedent:', result.error);
        Alert.alert('Erreur', 'Impossible d\'enregistrer l\'antécédent familial.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Exception in saveFamilialToDatabase:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'enregistrement.');
      return false;
    }
  };

  const deleteAntecedent = async (category: 'personnels' | 'familiaux', id: string) => {
    try {
      const userId = await getCurrentUserId();
      let table = category === 'personnels' ? 'antecedents' : 'antecedents_familiaux';
      let idColumn = category === 'personnels' ? 'ID_antecedent' : 'ID_antecedentsFam';

      const { error } = await supabase
        .from(table)
        .delete()
        .eq(idColumn, id)
        .eq('ID_utilisateur', userId);

      if (error) {
        console.error('Error deleting antecedent:', error);
        Alert.alert('Erreur', 'Impossible de supprimer l\'antécédent.');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Exception in deleteAntecedent:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la suppression.');
      return false;
    }
  };

  const togglePersonnels = () => setIsPersonnelsOpen(!isPersonnelsOpen);
  const toggleFamiliaux = () => setIsFamiliauxOpen(!isFamiliauxOpen);

  const onEditPress = (
    item: AntecedentPersonnel | AntecedentFamilial,
    category: 'personnels' | 'familiaux'
  ) => {
    setEditItem({ ...item, category });
    setEditModalVisible(true);
  };

  const handleEditSave = async () => {
    try {
      const category = editItem.category;
      if (!category || !editItem.id) {
        setEditModalVisible(false);
        return;
      }

      if (category === 'personnels') {
        const antecedent = {
          id: editItem.id,
          titre: editItem.titre || '',
          date: (editItem as AntecedentPersonnel).date || '',
          traitement: (editItem as AntecedentPersonnel).traitement || '',
          medecin: (editItem as AntecedentPersonnel).medecin || '',
          notes: (editItem as AntecedentPersonnel).notes || ''
        };

        if (!isValidYear(antecedent.date)) {
          Alert.alert('Erreur', 'L\'année doit être comprise entre 1900 et l\'année en cours.');
          return;
        }

        const result = await supabase
          .from('antecedents')
          .update({
            Nom: antecedent.titre,
            date: antecedent.date,
            traitement: antecedent.traitement,
            medecins: antecedent.medecin,
            note: antecedent.notes
          })
          .eq('ID_antecedent', antecedent.id);

        if (result.error) {
          console.error('Error updating personal antecedent:', result.error);
          Alert.alert('Erreur', 'Impossible de mettre à jour l\'antécédent personnel.');
          return;
        }
      } else {
        const antecedent = {
          id: editItem.id,
          titre: editItem.titre || '',
          membre: (editItem as AntecedentFamilial).membre || '',
          age_apparition: (editItem as AntecedentFamilial).age_apparition || '',
          notes: (editItem as AntecedentFamilial).notes || ''
        };

        const result = await supabase
          .from('antecedents_familiaux')
          .update({
            Nom: antecedent.titre,
            membre: antecedent.membre,
            Age_Apparition: antecedent.age_apparition,
            Note: antecedent.notes
          })
          .eq('ID_antecedentsFam', antecedent.id);

        if (result.error) {
          console.error('Error updating familial antecedent:', result.error);
          Alert.alert('Erreur', 'Impossible de mettre à jour l\'antécédent familial.');
          return;
        }
      }

      await fetchAntecedents();
      setEditModalVisible(false);
      setEditItem({});
    } catch (error) {
      console.error('Error in handleEditSave:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la modification.');
    }
  };

  const onAddPress = (category: 'personnels' | 'familiaux') => {
    setNewItem({ category });
    setAddModalVisible(true);
  };

  const handleAddSave = async () => {
    try {
      const category = newItem.category;
      if (!category) {
        setAddModalVisible(false);
        return;
      }

      if (category === 'personnels') {
        const antecedent: AntecedentPersonnel = {
          id: '', // Will be generated by the database
          titre: newItem.titre || '',
          date: (newItem as AntecedentPersonnel).date || '',
          traitement: (newItem as AntecedentPersonnel).traitement || '',
          medecin: (newItem as AntecedentPersonnel).medecin || '',
          notes: (newItem as AntecedentPersonnel).notes || ''
        };

        if (!isValidYear(antecedent.date)) {
          Alert.alert('Erreur', 'L\'année doit être comprise entre 1900 et l\'année en cours.');
          return;
        }

        const success = await savePersonnelToDatabase(antecedent);
        if (success) {
          await fetchAntecedents();
          setAddModalVisible(false);
          setNewItem({});
        }
      } else {
        const antecedent: AntecedentFamilial = {
          id: '', // Will be generated by the database
          titre: newItem.titre || '',
          membre: (newItem as AntecedentFamilial).membre || '',
          age_apparition: (newItem as AntecedentFamilial).age_apparition || '',
          notes: (newItem as AntecedentFamilial).notes || ''
        };

        const success = await saveFamilialToDatabase(antecedent);
        if (success) {
          await fetchAntecedents();
          setAddModalVisible(false);
          setNewItem({});
        }
      }
    } catch (error) {
      console.error('Error in handleAddSave:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'ajout.');
    }
  };

  const handleDelete = async (category: 'personnels' | 'familiaux', id: string) => {
    const success = await deleteAntecedent(category, id);
    if (success) {
      await fetchAntecedents();
    }
  };

  return (
    <View style={styles.container}>
      {!menuVisible && (
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuIcon}>
          <Icon name="bars" size={30} color="black" />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.homeIcon}>
        <Icon name="home" size={30} color="black" />
      </TouchableOpacity>
      <Text style={styles.pageTitle}>MES ANTÉCÉDENTS</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.secondaryBlue} />
          <Text style={styles.loadingText}>Chargement des antécédents...</Text>
        </View>
      ) : (
        <ScrollView style={{ marginTop: 20 }}>
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
                    <TouchableOpacity
                      style={[styles.editButton, { backgroundColor: 'red' }]}
                      onPress={() => handleDelete('personnels', item.id)}
                    >
                      <Text style={styles.editButtonText}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
              <TouchableOpacity style={styles.addButton} onPress={() => onAddPress('personnels')}>
                <Text style={styles.addButtonText}>+ Ajouter un antécédent personnel</Text>
              </TouchableOpacity>
            </View>
          )}
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
                    <TouchableOpacity
                      style={[styles.editButton, { backgroundColor: 'red' }]}
                      onPress={() => handleDelete('familiaux', item.id)}
                    >
                      <Text style={styles.editButtonText}>Supprimer</Text>
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
      )}

      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier l'antécédent</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre"
              value={editItem.titre}
              onChangeText={(text) => setEditItem({ ...editItem, titre: text })}
            />
            {editItem.category === 'personnels' && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Année (AAAA)"
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

      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un nouvel antécédent</Text>
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
                  placeholder="Année (AAAA)"
                  value={(newItem as AntecedentPersonnel).date || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, date: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Traitement"
                  placeholderTextColor={'grey'}
                  value={(newItem as AntecedentPersonnel).traitement || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, traitement: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Médecin"
                  placeholderTextColor={'grey'}
                  value={(newItem as AntecedentPersonnel).medecin || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, medecin: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Notes"
                  placeholderTextColor={'grey'}
                  value={(newItem as AntecedentPersonnel).notes || ''}
                  onChangeText={(text) => setNewItem({ ...newItem, notes: text })}
                />
              </>
            )}
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

      <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />
    </View>
  );
};

export default MesAntecedents;

const COLORS = {
  primaryBlue: '#233468',
  secondaryBlue: '#93b8d3',
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#233468',
    fontFamily: 'Sora-Medium',
    marginTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textDark,
  },
  sectionHeader: {
    backgroundColor: COLORS.secondaryBlue,
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
    backgroundColor: '#ccc',
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
    backgroundColor: COLORS.secondaryBlue,
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
    backgroundColor: COLORS.secondaryBlue,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    color: COLORS.textDark,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
