import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Avatar, Card, Title, Paragraph, Checkbox } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";

const dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Bonjour, Paul Rouxel.</Text>
      
      {/* Section Rendez-vous */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>MES RENDEZ-VOUS</Title>
          <Text style={styles.date}>LUNDI 23</Text>
          <Paragraph>Aucun événement</Paragraph>
        </Card.Content>
      </Card>
      
      {/* Section Traitements */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>MES TRAITEMENTS</Title>
          <View style={styles.checkboxContainer}>
            <Text>Matin</Text>
            <Checkbox status="unchecked" />
            <Text>💊 Pilule</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Text>Midi</Text>
            <Checkbox status="unchecked" />
            <Text>Antibiotique</Text>
          </View>
        </Card.Content>
      </Card>
      
      {/* Section Carte */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>PLAN - URGENCES / PHARMACIES AUTOUR DE MOI</Title>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 48.8566,
              longitude: 2.3522,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude: 48.8566, longitude: 2.3522 }} title="Pharmacie" />
          </MapView>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: { marginBottom: 20, padding: 10 },
  date: { fontSize: 18, fontWeight: "bold", color: "red" },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  map: { width: "100%", height: 200, marginTop: 10 }
});

export default dashboard;
