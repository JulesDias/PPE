import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, Switch, Image } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import rdvs from '@/data/rdvs.json';
import medecins from '@/data/medecins.json';
import Icon from 'react-native-vector-icons/FontAwesome';

const GestionRDV = () => {
    const [isCalendarView, setIsCalendarView] = useState(false);
    const [selectedRDV, setSelectedRDV] = useState<{ ID_utilisateur: number; ID_medecin: number; Date_rdv: string; Horaire: string; Intitule: string; } | null>(null);
    const [rdvData, setRdvData] = useState<{ ID_utilisateur: number; ID_medecin: number; Date_rdv: string; Horaire: string; Intitule: string; }[]>([]);
    const [rappels, setRappels] = useState([
        { id: 1, text: 'Janvier 2025 - Ophtalmologue - Dr. Dupont', checked: false },
        { id: 2, text: 'Mars 2025 - Dermatologue - Dr. Jules', checked: false }
    ]);

    useEffect(() => {
        const sortedRdvs = rdvs.sort((a, b) => new Date(a.Date_rdv).getTime() - new Date(b.Date_rdv).getTime());
        setRdvData(sortedRdvs);
    }, []);

    const toggleView = () => {
        setIsCalendarView(!isCalendarView);
    };

    const getMedecinName = (id: number) => {
        const medecin = medecins.find(m => m.ID_medecin === id);
        return medecin ? medecin.Nom : 'Inconnu';
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: '#FEFEFE' }}>
            <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'black',
                fontFamily: 'Sora-Medium',
            }}>
                MES RENDEZ-VOUS
            </Text>

            {/* RAPPELS */}
            <View style={{ backgroundColor: '#b6d379', padding: 15, borderRadius: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold', color: 'white' }}>RAPPELS DES RENDEZ-VOUS À PRENDRE</Text>
                {rappels.map((rappel) => (
                    <View key={rappel.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Checkbox
                            status={rappel.checked ? 'checked' : 'unchecked'}
                            onPress={() => {
                                setRappels(rappels.map(item =>
                                    item.id === rappel.id ? { ...item, checked: !item.checked } : item
                                ));
                            }}
                            color="white"
                        />
                        <Text style={{ color: 'white' }}>{rappel.text}</Text>
                    </View>
                ))}
            </View>

            {/* TOGGLE SWITCH AVEC ICÔNES */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon name="list" size={24} color={isCalendarView ? "#999" : "#b6d379"} style={{ marginRight: 10 }} />
                <Switch value={isCalendarView} onValueChange={toggleView} />
                <Icon name="calendar" size={24} color={isCalendarView ? "#b6d379" : "#999"} style={{ marginLeft: 10 }} />
            </View>

            {/* LISTE OU CALENDRIER */}
            <View style={{ backgroundColor: '#b6d379', padding: 15, borderRadius: 10 }}>
                {isCalendarView ? (
                    <Calendar
                        markedDates={rdvData.reduce((acc: { [key: string]: { selected: boolean; marked: boolean; selectedColor: string } }, rdv) => {
                            acc[rdv.Date_rdv] = { selected: true, marked: true, selectedColor: 'blue' };
                            return acc;
                        }, {})}
                        onDayPress={(day: { dateString: string }) => {
                            const rdv = rdvData.find(r => r.Date_rdv === day.dateString);
                            if (rdv) setSelectedRDV(rdv);
                        }}
                    />
                ) : (
                    <FlatList
                        data={rdvData}
                        keyExtractor={(item) => item.Date_rdv}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setSelectedRDV(item)}>
                                <View style={{ padding: 10, marginVertical: 5, backgroundColor: '#b6d379', borderRadius: 5 }}>
                                    <Text style={{ color: 'white' }}>{item.Date_rdv} - {item.Horaire}</Text>
                                    <Text style={{ color: 'white' }}>{item.Intitule} - Dr. {getMedecinName(item.ID_medecin)}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>

            {/* MODAL DETAILS RDV */}
            <Modal visible={!!selectedRDV} transparent={true} animationType='slide'>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.62)' }}>
                    <View style={{ backgroundColor: '#f8f8ff', padding: 20, borderRadius: 10 }}>
                        {selectedRDV && (
                            <>
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Détails du RDV</Text>
                                <Text>Date : {selectedRDV.Date_rdv}</Text>
                                <Text>Heure : {selectedRDV.Horaire}</Text>
                                <Text>Objet : {selectedRDV.Intitule}</Text>
                                <Text>Médecin : Dr. {getMedecinName(selectedRDV.ID_medecin)}</Text>
                                <Button title="Fermer" onPress={() => setSelectedRDV(null)} />
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default GestionRDV;
