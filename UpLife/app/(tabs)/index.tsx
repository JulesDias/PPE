import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, TouchableWithoutFeedback } from 'react-native';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function App() {
  const [menuVisible, setMenuVisible] = useState(false);
 
  // Fonction pour fermer le menu
  const handleCloseMenu = () => setMenuVisible(false);
  

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

        {/* CARTE (Retirée pour le web) */}
        {Platform.OS !== 'web' && (
          <Section title="📍 URGENCES & PHARMACIES">
            {/* Ajoute ici ta carte si nécessaire */}
            <View style={styles.mapContainer}>
              <Text style={styles.map}>Carte non disponible sur le web</Text>
            </View>
          </Section>
        )}
      </View>

      {/* MENU DÉROULANT */}
      {menuVisible && (
        <TouchableWithoutFeedback onPress={handleCloseMenu}>
          <View style={styles.overlay}>
            <View style={styles.menu}>
              <View style={styles.menuHeader}>
                <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profilePic} />
                <Text style={styles.profileName}> Mon espace </Text>
              </View>
              <MenuItem 
                icon="user-md" 
                label="Mes professionnels de santé"
                onPress={() => {
                  handleCloseMenu(); // Ferme le menu
                  router.push('/MesProDeSante'); // Navigate vers l'écran des professionnels de snate
                }} />
              <MenuItem icon="calendar" label="Mes rendez-vous" />
              <MenuItem icon="medkit" label="Mes traitements" />
              <MenuItem icon="history" label="Mes antécédents" />
              <MenuItem icon="cog" label="Paramètres" />
              <MenuItem icon="sign-out" label="Déconnexion" />
              <MenuItem
                icon="info"
                label="Inscription"
                onPress={() => {
                  handleCloseMenu(); // Ferme le menu
                  router.push('/SignUpScreen'); // Navigate vers l'écran d'inscription
                }}
              />

              <TouchableOpacity style={styles.closeButton} onPress={handleCloseMenu}>
                <FontAwesome name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
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

const MenuItem: React.FC<{
  icon: keyof typeof FontAwesome.glyphMap;
  label: string;
  onPress?: () => void; // Ajoutez cette prop
}> = ({ icon, label, onPress }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress} // Utilisez la prop onPress
  >
    <FontAwesome name={icon} size={20} color="black" />
    <Text style={styles.menuItemText}>{label}</Text>
  </TouchableOpacity>
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

  /* MAP */
  mapContainer: { borderRadius: 10, overflow: 'hidden', height: 200, backgroundColor: '#ddd' },
  map: { width: '100%', height: '100%' },

  /* MENU */
  menu: { position: 'absolute', top: 0, left: 0, width: '80%', height: '100%', backgroundColor: '#93B6D2', padding: 15 },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }, // Couvre toute la vue avec une superposition
  menuHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profilePic: { width: 50, height: 50, borderRadius: 25 },
  profileName: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  menuItemText: { marginLeft: 10, fontSize: 16 },
  closeButton: { position: 'absolute', top: 15, right: 15 },
});
