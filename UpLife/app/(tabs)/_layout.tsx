import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { supabase } from '../../services/supabase';

export default function Layout() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.replace('/login'); // Redirection si non connecté
            }
            setIsLoading(false);
        };

        checkSession();
    }, []);

    if (isLoading) return null; // Évite un écran blanc pendant la vérification

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="/login" />
            <Stack.Screen name="/SignUpScreen" />
        </Stack>
    );
}
