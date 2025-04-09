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
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';

export default function InscriptionScreen() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        motDePasse: '',
        confirmerMotDePasse: '',
    });

    const handleSubmit = async () => {
        if (formData.motDePasse !== formData.confirmerMotDePasse) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.motDePasse,
        });

        if (authError) {
            alert('Erreur lors de l\'inscription: ' + authError.message);
            return;
        }

        const userId = authData.user?.id;

        if (!userId) {
            alert("Impossible de récupérer l'ID utilisateur.");
            return;
        }

        const { data, error: insertError } = await supabase
            .from('utilisateurs')
            .insert([
                {
                    id: userId, // Liaison avec Supabase Auth
                    Nom: formData.nom,
                    Prenom: formData.prenom,
                    Email: formData.email,
                    Tel_perso: formData.telephone,
                },
            ]);

        if (insertError) {
            alert('Erreur lors de l\'ajout des informations supplémentaires: ' + insertError.message);
            return;
        }

        console.log('Utilisateur ajouté', data);
        router.push({
            pathname: "/suiteSignUp",
            params: { previousFormData: JSON.stringify(formData) }
        });
    };

    const goToLogin = () => {
        router.push("/login");
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
                            placeholderTextColor="#999"
                            value={formData.nom}
                            onChangeText={(text) => setFormData({ ...formData, nom: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Prénom"
                            placeholderTextColor="#999"
                            value={formData.prenom}
                            onChangeText={(text) => setFormData({ ...formData, prenom: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Téléphone"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            value={formData.telephone}
                            onChangeText={(text) => setFormData({ ...formData, telephone: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mot de passe"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={formData.motDePasse}
                            onChangeText={(text) => setFormData({ ...formData, motDePasse: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmer le mot de passe"
                            placeholderTextColor="#999"
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
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#000',
        marginBottom: 30,
        textAlign: 'center',
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
        marginBottom: 20,
        color: '#333'
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
    loginButton: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    loginButtonText: {
        fontSize: 16,
        color: '#000',
        textDecorationLine: 'underline',
    },
});
