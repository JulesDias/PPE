import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Sidebar from '@/components/Sidebar';
import utilisateurs from '@/data/utilisateurs.json';
import { router } from 'expo-router';

const UserProfile = () => {
    const [userData, setUserData] = useState<any>(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [showVaccins, setShowVaccins] = useState(false);

    useEffect(() => {
        setUserData(utilisateurs[0]); // Load the first user from JSON
    }, []);

    if (!userData) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Menu Button */}
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                <Icon name="bars" size={30} color="black" />
            </TouchableOpacity>

            {/* Home Button */}
            <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.homeButton}>
                <Icon name="home" size={30} color="black" />
            </TouchableOpacity>

            <Text style={styles.pageTitle}>MON COMPTE</Text>

            <ScrollView>
                {/* Personal Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mes informations</Text>
                    <ProfileField label="Nom" value={userData.Nom} />
                    <ProfileField label="Prénom" value={userData.Prenom} />
                    <ProfileField label="E-mail" value={userData.Email} />
                    <ProfileField label="Téléphone" value={userData.Tel_perso} />
                </View>

                {/* Health Data Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mes données de santé</Text>
                    <ProfileField label="Date de Naissance" value={userData.D_naissance} />
                    <ProfileField label="Sexe" value={userData.Sexe === "F" ? "Femme" : "Homme"} />
                    <ProfileField label="Poids" value={`${userData.Poids} kg`} />
                    <ProfileField label="Taille" value={`${userData.Taille} cm`} />
                    <ProfileField label="Groupe sanguin" value={userData.G_sanguin} />
                </View>

                {/* Vaccination Section */}
                <TouchableOpacity onPress={() => setShowVaccins(!showVaccins)} style={styles.vaccineToggle}>
                    <Text style={styles.toggleText}>Mes Vaccins</Text>
                    <Icon name={showVaccins ? "angle-up" : "angle-down"} size={20} color="#233468" />
                </TouchableOpacity>

                {showVaccins && (
                    <View style={styles.vaccineContainer}>
                        <VaccineInfo label="Hépatite B" lastDose="05/09/2021" nextDose="12/03/2032" />
                        <VaccineInfo label="ROR" lastDose="15/07/2005" nextDose="05/09/2031" />
                        <VaccineInfo label="Covid-19" lastDose="20/06/2023" nextDose="À jour" />
                    </View>
                )}
            </ScrollView>

            <Sidebar menuVisible={menuVisible} closeMenu={() => setMenuVisible(false)} />
        </View>
    );
};

// Profile Field Component
const ProfileField = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput value={value} editable={false} style={styles.input} />
    </View>
);

// Vaccine Info Component
const VaccineInfo = ({ label, lastDose, nextDose }: { label: string, lastDose: string, nextDose: string }) => (
    <View style={styles.vaccineCard}>
        <Text style={styles.vaccineLabel}>{label}:</Text>
        <Text>Dernière dose: {lastDose}</Text>
        <Text>Prochain rappel: {nextDose}</Text>
    </View>
);

// 🔹 FIXED & IMPROVED STYLES 🔹
const styles = {
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FEFEFE',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FEFEFE',
    },
    loadingText: {
        fontSize: 18,
        color: '#233468',
    },
    menuButton: {
        position: 'absolute',
        top: 15,
        left: 15,
        zIndex: 10,
    },
    homeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#233468',
        fontFamily: 'Sora-Medium',
        marginBottom: 15,
    },
    section: {
        backgroundColor: '#b6d379',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    sectionTitle: {
        fontFamily: 'Sora-Medium',
        fontWeight: 'bold',
        color: '#233468',
        marginBottom: 10,
    },
    fieldContainer: {
        marginBottom: 10,
    },
    fieldLabel: {
        fontWeight: 'bold',
        color: '#233468',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        color: 'black',
    },
    vaccineToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#b6d379',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    toggleText: {
        fontWeight: 'bold',
        color: '#233468',
    },
    vaccineContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
    },
    vaccineCard: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    vaccineLabel: {
        fontWeight: 'bold',
        color: '#233468',
    }
};

export default UserProfile;
