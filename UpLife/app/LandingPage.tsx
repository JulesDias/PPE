import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';


const LandingPage = () => {
    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/Logo.png')} style={styles.logo} />
            <Text style={styles.title}>Bienvenue sur UpLife</Text>
            <TouchableOpacity style={styles.button} onPress={() => console.log('Navigate to Login')}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => console.log('Navigate to Sign Up')}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#26336A',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default LandingPage;