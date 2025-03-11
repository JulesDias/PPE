import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';

interface SidebarProps {
  menuVisible: boolean;
  closeMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuVisible, closeMenu }) => {
  if (!menuVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.menu}>

        {/* HEADER SECTION */}
        <View style={styles.header}>
          <TouchableOpacity>
            <FontAwesome name="gear" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={closeMenu}>
            <Entypo name="cross" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* PROFILE SECTION */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profilePic} />
          <Text style={styles.profileName}>Virginie</Text>
        </View>

        {/* NOTIFICATIONS */}
        <View style={styles.notificationBox}>
          <Text style={styles.notificationText}>NOTIFICATIONS</Text>
        </View>

        {/* MA SANTÉ SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome name="heart" size={18} color="black" /> Ma Santé
          </Text>
          <MenuItem label="MON PROFIL" onPress={() => router.push('/UserProfile')} />
          <MenuItem label="MES PROFESSIONNELS DE SANTÉ" />
          <MenuItem label="MES RENDEZ-VOUS" onPress={() => router.push('/RendezVous')} />
          <MenuItem label="MES TRAITEMENTS" />
          <MenuItem label="MES ANTÉCÉDENTS" />
        </View>

        {/* INFORMATIONS & PRÉVENTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome name="info-circle" size={18} color="black" /> Informations et Prévention
          </Text>
          <MenuItem label="PLAN PHARMACIES & URGENCES" />
          <MenuItem label="LA VACCINATION" />
          <MenuItem label="PRÉVENTION & DÉPISTAGES" />
          <MenuItem label="SITES & INFORMATIONS UTILES" />
        </View>

        {/* SOCIAL & LEGAL (NOW SIDE-BY-SIDE) */}
        <View style={styles.footer}>
          {/* SOCIAL ICONS */}
          <View style={styles.socialIcons}>
            <FontAwesome name="linkedin" size={24} color="black" style={styles.icon} />
            <FontAwesome name="instagram" size={24} color="black" style={styles.icon} />
            <FontAwesome name="twitter" size={24} color="black" style={styles.icon} />
          </View>

          {/* LEGAL MENTION */}
          <Text style={styles.legalText}>Mentions légales</Text>
        </View>

      </View>
    </View>
  );
};

const MenuItem: React.FC<{ label: string; onPress?: () => void }> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuItemText}>{label}</Text>
    <FontAwesome name="chevron-right" size={18} color="black" />
  </TouchableOpacity>
);

/* Styles */
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menu: {
    width: '80%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  notificationBox: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  notificationText: {
    fontSize: 14,
    color: '#555',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 10,
  },
  legalText: {
    fontSize: 12,
    color: '#555',
  },
});

export default Sidebar;
