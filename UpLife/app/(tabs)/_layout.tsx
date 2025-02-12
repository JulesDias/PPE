import React from 'react';
import { Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerTransparent: true,  // Rendre l'en-tête transparent
                headerShown: true,        // Garder l'en-tête, mais le rendre transparent
                tabBarStyle: {
                    paddingBottom: Platform.OS === 'ios' ? 20 : 0, // Ajuster le padding pour iOS
                },
                headerStyle: {
                    height: Platform.OS === 'ios' ? 100 : 60, // Ajuster la hauteur de l'en-tête pour iOS
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: '',  // Retirer le titre
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                }}
            />
            <Tabs.Screen
                name="two"
                options={{
                    title: '',  // Retirer le titre
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                }}
            />
        </Tabs>
    );
}
