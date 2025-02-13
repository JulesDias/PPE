import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Sidebar from '../../components/Sidebar';

export default function HomePage() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Entypo name="menu" size={50} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Bonjour Virginie ! </Text>
      </View>

      {/* CONTENU PRINCIPAL */}
      <View style={styles.content}>
        <Section title="🗓️ MES RENDEZ-VOUS">
          <View style={styles.card}>
            <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
            <Text style={styles.noEvent}>Aucun événement</Text>
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
              <Text style={styles.map}>Carte non disponible sur le web</Text>
            </View>
          </Section>
        )}
      </View>

      {/* SIDEBAR MENU */}
      <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />
    </View>
  );
}

/* Composants */
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

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFEFEF' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#26336A', padding: 15 },
  headerText: { fontSize: 18, fontWeight: 'bold', color: 'white', marginLeft: 10 },
  content: { padding: 15 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#26336A' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  date: { fontSize: 20, fontWeight: 'bold', color: 'red' },
  noEvent: { marginTop: 5, color: '#555' },
  treatmentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  treatmentTime: { fontWeight: 'bold' },
  treatmentLabel: { color: '#0077b6' },
  mapContainer: { borderRadius: 10, overflow: 'hidden', height: 200, backgroundColor: '#ddd' },
  map: { width: '100%', height: '100%' },
});
