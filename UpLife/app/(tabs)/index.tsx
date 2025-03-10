import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';  // Importer WebView
import Sidebar from '../../components/Sidebar';
import rdvs from '@/data/rdvs.json';

export default function HomePage() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [nextAppointments, setNextAppointments] = useState<{ Date_rdv: string; Horaire: string; Intitule: string }[]>([]);

  useEffect(() => {
    const upcomingRdvs = rdvs
      .filter(rdv => new Date(rdv.Date_rdv) >= new Date())
      .sort((a, b) => new Date(a.Date_rdv).getTime() - new Date(b.Date_rdv).getTime())
      .slice(0, 3);

    setNextAppointments(upcomingRdvs);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Entypo name="menu" size={50} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Bonjour Virginie !</Text>
      </View>

      {/* ScrollView pour rendre la page défilable */}
      <ScrollView style={styles.content}>
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

        <Section title="💊 MES TRAITEMENTS">
          <View style={styles.card}>
            <Treatment time="Matin" label="Pilule" />
            <Treatment time="Midi" label="Antibiotique" />
            <Treatment time="Soir" label="-" />
          </View>
        </Section>

        {Platform.OS !== 'web' && (
          <Section title="📍 URGENCES & PHARMACIES">
            <View style={styles.mapContainer}>
              <WebView
                source={{ uri: 'https://monpharmacien-idf.fr/widget/500' }}  // Utilisation de WebView pour afficher l'iframe
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


const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Treatment: React.FC<{ time: string; label: string }> = ({ time, label }) => (
  <View style={styles.treatmentRow}>
    <Text style={styles.treatmentTime}>{time}</Text>
    <Text style={styles.treatmentLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFEFEF' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#b6d379', padding: 15 },
  headerText: { fontSize: 18, fontWeight: 'bold', color: 'white', marginLeft: 10 },
  content: { padding: 15 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#4d7d2f' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  rdvItem: { marginBottom: 8 },
  rdvDate: { fontSize: 14, fontWeight: 'bold', color: 'red' },
  rdvText: { fontSize: 14, color: '#26336A' },
  noEvent: { marginTop: 5, color: '#555' },
  treatmentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  treatmentTime: { fontWeight: 'bold' },
  treatmentLabel: { color: '#0077b6' },
  mapContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    height: 350,  // Ajuste la hauteur selon tes besoins
    backgroundColor: '#ddd',
    marginBottom: 20, // Un peu d'espace sous le widget
  },
});

