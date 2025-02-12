// components/Sidebar.jsx
import React from 'react';
import { View, TouchableOpacity, Text, Modal, Animated, StyleSheet } from 'react-native';
import SidebarItem from './sidebarItem';

const Sidebar = ({ menuVisible, toggleMenu, slideAnimation, navigate }) => {
  return (
    <Modal visible={menuVisible} transparent={true} animationType="none">
      <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnimation }] }]}>
        <TouchableOpacity style={styles.closeMenu} onPress={toggleMenu}>
          <Text style={styles.closeText}>X</Text>
        </TouchableOpacity>

        <View style={styles.menuContent}>
          <Text style={styles.menuHeader}>Paul Rouxel</Text>
          <SidebarItem title="MES RENDEZ-VOUS" navigate={navigate} url="/appointments" />
          <SidebarItem title="MES TRAITEMENTS" navigate={navigate} url="/treatments" />
          <SidebarItem title="PLAN" navigate={navigate} url="/plan" />
          <SidebarItem title="MES PROFESSIONNELS DE SANTÉ" navigate={navigate} url="/professionals" />
          <SidebarItem title="SE DÉCONNECTER" navigate={navigate} url="/logout" />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250, // Largeur du menu
    borderRightColor: '#ddd',
    borderRightWidth: 1,
  },
  menuContent: {
    padding: 10,
  },
  menuHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  closeMenu: {
    alignSelf: 'flex-end',
    padding: 10,
    marginTop: 20,
  },
  closeText: {
    fontSize: 24,
    color: 'black',
  },
});

export default Sidebar;
