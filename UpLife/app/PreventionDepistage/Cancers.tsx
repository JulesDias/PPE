import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';
import cancersData from '@/data/cancersInfo.json';

const Cancers = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Interface mise à jour
  interface Cancer {
    nom: string;
    symptômes: string; // Changement ici
    dépistage: string;
    traitement: string;
    prévention: string;
    "plus d'infos": string;
  }

  interface ExpandedState {
    [key: string]: boolean;
  }

  const toggleExpand = (cancerName: string) => {
    setExpanded((prev: ExpandedState) => ({
      ...prev,
      [cancerName]: !prev[cancerName],
    }));
  };

  const openLink = (url: string): void => {
      if (url) {
          Linking.openURL(url).catch((err: Error) => console.error("Erreur d'ouverture du lien: ", err));
      }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrow-left" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.homeButton}>
        <Icon name="home" size={30} color="white" />
      </TouchableOpacity>

      <View style={{ height: 20 }} />

      <Text style={styles.pageTitle}>Mieux comprendre les cancers</Text>

      <View style={{ height: 20 }} />

      <Text style={styles.text}>
        Le cancer se développe lorsque des cellules anormales se multiplient de manière incontrôlée dans l'organisme.
        Il peut toucher différents organes et évoluer à des rythmes variés. Un dépistage précoce et un mode de vie sain
        augmentent les chances de traitement efficace. Retrouvez ici les cancers les plus courants, leurs symptômes et les spécialistes à consulter.
      </Text>

      <ScrollView style={styles.listContainer}>
        {cancersData.map((cancer: Cancer, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.button} onPress={() => toggleExpand(cancer.nom)}>
              <Text style={styles.buttonText}>{cancer.nom}</Text>
              <Icon name={expanded[cancer.nom] ? "minus" : "plus"} size={20} color="#233468" />
            </TouchableOpacity>

            {expanded[cancer.nom] && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailTitle}>Symptômes :</Text>
                <Text style={styles.detailText}>{cancer.symptômes}</Text>

                <Text style={styles.detailTitle}>Dépistage :</Text>
                <Text style={styles.detailText}>{cancer.dépistage}</Text>

                <Text style={styles.detailTitle}>Traitement :</Text>
                <Text style={styles.detailText}>{cancer.traitement}</Text>

                <Text style={styles.detailTitle}>Prévention :</Text>
                <Text style={styles.detailText}>{cancer.prévention}</Text>

                <TouchableOpacity onPress={() => openLink(typeof cancer["plus d'infos"] === 'string' ? cancer["plus d'infos"] : cancer["plus d'infos"]) }>
                  <Text style={styles.link}>Plus d'infos</Text>
                </TouchableOpacity>
                
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
    backgroundColor: '#233468',
    padding: 10,
    borderRadius: 8,
  },
  homeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: '#233468',
    padding: 10,
    borderRadius: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#233468',
    fontFamily: 'Sora-Medium',
    marginBottom: 20,
    marginTop: 60,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
  },
  listContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: '#233468',
    fontWeight: '500',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#233468',
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'justify',
  },
  link: {
    color: 'black',
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
});

export default Cancers;