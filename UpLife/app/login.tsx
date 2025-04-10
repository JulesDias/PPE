import React, { useState } from 'react';
import { router } from 'expo-router';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { signIn } from '@/services/auth';

export default function LoginScreen() {
    const [credentials, setCredentials] = useState({
        email: '',
        motDePasse: ''
    });

    const handleLogin = async () => {
        try {
            const user = await signIn(credentials.email, credentials.motDePasse);
            router.push('/'); // Redirection après connexion réussie
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erreur', error.message);
            } else {
                Alert.alert('Erreur', 'Une erreur inconnue est survenue');
            }
        }
    };

    const goToSignUp = () => {
        router.push('/SignUpScreen');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>CONNEXION</Text>
                <Text style={styles.subtitle}>Connectez-vous à votre compte.</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={credentials.email}
                    onChangeText={(text) => setCredentials({ ...credentials, email: text })}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={credentials.motDePasse}
                    onChangeText={(text) => setCredentials({ ...credentials, motDePasse: text })}
                />

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.submitButtonText}>Se connecter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={goToSignUp}
                >
                    <Text style={styles.signUpButtonText}>Pas encore inscrit ?</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        width: '80%',
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
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 20,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#233468',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    signUpButtonText: {
        fontSize: 16,
        color: '#233468',
        textDecorationLine: 'underline',
    },
});
