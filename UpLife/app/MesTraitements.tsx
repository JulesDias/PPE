import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/fr";
import Sidebar from "@/components/Sidebar";
import traitementsData from "@/data/traitements.json";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from 'react-native-paper';

interface Traitement {
    id: number;
    nom: string;
    heure: string;
    date_debut: string;
    date_fin?: string;
    type: string;
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

    useEffect(() => {
        moment.locale("fr");
        loadCheckedItems();

        const rappelsTriés: Rappels = { matin: [], midi: [], soir: [] };
        traitementsData.forEach((traitement) => {
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
    }, []);

    const loadCheckedItems = async () => {
        const today = moment().format("YYYY-MM-DD");
        const storedData = await AsyncStorage.getItem("checkedItems");
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.date === today) {
                setCheckedItems(parsedData.items);
            } else {
                setCheckedItems({}); // Réinitialiser si ce n'est plus le même jour
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

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Ionicons name="menu" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>MES TRAITEMENTS</Text>
                <TouchableOpacity onPress={() => router.push("/")}>
                    <Ionicons name="home" size={28} color="black" />
                </TouchableOpacity>
            </View>

            <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>RAPPEL - Aujourd'hui, {moment().format("DD MMMM")}</Text>
                <View style={styles.card}>
                    {Object.entries(rappels).map(([periode, items]) => (
                        <View key={periode}>
                            <Text style={styles.bold}>{periode.charAt(0).toUpperCase() + periode.slice(1)} :</Text>
                            {items.length > 0 ? (
                                items.map((t: Traitement) => (
                                    <View key={t.id} style={styles.checkboxContainer}>
                                        <Checkbox
                                            status={checkedItems[t.id] ? 'checked' : 'unchecked'}
                                            onPress={() => handleCheckboxChange(t.id.toString())}
                                        />
                                        <Text> {t.nom} / {moment(t.heure, "HH:mm").format("HH[h]mm")}</Text>
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
                        data={traitementsData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.traitementItem}>
                                <Text style={styles.traitementTitle}>• {item.nom} - {item.type}</Text>
                                <Text>- Début : {moment(item.date_debut).format("DD/MM/YYYY")}</Text>
                                {item.date_fin && <Text>- Fin : {moment(item.date_fin).format("DD/MM/YYYY")}</Text>}
                            </View>
                        )}
                    />
                </View>
            </View>

            {/* Ajouter un traitement */}
            <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add-circle-outline" size={24} color="black" />
                <Text style={styles.addButtonText}>Ajouter un traitement</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F5F5", paddingHorizontal: 16, paddingTop: 40 },
    navbar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    header: { fontSize: 18, fontWeight: "bold" },
    section: { marginBottom: 20 },
    sectionTitle: { fontWeight: "bold", marginBottom: 10 },
    card: { backgroundColor: "#93b8d3", padding: 15, borderRadius: 10, elevation: 3 },
    bold: { fontWeight: "bold", marginTop: 10 },
    checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
    traitementItem: { marginBottom: 10 },
    traitementTitle: { fontWeight: "bold" },
    addButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 },
    addButtonText: { marginLeft: 5 },
});

export default TraitementsScreen;
