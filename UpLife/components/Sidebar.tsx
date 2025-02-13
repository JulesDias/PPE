import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

interface SidebarProps {
  menuVisible: boolean;
  closeMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuVisible, closeMenu }) => {
  if (!menuVisible) return null;

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={styles.overlay}>
        <View style={styles.menu}>
          <View style={styles.menuHeader}>
            <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profilePic} />
            <Text style={styles.profileName}> Mon espace </Text>
          </View>

          <MenuItem icon="user-md" label="Mes professionnels de santé" />
          <MenuItem icon="calendar" label="Mes rendez-vous" />
          <MenuItem icon="medkit" label="Mes traitements" />
          <MenuItem icon="history" label="Mes antécédents" />
          <MenuItem icon="cog" label="Paramètres" />
          <MenuItem icon="sign-out" label="Déconnexion" />
          <MenuItem
            icon="info"
            label="Inscription"
            onPress={() => {
              closeMenu();
              router.push('/SignUpScreen');
            }}
          />

          <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
            <FontAwesome name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const MenuItem: React.FC<{ icon: keyof typeof FontAwesome.glyphMap; label: string; onPress?: () => void }> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <FontAwesome name={icon} size={20} color="black" />
    <Text style={styles.menuItemText}>{label}</Text>
  </TouchableOpacity>
);

/* Styles */
const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  menu: { position: 'absolute', top: 0, left: 0, width: '80%', height: '100%', backgroundColor: '#93B6D2', padding: 15 },
  menuHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profilePic: { width: 50, height: 50, borderRadius: 25 },
  profileName: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  menuItemText: { marginLeft: 10, fontSize: 16 },
  closeButton: { position: 'absolute', top: 15, right: 15 },
});

export default Sidebar;
