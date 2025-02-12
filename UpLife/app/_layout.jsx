import React from 'react';
import { Stack } from 'expo-router';
import { setStatusBarHidden, StatusBar } from 'expo-status-bar'; // Import the StatusBar

const RootLayout = () => {

    return (
        <>
        <Stack>
            <Stack.Screen name = "index" options = {{headerShown : false}}  />
            <Stack.Screen name = "appointments" options = {{headerShown : true}}  />
        </Stack>
        </>
    )
};

export default RootLayout