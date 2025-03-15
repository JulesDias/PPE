import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '@/components/Sidebar';
import { router } from 'expo-router';
import istData from '@/data/ISTenBrefInfo.json';

const ISTenBref = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [expanded, setExpanded] = useState<ExpandedState>({});

interface ExpandedState {
    [key: string]: boolean;
}

interface IST {
    nom: string;
    symptômes: string | { Homme: string; Femme: string };
    dépistage: string;
    traitement: string;
    prévention: string;
    "plus d'infos": string;
}

const toggleExpand = (name: string) => {
    setExpanded((prev: ExpandedState) => ({ ...prev, [name]: !prev[name] }));
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

      <Text style={styles.pageTitle}>Les IST en un coup d'œil</Text>

      <ScrollView style={{ marginTop: 20 }}>
        {istData.map((ist, index) => (
          <View key={index} style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => toggleExpand(ist.nom)}>
              <Text style={styles.buttonText}>{ist.nom}</Text>
              <Icon name={expanded[ist.nom] ? 'minus' : 'plus'} size={20} color="#233468" />
            </TouchableOpacity>
            {expanded[ist.nom] && (
              <View style={styles.details}>
                <Text style={styles.detailTitle}>Symptômes :</Text>
                {typeof ist.symptômes === 'string' ? (
                  <Text style={styles.detailText}>{ist.symptômes}</Text>
                ) : (
                  <>
                    <Text style={styles.detailText}>Homme: {ist.symptômes.Homme}</Text>
                    <Text style={styles.detailText}>Femme: {ist.symptômes.Femme}</Text>
                  </>
                )}

                <Text style={styles.detailTitle}>Dépistage :</Text>
                <Text style={styles.detailText}>{ist.dépistage}</Text>

                <Text style={styles.detailTitle}>Traitement :</Text>
                <Text style={styles.detailText}>{ist.traitement}</Text>

                <Text style={styles.detailTitle}>Prévention :</Text>
                <Text style={styles.detailText}>{ist.prévention}</Text>

                <TouchableOpacity onPress={() => openLink(typeof ist["plus d'infos"] === 'string' ? ist["plus d'infos"] : ist["plus d'infos"].lien) }>
                  <Text style={styles.linkText}>Plus d'infos</Text>
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
    marginBottom: 20,
    marginTop: 60,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  details: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#233468',
    marginTop: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  linkText: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
});

export default ISTenBref;
