import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, StyleSheet, Switch, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/fr';

interface RDV {
    ID_utilisateur: string;
    ID_medecin: string;
    Date_rdv: string;
    Horaire: string;
    Intitule: string;
    medecin_nom?: string;
    medecin_prenom?: string;
    medecin_specialite?: string;
}

interface Medecin {
    ID_medecin: string;
    Nom: string;
    Prenom?: string;
    Specialite: string;
}

const GestionRDV = () => {
    const [isCalendarView, setIsCalendarView] = useState(false);
    const [selectedRDV, setSelectedRDV] = useState<RDV | null>(null);
    const [rdvData, setRdvData] = useState<RDV[]>([]);
    const [medecins, setMedecins] = useState<Medecin[]>([]);
    const [rappels, setRappels] = useState<{ id: number, text: string, checked: boolean }[]>([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentRDV, setCurrentRDV] = useState<Partial<RDV>>({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [medecinsLoaded, setMedecinsLoaded] = useState(false); // État pour suivre le chargement des médecins

    useEffect(() => {
        const fetchData = async () => {
            await fetchMedecins();
            fetchRDVs();
        };

        fetchData();
    }, []);

    const fetchRDVs = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("rdvs")
            .select(`*, medecins(Nom, Prenom, Specialite)`)
            .eq("ID_utilisateur", user.id);

        if (error) {
            console.error("Erreur lors de la récupération des RDVs:", error);
            return;
        }

        if (data) {
            const formattedData = data.map(rdv => ({
                ...rdv,
                medecin_nom: rdv.medecins?.Nom,
                medecin_prenom: rdv.medecins?.Prenom,
                medecin_specialite: rdv.medecins?.Specialite
            }));
            setRdvData(formattedData);

            const upcomingRdvs = formattedData
                .filter(rdv => new Date(rdv.Date_rdv) > new Date())
                .map((rdv, index) => ({
                    id: index,
                    text: `${moment(rdv.Date_rdv).format('MMMM YYYY')} - ${rdv.medecin_specialite} - ${getMedecinName(rdv.ID_medecin)}`,
                    checked: false
                }));
            setRappels(upcomingRdvs);
        }
    };

    const fetchMedecins = async () => {
        const { data, error } = await supabase
            .from("medecins")
            .select("*");

        if (error) {
            console.error("Erreur lors de la récupération des médecins:", error);
            return;
        }

        if (data) {
            setMedecins(data);
            setMedecinsLoaded(true); // Marquer les médecins comme chargés
        }
    };

    const getMedecinName = (id: string) => {
        const medecin = medecins.find(m => m.ID_medecin === id);
        return medecin ? `Dr ${medecin.Prenom || ''} ${medecin.Nom}`.trim() : 'Inconnu';
    };

    const getMedecinSpecialite = (id: string) => {
        const medecin = medecins.find(m => m.ID_medecin === id);
        return medecin ? medecin.Specialite : 'Inconnue';
    };

    const toggleView = () => {
        setIsCalendarView(!isCalendarView);
    };

    const handleAddRDV = () => {
        setCurrentRDV({});
        setEditMode(false);
        setModalVisible(true);
    };

    const handleEditRDV = (rdv: RDV) => {
        setCurrentRDV(rdv);
        setEditMode(true);
        setModalVisible(true);
    };

    const handleDeleteRDV = async () => {
        if (!selectedRDV) return;

        Alert.alert(
            "Confirmer la suppression",
            "Voulez-vous vraiment supprimer ce rendez-vous?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const { error } = await supabase
                            .from("rdvs")
                            .delete()
                            .eq("ID_utilisateur", selectedRDV.ID_utilisateur)
                            .eq("ID_medecin", selectedRDV.ID_medecin)
                            .eq("Date_rdv", selectedRDV.Date_rdv);

                        if (error) {
                            console.error("Erreur lors de la suppression:", error);
                        } else {
                            fetchRDVs();
                            setSelectedRDV(null);
                        }
                    },
                },
            ]
        );
    };

    const handleSaveRDV = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (!currentRDV.ID_medecin || !currentRDV.Date_rdv || !currentRDV.Horaire || !currentRDV.Intitule) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
            return;
        }

        try {
            if (editMode && selectedRDV) {
                await supabase
                    .from("rdvs")
                    .delete()
                    .eq("ID_utilisateur", selectedRDV.ID_utilisateur)
                    .eq("ID_medecin", selectedRDV.ID_medecin)
                    .eq("Date_rdv", selectedRDV.Date_rdv);

                const { error } = await supabase
                    .from("rdvs")
                    .insert({
                        ID_utilisateur: user.id,
                        ID_medecin: currentRDV.ID_medecin,
                        Date_rdv: currentRDV.Date_rdv,
                        Horaire: currentRDV.Horaire,
                        Intitule: currentRDV.Intitule
                    });

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("rdvs")
                    .insert({
                        ID_utilisateur: user.id,
                        ID_medecin: currentRDV.ID_medecin,
                        Date_rdv: currentRDV.Date_rdv,
                        Horaire: currentRDV.Horaire,
                        Intitule: currentRDV.Intitule
                    });

                if (error) throw error;
            }

            setModalVisible(false);
            fetchRDVs();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            Alert.alert("Erreur", "Une erreur est survenue lors de la sauvegarde");
        }
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const showTimepicker = () => {
        setShowTimePicker(true);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const dateStr = moment(selectedDate).format("YYYY-MM-DD");
            setCurrentRDV({
                ...currentRDV,
                Date_rdv: dateStr,
            });
        }
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const timeStr = moment(selectedTime).format("HH:mm");
            setCurrentRDV({
                ...currentRDV,
                Horaire: timeStr,
            });
        }
    };

    return (
        <View style={styles.container}>
            {!menuVisible && (
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                    <Icon name="bars" size={30} color="black" />
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.homeButton}>
                <Icon name="home" size={30} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>MES RENDEZ-VOUS</Text>

            {medecinsLoaded ? ( // Conditionner l'affichage des rappels et des RDVs
                <>
                    <View style={styles.rappelsContainer}>
                        <Text style={styles.rappelsTitle}>RAPPELS DES RENDEZ-VOUS À PRENDRE</Text>
                        {rappels.map((rappel) => (
                            <View key={rappel.id} style={styles.rappelItem}>
                                <Checkbox
                                    status={rappel.checked ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setRappels(rappels.map(item =>
                                            item.id === rappel.id ? { ...item, checked: !item.checked } : item
                                        ));
                                    }}
                                    color="white"
                                />
                                <Text style={styles.rappelText}>{rappel.text}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.toggleContainer}>
                        <Icon name="list" size={24} color={isCalendarView ? "#999" : "#233468"} style={styles.toggleIcon} />
                        <Switch
                            value={isCalendarView}
                            onValueChange={toggleView}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isCalendarView ? "#233468" : "#f4f3f4"}
                        />
                        <Icon name="calendar" size={24} color={isCalendarView ? "#233468" : "#999"} style={styles.toggleIcon} />
                    </View>

                    <View style={styles.rdvContainer}>
                        {isCalendarView ? (
                            <Calendar
                                markedDates={rdvData.reduce((acc: { [key: string]: { selected: boolean; marked: boolean; selectedColor: string } }, rdv) => {
                                    acc[rdv.Date_rdv] = { selected: true, marked: true, selectedColor: 'white' };
                                    return acc;
                                }, {})}
                                onDayPress={(day: { dateString: string }) => {
                                    const rdv = rdvData.find(r => r.Date_rdv === day.dateString);
                                    if (rdv) setSelectedRDV(rdv);
                                }}
                                theme={{
                                    backgroundColor: '#233468',
                                    calendarBackground: '#233468',
                                    textSectionTitleColor: '#fff',
                                    selectedDayBackgroundColor: '#fff',
                                    selectedDayTextColor: '#233468',
                                    todayTextColor: '#fff',
                                    dayTextColor: '#fff',
                                    textDisabledColor: '#666',
                                    arrowColor: '#fff',
                                    monthTextColor: '#fff',
                                    indicatorColor: '#fff',
                                }}
                            />
                        ) : (
                            <FlatList
                                data={rdvData}
                                keyExtractor={(item) => `${item.ID_medecin}-${item.Date_rdv}-${item.Horaire}`}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => setSelectedRDV(item)}>
                                        <View style={styles.rdvItem}>
                                            <Text style={styles.rdvText}>{moment(item.Date_rdv).format('DD/MM/YYYY')} - {item.Horaire}</Text>
                                            <Text style={styles.rdvText}>{item.Intitule} - {getMedecinName(item.ID_medecin)} ({getMedecinSpecialite(item.ID_medecin)})</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </View>
                </>
            ) : (
                <Text>Chargement des médecins...</Text>
            )}

            <TouchableOpacity style={styles.addButton} onPress={handleAddRDV}>
                <Icon name="plus" size={20} color="white" />
                <Text style={styles.addButtonText}>Ajouter un RDV</Text>
            </TouchableOpacity>

            <Modal visible={!!selectedRDV} transparent={true} animationType='slide'>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedRDV && (
                            <>
                                <Text style={styles.modalTitle}>Détails du RDV</Text>
                                <Text style={styles.modalText}>Date : {moment(selectedRDV.Date_rdv).format('DD/MM/YYYY')}</Text>
                                <Text style={styles.modalText}>Heure : {selectedRDV.Horaire}</Text>
                                <Text style={styles.modalText}>Objet : {selectedRDV.Intitule}</Text>
                                <Text style={styles.modalText}>Médecin : {getMedecinName(selectedRDV.ID_medecin)} ({getMedecinSpecialite(selectedRDV.ID_medecin)})</Text>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity style={styles.editButton} onPress={() => {
                                        setSelectedRDV(null);
                                        handleEditRDV(selectedRDV);
                                    }}>
                                        <Text style={styles.buttonText}>Modifier</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRDV}>
                                        <Text style={styles.buttonText}>Supprimer</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedRDV(null)}>
                                        <Text style={styles.buttonText}>Fermer</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

            <Modal visible={modalVisible} transparent={true} animationType='slide'>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalFormContent}>
                        <Text style={styles.modalTitle}>{editMode ? "Modifier le RDV" : "Ajouter un RDV"}</Text>

                        <Text style={styles.label}>Médecin*</Text>
                        <View style={styles.pickerContainer}>
                            {medecins.length > 0 ? (
                                <ScrollView style={styles.pickerScroll} nestedScrollEnabled={true}>
                                    {medecins.map(medecin => (
                                        <TouchableOpacity
                                            key={medecin.ID_medecin}
                                            style={[
                                                styles.medecinOption,
                                                currentRDV.ID_medecin === medecin.ID_medecin && styles.selectedMedecin
                                            ]}
                                            onPress={() => setCurrentRDV({ ...currentRDV, ID_medecin: medecin.ID_medecin })}
                                        >
                                            <Text style={styles.medecinText}>{getMedecinName(medecin.ID_medecin)} ({medecin.Specialite})</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <Text>Chargement des médecins...</Text>
                            )}
                        </View>

                        <Text style={styles.label}>Intitulé*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Consultation annuelle"
                            value={currentRDV.Intitule}
                            onChangeText={(text) => setCurrentRDV({ ...currentRDV, Intitule: text })}
                        />

                        <Text style={styles.label}>Date*</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={showDatepicker}>
                            <Text>
                                {currentRDV.Date_rdv
                                    ? moment(currentRDV.Date_rdv).format("DD/MM/YYYY")
                                    : "Sélectionner une date"}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Heure*</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={showTimepicker}>
                            <Text>
                                {currentRDV.Horaire
                                    ? currentRDV.Horaire
                                    : "Sélectionner une heure"}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={currentRDV.Date_rdv ? new Date(currentRDV.Date_rdv) : new Date()}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                minimumDate={new Date()}
                            />
                        )}

                        {showTimePicker && (
                            <DateTimePicker
                                value={currentRDV.Horaire ? new Date(`1970-01-01T${currentRDV.Horaire}`) : new Date()}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}

                        <View style={styles.formButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveRDV}>
                                <Text style={styles.buttonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FEFEFE',
    },
    menuButton: {
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 10,
    },
    homeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
        marginTop: 40,
        marginBottom: 10,
    },
    rappelsContainer: {
        backgroundColor: '#233468',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 20,
    },
    rappelsTitle: {
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    rappelItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    rappelText: {
        color: 'white',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    toggleIcon: {
        marginHorizontal: 10,
    },
    rdvContainer: {
        backgroundColor: '#233468',
        padding: 15,
        borderRadius: 10,
        flex: 1,
    },
    rdvItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#2d3d7a',
        borderRadius: 5,
    },
    rdvText: {
        color: 'white',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#233468',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
    },
    addButtonText: {
        color: 'white',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#f8f8ff',
        padding: 20,
        borderRadius: 10,
    },
    modalFormContent: {
        width: '90%',
        backgroundColor: '#f8f8ff',
        padding: 20,
        borderRadius: 10,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        flexWrap: 'wrap',
    },
    editButton: {
        backgroundColor: '#4a8fe7',
        padding: 10,
        borderRadius: 5,
        width: '30%',
        alignItems: 'center',
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 5,
        width: '30%',
        alignItems: 'center',
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#95a5a6',
        padding: 10,
        borderRadius: 5,
        width: '30%',
        alignItems: 'center',
        marginBottom: 10,
    },
    formButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#95a5a6',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#233468',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    pickerContainer: {
        marginBottom: 10,
        maxHeight: 200,
    },
    pickerScroll: {
        maxHeight: 150,
    },
    picker: {
        maxHeight: 150,
        overflow: 'hidden',
    },
    medecinOption: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 5,
    },
    selectedMedecin: {
        backgroundColor: '#e6f7ff',
        borderColor: '#1890ff',
    },
    medecinText: {
        fontSize: 14,
    },
});

export default GestionRDV;
