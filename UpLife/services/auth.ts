import { supabase } from './supabase';

// Fonction de connexion
export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw new Error(error.message);
    return data;
};

// Fonction de déconnexion
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
};
