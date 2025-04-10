import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/fr";
import Sidebar from "@/components/Sidebar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from 'react-native-paper';
import { supabase } from "@/services/supabase";
import DateTimePicker from '@react-native-community/datetimepicker';

interface Traitement {
    ID_traitement: string;
    Nom: string;
    heure: string;
    date_debut: string;
    date_fin?: string;
    Type: string;
    dosage?: string;
}

interface Rappels {
    matin: Traitement[];
    midi: Traitement[];
    soir: Traitement[];
}

const TraitementsScreen = () => {
    const [rappels, setRappels] = useState<Rappels>({ matin: [], midi: [], soir: [] });
    const [menuVisible, setMenuVisible] = useState(false);
    const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentTraitement, setCurrentTraitement] = useState<Partial<Traitement>>({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickerType, setPickerType] = useState<'date_debut' | 'date_fin'>('date_debut');
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        moment.locale("fr");
        loadCheckedItems();
        fetchTraitements();
    }, []);

    const fetchTraitements = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("traitements")
            .select("*")
            .eq("ID_utilisateur", user.id);

        if (error) {
            console.error("Erreur lors de la récupération des traitements:", error);
            return;
        }

        if (data) {
            const rappelsTriés: Rappels = { matin: [], midi: [], soir: [] };
            data.forEach((traitement) => {
                const heure = parseInt(traitement.heure.split(':')[0], 10);
                if (heure < 12) {
                    rappelsTriés.matin.push(traitement);
                } else if (heure < 18) {
                    rappelsTriés.midi.push(traitement);
                } else {
                    rappelsTriés.soir.push(traitement);
                }
            });
            setRappels(rappelsTriés);
        }
    };

    const loadCheckedItems = async () => {
        const today = moment().format("YYYY-MM-DD");
        const storedData = await AsyncStorage.getItem("checkedItems");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.date === today) {
                setCheckedItems(parsedData.items);
            } else {
                setCheckedItems({});
            }
        }
    };

    const handleCheckboxChange = async (id: string) => {
        const updatedCheckedItems = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(updatedCheckedItems);
        await AsyncStorage.setItem(
            "checkedItems",
            JSON.stringify({ date: moment().format("YYYY-MM-DD"), items: updatedCheckedItems })
        );
    };

    const handleAddTraitement = () => {
        setCurrentTraitement({});
        setEditMode(false);
        setModalVisible(true);
    };

    const handleEditTraitement = (traitement: Traitement) => {
        setCurrentTraitement(traitement);
        setEditMode(true);
        setModalVisible(true);
    };

    const handleDeleteTraitement = async (id: string) => {
        Alert.alert(
            "Confirmer la suppression",
            "Voulez-vous vraiment supprimer ce traitement?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const { error } = await supabase
                            .from("traitements")
                            .delete()
                            .eq("ID_traitement", id);

                        if (error) {
                            console.error("Erreur lors de la suppression:", error);
                        } else {
                            fetchTraitements();
                        }
                    },
                },
            ]
        );
    };

    const handleSaveTraitement = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        if (!currentTraitement.Nom || !currentTraitement.date_debut || !currentTraitement.heure || !currentTraitement.Type) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
            return;
        }

        try {
            if (editMode) {
                const { error } = await supabase
                    .from("traitements")
                    .update({
                        Nom: currentTraitement.Nom,
                        Type: currentTraitement.Type,
                        date_debut: currentTraitement.date_debut,
                        date_fin: currentTraitement.date_fin || null,
                        heure: currentTraitement.heure,
                        dosage: currentTraitement.dosage || null,
                    })
                    .eq("ID_traitement", currentTraitement.ID_traitement);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("traitements")
                    .insert({
                        ID_utilisateur: user.id,
                        Nom: currentTraitement.Nom,
                        Type: currentTraitement.Type,
                        date_debut: currentTraitement.date_debut,
                        date_fin: currentTraitement.date_fin || null,
                        heure: currentTraitement.heure,
                        dosage: currentTraitement.dosage || null,
                    });

                if (error) throw error;
            }

            setModalVisible(false);
            fetchTraitements();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            Alert.alert("Erreur", "Une erreur est survenue lors de la sauvegarde");
        }
    };

    const showDatepicker = (type: 'date_debut' | 'date_fin') => {
        setPickerType(type);
        setShowDatePicker(true);
    };

    const showTimepicker = () => {
        setShowTimePicker(true);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const dateStr = moment(selectedDate).format("YYYY-MM-DD");
            setCurrentTraitement({
                ...currentTraitement,
                [pickerType]: dateStr,
            });
        }
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const timeStr = moment(selectedTime).format("HH:mm");
            setCurrentTraitement({
                ...currentTraitement,
                heure: timeStr,
            });
        }
    };

    return (
        <View style={styles.container}>
            {/* Bouton Menu (Gauche), affiché seulement si le menu est fermé */}
            {!menuVisible && (
                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                    <Ionicons name="menu" size={30} color="black" />
                </TouchableOpacity>
            )}

            {/* Bouton Maison (Droite) */}
            <TouchableOpacity onPress={() => router.push("/")} style={styles.homeButton}>
                <Ionicons name="home" size={30} color="black" />
            </TouchableOpacity>

            <Text style={styles.header}>MES TRAITEMENTS</Text>

            <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>RAPPEL - Aujourd'hui, {moment().format("DD MMMM")}</Text>
                <View style={styles.card}>
                    {Object.entries(rappels).map(([periode, items]) => (
                        <View key={periode}>
                            <Text style={styles.bold}>{periode.charAt(0).toUpperCase() + periode.slice(1)} :</Text>
                            {items.length > 0 ? (
                                items.map((t: Traitement) => (
                                    <View key={t.ID_traitement} style={styles.checkboxContainer}>
                                        <Checkbox
                                            status={checkedItems[t.ID_traitement] ? 'checked' : 'unchecked'}
                                            onPress={() => handleCheckboxChange(t.ID_traitement)}
                                        />
                                        <Text> {t.Nom} / {moment(t.heure, "HH:mm").format("HH[h]mm")}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text>Aucun</Text>
                            )}
                        </View>
                    ))}
                </View>
            </View>

            {/* Liste des traitements */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Liste de mes traitements</Text>
                <View style={styles.card}>
                    <FlatList
                        data={[...rappels.matin, ...rappels.midi, ...rappels.soir]}
                        keyExtractor={(item) => item.ID_traitement}
                        renderItem={({ item }) => (
                            <View style={styles.traitementItem}>
                                <View style={styles.traitementHeader}>
                                    <Text style={styles.traitementTitle}>• {item.Nom} - {item.Type}</Text>
                                    <View style={styles.actions}>
                                        <TouchableOpacity onPress={() => handleEditTraitement(item)}>
                                            <Ionicons name="pencil" size={18} color="blue" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDeleteTraitement(item.ID_traitement)}>
                                            <Ionicons name="trash" size={18} color="red" style={styles.deleteIcon} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text>- Début : {moment(item.date_debut).format("DD/MM/YYYY")}</Text>
                                {item.date_fin && <Text>- Fin : {moment(item.date_fin).format("DD/MM/YYYY")}</Text>}
                                {item.dosage && <Text>- Dosage : {item.dosage}</Text>}
                                <Text>- Heure : {moment(item.heure, "HH:mm").format("HH[h]mm")}</Text>
                            </View>
                        )}
                    />
                </View>
            </View>

            {/* Ajouter un traitement */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddTraitement}>
                <Ionicons name="add-circle-outline" size={24} color="black" />
                <Text style={styles.addButtonText}>Ajouter un traitement</Text>
            </TouchableOpacity>

            {/* Modal pour ajouter/modifier un traitement */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editMode ? "Modifier le traitement" : "Ajouter un traitement"}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nom du traitement*"
                            value={currentTraitement.Nom}
                            onChangeText={(text) => setCurrentTraitement({ ...currentTraitement, Nom: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Type* (ex: Comprimé, Injection...)"
                            value={currentTraitement.Type}
                            onChangeText={(text) => setCurrentTraitement({ ...currentTraitement, Type: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Dosage (ex: 500mg, 1 comprimé...)"
                            value={currentTraitement.dosage}
                            onChangeText={(text) => setCurrentTraitement({ ...currentTraitement, dosage: text })}
                        />

                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => showDatepicker('date_debut')}
                        >
                            <Text>
                                {currentTraitement.date_debut
                                    ? moment(currentTraitement.date_debut).format("DD/MM/YYYY")
                                    : "Date de début*"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => showDatepicker('date_fin')}
                        >
                            <Text>
                                {currentTraitement.date_fin
                                    ? moment(currentTraitement.date_fin).format("DD/MM/YYYY")
                                    : "Date de fin (optionnel)"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={showTimepicker}
                        >
                            <Text>
                                {currentTraitement.heure
                                    ? moment(currentTraitement.heure, "HH:mm").format("HH[h]mm")
                                    : "Heure*"}
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}

                        {showTimePicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSaveTraitement}
                            >
                                <Text style={styles.buttonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F5F5", paddingHorizontal: 16, paddingTop: 40 },
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
    header: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    section: { marginBottom: 20 },
    sectionTitle: { fontWeight: "bold", marginBottom: 10 },
    card: { backgroundColor: "#93b8d3", padding: 15, borderRadius: 10, elevation: 3 },
    bold: { fontWeight: "bold", marginTop: 10 },
    checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
    traitementItem: { marginBottom: 10 },
    traitementHeader: { flexDirection: "row", justifyContent: "space-between" },
    traitementTitle: { fontWeight: "bold" },
    actions: { flexDirection: "row" },
    deleteIcon: { marginLeft: 10 },
    addButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 },
    addButtonText: { marginLeft: 5 },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        width: "45%",
        alignItems: "center",
    },
    saveButton: {
        backgroundColor: "#93b8d3",
        padding: 10,
        borderRadius: 5,
        width: "45%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default TraitementsScreen;
