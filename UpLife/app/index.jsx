import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import {styles} from './styles.js';
import Widget from '../component/widget.jsx';
import Sidebar from '../component/sidebar.jsx';

export default function Index() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnimation] = useState(new Animated.Value(-300)); // Position de départ à gauche
  const router = useRouter(); // Initialize the router for navigation
  

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnimation, {
        toValue: -300,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  //navigate to clicked page 
  const navigateToPage = (url) => {
    // Close the sidebar if it's open
    if (menuVisible) {
      toggleMenu();
    }
    // Navigate to the specified page
    router.push(url);
  };
  
  return (
    <View style={styles.container}>
      {/* Header avec l'icône du menu */}
      <StatusBar hidden={true} />
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={32} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Bonjour, Paul Rouxel.</Text>
      </View>

      {/* Blocs principaux */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {/* Mes Rendez-vous */}
        <Widget
            title="MES RENDEZ-VOUS"
            content={["LUNDI 23", "Aucun événement"]}
            onPress={() => navigateToPage('/appointments')}
        />

        <Widget
            title="MES TRAITEMENTS"
            content={["Matin: Pilule", "Soir: Antibiotique"]}
            onPress={() => navigateToPage('/treatments')} // Example route for treatments
        />

        {/* Plan */}
        <Widget
            title="PLAN - URGENCES / PHARMACIES"
            content={ ["[Carte Map]"]}
            onPress={() => navigateToPage('/plan')}
        />

        {/* TEST */}
        <Widget
            title="WIDGET TEST"
            content={ ["Test vers les sub layout"]}
            onPress={() => navigateToPage('/traitements')}
        />
      </ScrollView>

      {/* Sidebar */}
      <Sidebar menuVisible={menuVisible} toggleMenu={toggleMenu} slideAnimation={slideAnimation} navigate={navigateToPage} />


      <StatusBar style="auto" />
    </View>
  );
}

