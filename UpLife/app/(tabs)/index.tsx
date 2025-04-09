import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import Sidebar from '../../components/Sidebar';
import rdvs from '@/data/rdvs.json';
import traitements from '@/data/traitements.json'; // Import du fichier JSON des traitements
import { router } from 'expo-router';
import moment from 'moment';
import 'moment/locale/fr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';
import { supabase } from '@/services/supabase';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
      {children}
    </View>
  );
}

export default function HomePage() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [nextAppointments, setNextAppointments] = useState<{ Date_rdv: string; Horaire: string; Intitule: string }[]>([]);
  const [traitementsDuJour, setTraitementsDuJour] = useState<{ matin: any[], midi: any[], soir: any[] }>({ matin: [], midi: [], soir: [] });
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [prenom, setPrenom] = useState<string | null>(null);

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
        const userId = user.id;

        const { data: utilisateurData, error: utilisateurError } = await supabase
          .from("utilisateurs")
          .select("Prenom")
          .eq("id", userId)
          .single();

        if (utilisateurError) {
          console.error("Erreur de récupération du prénom:", utilisateurError.message);
        } else if (utilisateurData) {
          setPrenom(utilisateurData.Prenom);
        }
      }
    };
    fetchUser();
    moment.locale('fr');
    loadCheckedItems();

    // Filtrer les rendez-vous à venir
    const upcomingRdvs = rdvs
      .filter(rdv => new Date(rdv.Date_rdv) >= new Date())
      .sort((a, b) => new Date(a.Date_rdv).getTime() - new Date(b.Date_rdv).getTime())
      .slice(0, 3);

    setNextAppointments(upcomingRdvs);

    // Trier les traitements par heure de prise
    const sortedTraitements: any = { matin: [], midi: [], soir: [] };

    traitements.forEach(traitement => {
      const heure = parseInt(traitement.heure.split(':')[0], 10);
      if (heure < 12) {
        sortedTraitements.matin.push(traitement);
      } else if (heure < 18) {
        sortedTraitements.midi.push(traitement);
      } else {
        sortedTraitements.soir.push(traitement);
      }
    });

    setTraitementsDuJour(sortedTraitements);
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Entypo name="menu" size={50} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Bonjour {prenom} !</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* MES RENDEZ-VOUS */}
        <TouchableOpacity onPress={() => router.push('/RendezVous')} activeOpacity={0.7}>
          <Section title="🗓️ MES RENDEZ-VOUS">
            <View style={styles.card}>
              {nextAppointments.length > 0 ? (
                nextAppointments.map((rdv, index) => (
                  <View key={index} style={styles.rdvItem}>
                    <Text style={styles.rdvDate}>{rdv.Date_rdv} - {rdv.Horaire}</Text>
                    <Text style={styles.rdvText}>{rdv.Intitule}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noEvent}>Aucun événement à venir</Text>
              )}
            </View>
          </Section>
        </TouchableOpacity>

        {/* MES TRAITEMENTS */}
        <Section title="💊 MES TRAITEMENTS">
          <View style={styles.card}>
            <Text style={styles.treatmentTitle}>Rappel - Aujourd’hui, {moment().format('DD MMMM')}</Text>
            {Object.entries(traitementsDuJour).map(([periode, items]) => (
              <View key={periode}>
                <Text style={styles.bold}>{periode.charAt(0).toUpperCase() + periode.slice(1)} :</Text>
                {items.length > 0 ? (
                  items.map((t) => (
                    <View key={t.id} style={styles.checkboxContainer}>
                      <Checkbox
                        status={checkedItems[t.id] ? 'checked' : 'unchecked'}
                        onPress={() => handleCheckboxChange(t.id.toString())}
                      />
                      <Text> {t.nom} / {moment(t.heure, "HH:mm").format("HH[h]mm")}</Text>
                    </View>
                  ))
                ) : <Text>Aucun</Text>}
              </View>
            ))}
          </View>
        </Section>

        {/* URGENCES & PHARMACIES */}
        {Platform.OS !== 'web' && (
          <Section title="📍 URGENCES & PHARMACIES">
            <View style={styles.mapContainer}>
              <WebView
                source={{ uri: 'https://monpharmacien-idf.fr/widget/500' }}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
          </Section>
        )}
      </ScrollView>

      <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#233468', padding: 15 },
  headerText: { fontSize: 22, fontWeight: 'bold', color: 'white', marginLeft: 10 },
  content: { padding: 15 },
  bold: { fontWeight: "bold", marginTop: 10, color: 'white' },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  treatmentTitle: { fontWeight: 'bold', marginBottom: 10, color: 'white' },
  mapContainer: { borderRadius: 10, overflow: 'hidden', height: 350, backgroundColor: '#ddd', marginBottom: 20},
  card: {
    backgroundColor: '#f8c6cd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginTop: 10
  },
  rdvItem: {
    marginBottom: 5
  },
  rdvDate: {
    fontSize: 15,
    color: '#f0f0f0',
    fontWeight: 'bold'

  },
  rdvText: {
    fontSize: 14,
    color: '#f0f0f0'
  },
  noEvent: {
    fontSize: 14,
    color: '#f0f0f0'
  }
});
