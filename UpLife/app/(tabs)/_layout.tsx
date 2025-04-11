import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { supabase } from '../../services/supabase';

export default function Layout() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.replace('/login');
            }
            setIsLoading(false);
        };

        checkSession();
    }, []);

    if (isLoading) return null;

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
            {/* Supprimer les '/' devant les noms de routes */}
            <Stack.Screen name="login" />
            <Stack.Screen name="SignUpScreen" />
        </Stack>
    );
}