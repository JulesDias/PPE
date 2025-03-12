import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet, Modal, FlatList } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import Sidebar from '@/components/Sidebar';
import medecinsData from '@/data/medecins.json';
import rdvsData from '@/data/rdvs.json';  // Importation des données des rendez-vous
import { router } from 'expo-router';

export default function MedecinsPage() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [medecins, setMedecins] = useState<{ title: string; data: any[] }[]>([]);
    const [selectedMedecin, setSelectedMedecin] = useState<any>(null);
    const [historiqueRDVs, setHistoriqueRDVs] = useState<any[]>([]);  // État pour l'historique des RDVs

    useEffect(() => {
        // Regrouper les médecins par initiale
        const grouped = medecinsData.reduce((acc, medecin) => {
            const initiale = medecin.Nom.charAt(0).toUpperCase();
            if (!acc[initiale]) {
                acc[initiale] = [];
            }
            acc[initiale].push(medecin);
            return acc;
        }, {} as Record<string, any[]>);

        // Transformer en tableau trié
        const sections = Object.keys(grouped)
            .sort()
            .map(initiale => ({
                title: initiale,
                data: grouped[initiale].sort((a, b) => a.Nom.localeCompare(b.Nom)),
            }));

        setMedecins(sections);
    }, []);

    // Fonction pour afficher les informations du médecin
    const showMedecinDetails = (medecin: any) => {
        setSelectedMedecin(medecin);

        // Filtrer les rendez-vous en fonction de l'ID du médecin sélectionné
        const rdvsMedecin = rdvsData.filter((rdv) => rdv.ID_medecin === medecin.ID_medecin);
        setHistoriqueRDVs(rdvsMedecin);
    };

    // Fonction pour fermer le modal
    const closeModal = () => {
        setSelectedMedecin(null);
    };

    // Vérifier si un rendez-vous est passé
    const isRdvPassed = (dateRdv: string) => {
        const today = new Date();
        const rdvDate = new Date(dateRdv);
        return rdvDate < today;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Entypo name="menu" size={30} color="black" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/')}>
                    <FontAwesome name="home" size={28} color="black" />
                </TouchableOpacity>
            </View>
            <Text style={styles.headerText}>MES PROFESSIONNELS DE SANTÉ</Text>

            {/* Liste des médecins */}
            <SectionList
                style={styles.sectionList}
                sections={medecins}
                keyExtractor={(item, index) => item.Nom + index}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{title}</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.medecinItem} onPress={() => showMedecinDetails(item)}>
                        <Text style={styles.medecinNom}>Dr. {item.Nom}</Text>
                        <Text style={styles.specialite}>{item.Specialite}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Menu latéral */}
            <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />

            {/* Modal pour afficher les détails du médecin */}
            {selectedMedecin && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={!!selectedMedecin}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Détails du médecin</Text>
                            <Text style={styles.modalText}>Nom: {selectedMedecin.Nom}</Text>
                            <Text style={styles.modalText}>Spécialité: {selectedMedecin.Specialite}</Text>
                            <Text style={styles.modalText}>Adresse: {selectedMedecin.Adresse}</Text>

                            {/* Historique des rendez-vous */}
                            <Text style={styles.modalTitle}>Historique des RDV</Text>
                            {historiqueRDVs.length > 0 ? (
                                <FlatList
                                    data={historiqueRDVs}
                                    keyExtractor={(item) => item.ID_medecin + item.Date_rdv}
                                    renderItem={({ item }) => (
                                        <View style={styles.rdvItem}>
                                            <Text style={styles.rdvText}>Date: {item.Date_rdv}</Text>
                                            <Text style={styles.rdvText}>Horaire: {item.Horaire}</Text>
                                            <Text style={styles.rdvText}>Intitulé: {item.Intitule}</Text>
                                            <Text style={styles.rdvText}>
                                                {isRdvPassed(item.Date_rdv) ? 'Ce rendez-vous est passé' : 'Rendez-vous à venir'}
                                            </Text>
                                        </View>
                                    )}
                                />
                            ) : (
                                <Text style={styles.rdvText}>Aucun rendez-vous à afficher</Text>
                            )}

                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: 'white',
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#233468',
        fontFamily: 'Sora-Medium',
        marginBottom: 10,
        marginTop: 10,
    },
    sectionHeader: { backgroundColor: '#93b8d3', padding: 8 },
    sectionHeaderText: { fontSize: 14, fontWeight: 'bold' },
    medecinItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    medecinNom: { fontWeight: 'bold', fontSize: 15 },
    specialite: { fontSize: 14, color: '#555' },
    sectionList: {
        paddingTop: 20, // Décale la liste des médecins sous la barre
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    rdvItem: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginVertical: 5,
        borderRadius: 5,
    },
    rdvText: {
        fontSize: 14,
        color: '#333',
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#233468',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#f0f0f0',
        fontSize: 16,
    },
});
