const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Informations de connexion à Supabase
const SUPABASE_URL = 'https://swgrwtjqbohsaghbmznu.supabase.co'; // Remplacez par votre URL Supabase
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Z3J3dGpxYm9oc2FnaGJtem51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMzY3NzEsImV4cCI6MjA0NzYxMjc3MX0.QLrhJ-tzVg5LVV9E1NJQMYvT7CscviaXsPVOLXTpZdU'; // Remplacez par votre clé API Supabase

// Initialiser le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Créer une application Express
const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Endpoint pour récupérer le prénom d'un utilisateur avec ID_utilisateur = 1
app.get('/get-user', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('utilisateurs') // Nom de la table dans votre base de données
      .select('Prenom') // Colonne(s) à récupérer
      .eq('ID_utilisateur', 1); // Condition : ID_utilisateur = 1

    if (error) {
      console.error('Erreur lors de la requête Supabase :', error);
      return res.status(500).json({ error: 'Erreur lors de la requête à Supabase' });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(data[0]); // Retourne l'objet avec le prénom
  } catch (err) {
    console.error('Erreur serveur :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
