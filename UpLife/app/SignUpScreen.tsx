import React, { useState } from 'react';
import { router } from 'expo-router';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function InscriptionScreen() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        motDePasse: '',
        confirmerMotDePasse: ''
    });

    const handleSubmit = async () => {
        if (formData.motDePasse !== formData.confirmerMotDePasse) {
            Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/submit-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Utilisateur enregistré avec succès");
                router.push({
                    pathname: "/suiteSignUp",
                    params: { previousFormData: JSON.stringify(formData) }
                });
            } else {
                const errorData = await response.json();
                Alert.alert("Erreur", errorData.error || "Erreur lors de l'enregistrement de l'utilisateur.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            Alert.alert("Erreur", "Erreur réseau. Veuillez réessayer.");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>INSCRIPTION</Text>
                    <Text style={styles.subtitle}>Apprenons à nous connaître.</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom"
                            value={formData.nom}
                            onChangeText={(text) => setFormData({ ...formData, nom: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Prénom"
                            value={formData.prenom}
                            onChangeText={(text) => setFormData({ ...formData, prenom: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Téléphone"
                            keyboardType="phone-pad"
                            value={formData.telephone}
                            onChangeText={(text) => setFormData({ ...formData, telephone: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Mot de passe"
                            secureTextEntry
                            value={formData.motDePasse}
                            onChangeText={(text) => setFormData({ ...formData, motDePasse: text })}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Confirmer le mot de passe"
                            secureTextEntry
                            value={formData.confirmerMotDePasse}
                            onChangeText={(text) => setFormData({ ...formData, confirmerMotDePasse: text })}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <AntDesign name="arrowright" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        padding: 20,
        position: 'relative',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 16,
        color: '#000',
        marginBottom: 30,
    },
    inputContainer: {
        gap: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    submitButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});