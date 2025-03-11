import React from 'react';
import { Stack } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';

export default function Layout() {
    const colorScheme = useColorScheme();

    return (
        <Stack
            screenOptions={{
                headerTransparent: true,
                headerShown: true,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: '',
                }}
            />
        </Stack>
    );
}
