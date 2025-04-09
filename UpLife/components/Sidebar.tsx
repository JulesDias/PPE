import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '@/services/supabase';

interface SidebarProps {
  menuVisible: boolean;
  closeMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuVisible, closeMenu }) => {
  const [prenom, setPrenom] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Erreur de récupération de l'utilisateur:", error.message);
        return;
      }

      if (user) {
        const userId = user.id;

        const { data: utilisateurData, error: utilisateurError } = await supabase
          .from("utilisateurs")
          .select("Prenom")
          .eq("id", userId)
          .single();

        if (utilisateurError) {
          console.error("Erreur de récupération du prénom:", utilisateurError.message);
        } else if (utilisateurData) {
          setPrenom(utilisateurData.Prenom);
        }
      }
    };

    fetchUser();
  }, []);

  if (!menuVisible) return null;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error instanceof Error ? error.message : error);
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.menu}>
        <View style={styles.header}>
          <TouchableOpacity>
            <FontAwesome name="gear" size={24} color="black" onPress={() => router.push('/Reglages/ReglagesAccueil')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={closeMenu}>
            <Entypo name="cross" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profilePic} />
          <Text style={styles.profileName}>{prenom ? prenom : 'Chargement...'}</Text>
        </View>

        <View style={styles.notificationBox}>
          <Text style={styles.notificationText}>NOTIFICATIONS</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <FontAwesome name="heart" size={18} color="black" />
            <Text> Ma Santé</Text>
          </View>
          <MenuItem label="MON PROFIL" onPress={() => router.push('/UserProfile')} />
          <MenuItem label="MES PROFESSIONNELS DE SANTÉ" onPress={() => router.push('/MesProDeSante')} />
          <MenuItem label="MES RENDEZ-VOUS" onPress={() => router.push('/RendezVous')} />
          <MenuItem label="MES TRAITEMENTS" onPress={() => router.push('/MesTraitements')} />
          <MenuItem label="MES ANTÉCÉDENTS" onPress={() => router.push('/MesAntecedents')} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitle}>
            <FontAwesome name="info-circle" size={18} color="black" />
            <Text> Informations et Prévention</Text>
          </View>
          <MenuItem label="PLAN PHARMACIES & URGENCES" onPress={() => router.push('/PlanPharmaUrgence')} />
          <MenuItem label="LA VACCINATION" onPress={() => router.push('/Vaccination/VaccinationAccueil')}/>
          <MenuItem label="PRÉVENTION & DÉPISTAGES" onPress={() => router.push('/PreventionDepistage/PreventionDepistageAccueil')}/>
          <MenuItem label="SITES & INFORMATIONS UTILES" onPress={() => router.push('/SiteInfoUtile')} />
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <FontAwesome name="sign-out" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/company/ececook')}><FontAwesome name="linkedin" size={24} color="black" style={styles.icon} /></TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/ececook/#')}><FontAwesome name="instagram" size={24} color="black" style={styles.icon} /></TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/watch?v=xvFZjo5PgG0')}><FontAwesome name="twitter-square" size={24} color="black" style={styles.icon} /></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => router.push('/Reglages/MentionsLegales')}><Text style={styles.legalText}>Mentions légales</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const MenuItem: React.FC<{ label: string; onPress?: () => void }> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuItemText}>{label}</Text>
    <FontAwesome name="chevron-right" size={18} color="black" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    zIndex: 9999,
    elevation: 10,
  },
  menu: {
    width: "80%",
    height: "100%",
    backgroundColor: "#93b8d3",
    padding: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePic: {
    width: 20,
    height: 20,
    borderRadius: 30,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  notificationBox: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  notificationText: {
    fontSize: 14,
    color: '#555',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  socialIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 10,
  },
  legalText: {
    fontSize: 12,
    color: '#555',
  },
});

export default Sidebar;
