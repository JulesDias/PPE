import React from 'react';
import { Stack } from 'expo-router';


export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // Désactive complètement le header natif
            }}
        >
            <Stack.Screen name="index" />
        </Stack>
    );
}

