// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../app/SignUpScreen'; // Assurez-vous que ce chemin est correct
import SuiteSignUp from '../app/suiteSignUp'; // Assurez-vous que ce chemin est correct

// Crée un objet Stack Navigator
const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SignUpScreen">
                <Stack.Screen
                    name="SignUpScreen"
                    component={SignUpScreen}
                    options={{ title: 'Inscription' }}
                />
                <Stack.Screen
                    name="suiteSignUp"
                    component={SuiteSignUp}
                    options={{ title: 'Suite de l\'inscription' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
