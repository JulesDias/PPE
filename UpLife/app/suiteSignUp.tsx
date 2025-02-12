import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { TextInput, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function SuiteSignUp() {
    const [formData, setFormData] = useState({
        dateNaissance: '',
        sexe: '',
        poids: '',
        taille: '',
    });

    // Récupérer les paramètres
    const params = useLocalSearchParams();
    const previousFormData = params.previousFormData ? JSON.parse(params.previousFormData as string) : {};

    const handleSubmit = () => {
        const allData = {
            ...previousFormData,
            ...formData
        };
        console.log('All form data:', allData);
        router.push('/(tabs)');
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>VOS INFORMATIONS</Text>

                <View style={styles.form}>
                    {/* Date de Naissance */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date de Naissance</Text>
                        <TouchableOpacity style={styles.input}>
                            <Text style={styles.inputText}>
                                {formData.dateNaissance || ''}
                            </Text>
                            <Feather name="calendar" size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Sexe */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sexe</Text>
                        <TouchableOpacity style={styles.input}>
                            <Text style={styles.inputText}>
                                {formData.sexe || ''}
                            </Text>
                            <Feather name="chevron-down" size={20} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Poids */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Poids</Text>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.inputText}
                                value={formData.poids}
                                onChangeText={(text) => setFormData({ ...formData, poids: text })}
                                keyboardType="numeric"
                                placeholder="Entrez votre poids"
                            />
                            <Text style={styles.unit}>kg</Text>
                        </View>
                    </View>

                    {/* Taille */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Taille</Text>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.inputText}
                                value={formData.taille}
                                onChangeText={(text) => setFormData({ ...formData, taille: text })}
                                keyboardType="numeric"
                                placeholder="Entrez votre taille"
                            />
                            <Text style={styles.unit}>cm</Text>
                        </View>
                    </View>

                    {/* Informations complémentaires */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Informations complémentaires*</Text>
                        <TouchableOpacity style={styles.input}>
                            <Text style={styles.addButton}>Ajouter</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footnote}>
                        * Vous pouvez configurer ces informations plus tard dans Mon Profil
                    </Text>
                </View>

                {/* Navigation Buttons */}
                <View style={styles.navigation}>
                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={() => router.back()}
                    >
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navButton}
                        onPress={handleSubmit}
                    >
                        <AntDesign name="arrowright" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        color: 'black',
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0F0F0',
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 50,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
    },
    unit: {
        fontSize: 16,
        color: '#666',
    },
    addButton: {
        color: '#666',
        fontSize: 16,
    },
    footnote: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
    navigation: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
});