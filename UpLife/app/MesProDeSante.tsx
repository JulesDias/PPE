import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SectionList, StyleSheet, Modal, FlatList } from 'react-native';
import { Entypo, FontAwesome, FontAwesome as Icon } from '@expo/vector-icons';
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase';



export default function MedecinsPage() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [medecins, setMedecins] = useState<{ title: string; data: any[] }[]>([]);
    const [selectedMedecin, setSelectedMedecin] = useState<any>(null);
    const [historiqueRDVs, setHistoriqueRDVs] = useState<any[]>([]); 

    const showMedecinDetails = async (medecin: any) => {
        setSelectedMedecin(medecin);
        const { data: rdvsData, error } = await supabase
            .from('rdvs')
            .select('*')
            .eq('ID_medecin', medecin.ID_medecin);
    
        if (!error && rdvsData) {
            setHistoriqueRDVs(rdvsData);
        }
    };
    
    const closeModal = () => {
        setSelectedMedecin(null);
        setHistoriqueRDVs([]);
    };
    
    const isRdvPassed = (dateStr: string) => {
        return new Date(dateStr) < new Date();
    };
    

    useEffect(() => {
        const fetchMedecins = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
    
            if (error || !user) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error?.message);
                return;
            }
    
            try {
                // Récupération des ID_medecin associés à l'utilisateur
                const { data: rdvData, error: rdvError } = await supabase
                    .from('rdvs')
                    .select('ID_medecin')
                    .eq('ID_utilisateur', user.id);
    
                if (rdvError) throw rdvError;
    
                const medecinIds = [...new Set(rdvData.map(r => r.ID_medecin))];
    
                if (medecinIds.length === 0) {
                    setMedecins([]);
                    return;
                }
    
                // Récupération des infos des médecins
                const { data: medecinsData, error: medecinsError } = await supabase
                    .from('medecins')
                    .select('*')
                    .in('ID_medecin', medecinIds);
    
                if (medecinsError) throw medecinsError;
    
                // Tri des médecins par nom
                const sortedMedecins = medecinsData.sort((a, b) =>
                    a.Nom.localeCompare(b.Nom, 'fr', { sensitivity: 'base' })
                );
    
                // Organisation des médecins par spécialité
                const grouped = sortedMedecins.reduce((acc: any, medecin) => {
                    const specialite = medecin.Specialite || 'Autre';
                    const existingGroup = acc.find((group: any) => group.title === specialite);
                    if (existingGroup) {
                        existingGroup.data.push(medecin);
                    } else {
                        acc.push({ title: specialite, data: [medecin] });
                    }
                    return acc;
                }, []);
    
                setMedecins(grouped);
            } catch (err: any) {
                console.error("Erreur lors de la récupération des médecins :", err.message);
            }
        };
    
        fetchMedecins();
    }, []);
    

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
            
            <Text style={styles.pageTitle}>MES PROFESSIONNELS DE SANTÉ</Text>

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
                        <Text style={styles.medecinNom}>Dr. {item.Prenom} {item.Nom}</Text>
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
    container: { padding: 20, backgroundColor: '#fff' , flex:1},
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
    pageTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#233468',
      fontFamily: 'Sora-Medium',
      marginBottom: 5,
      marginTop: 50,
    },
});
