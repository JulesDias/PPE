import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
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

      <View style={styles.content}>
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
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 48.8566,
                  longitude: 2.3522,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                <Marker
                  coordinate={{ latitude: 48.8584, longitude: 2.2945 }}
                  title="Pharmacie Centrale"
                  description="Ouverte 24/7"
                />
                <Marker
                  coordinate={{ latitude: 48.8606, longitude: 2.3376 }}
                  title="Hôpital de Paris"
                  description="Service d'urgences"
                />
              </MapView>
            </View>
          </Section>
        )}
      </View>

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
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#26336A', padding: 15 },
  headerText: { fontSize: 18, fontWeight: 'bold', color: 'white', marginLeft: 10 },
  content: { padding: 15 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#26336A' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  rdvItem: { marginBottom: 8 },
  rdvDate: { fontSize: 14, fontWeight: 'bold', color: 'red' },
  rdvText: { fontSize: 14, color: '#26336A' },
  noEvent: { marginTop: 5, color: '#555' },
  treatmentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  treatmentTime: { fontWeight: 'bold' },
  treatmentLabel: { color: '#0077b6' },
  mapContainer: { borderRadius: 10, overflow: 'hidden', height: 200, backgroundColor: '#ddd' },
  map: { width: '100%', height: '100%' },
});
