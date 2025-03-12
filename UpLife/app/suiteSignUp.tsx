import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TextInput, GestureHandlerRootView } from "react-native-gesture-handler";
import { Calendar } from "react-native-calendars";
import { supabase } from "@/services/supabase"; // Assurez-vous d'avoir correctement configuré Supabase

export default function SuiteSignUp() {
    const [formData, setFormData] = useState({
        dateNaissance: new Date(),
        sexe: "",
        poids: "",
        taille: "",
    });

    const [showCalendar, setShowCalendar] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Récupérer les paramètres de la page précédente
    const params = useLocalSearchParams();
    const previousFormData = typeof params.previousFormData === 'string' ? JSON.parse(params.previousFormData) : {};
    const router = useRouter();

    const handleSubmit = async () => {
        const allData = {
            ...previousFormData,
            ...formData,
            dateNaissance: formData.dateNaissance.toISOString().split("T")[0], // Format YYYY-MM-DD
        };

        // Enregistrer les données finales dans Supabase
        const { data, error } = await supabase
            .from("utilisateurs")
            .update({
                D_naissance: allData.dateNaissance,
                Sexe: allData.sexe,
                Poids: allData.poids,
                Taille: allData.taille,
            })
            .eq("Email", previousFormData.email); // Utiliser l'email pour identifier l'utilisateur

        if (error) {
            alert("Erreur lors de l'enregistrement des informations complémentaires: " + error.message);
            return;
        }

        console.log("Données mises à jour :", data);
        router.push("/(tabs)"); // Rediriger après l'enregistrement
    };

    const onDateChange = (day: { dateString: string }) => {
        setFormData({ ...formData, dateNaissance: new Date(day.dateString) });
        setShowCalendar(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>VOS INFORMATIONS</Text>

                    <View style={styles.form}>
                        {/* Date de Naissance */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date de Naissance</Text>
                            <TouchableOpacity style={styles.input} onPress={() => setShowCalendar(true)}>
                                <Text style={styles.inputText}>{formData.dateNaissance.toLocaleDateString()}</Text>
                                <Feather name="calendar" size={20} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* Calendar Modal */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={showCalendar}
                            onRequestClose={() => setShowCalendar(false)}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Calendar
                                        onDayPress={onDateChange}
                                        markedDates={{
                                            [formData.dateNaissance.toISOString().split("T")[0]]: { selected: true, selectedColor: "#26336A" },
                                        }}
                                        theme={{
                                            backgroundColor: "#ffffff",
                                            calendarBackground: "#ffffff",
                                            textSectionTitleColor: "#b6c1cd",
                                            selectedDayBackgroundColor: "#26336A",
                                            selectedDayTextColor: "#ffffff",
                                        }}
                                    />
                                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowCalendar(false)}>
                                        <Text style={styles.textStyle}>Fermer</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {/* Sexe */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Sexe</Text>
                            <TouchableOpacity style={styles.input} onPress={() => setShowDropdown(!showDropdown)}>
                                <Text style={styles.inputText}>{formData.sexe || "Sélectionnez votre sexe"}</Text>
                                <Feather name="chevron-down" size={20} color="black" />
                            </TouchableOpacity>
                            {showDropdown && (
                                <View style={styles.dropdown}>
                                    {["Homme", "Femme", "Autres"].map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setFormData({ ...formData, sexe: option });
                                                setShowDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownText}>{option}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Poids */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Poids</Text>
                            <View style={styles.input}>
                                <TextInput
                                    style={styles.inputText}
                                    value={formData.poids}
                                    onChangeText={(text) => setFormData({ ...formData, poids: text })}
                                    keyboardType="numeric"
                                    placeholder="Entrez votre poids"
                                />
                                <Text style={styles.unit}>kg</Text>
                            </View>
                        </View>

                        {/* Taille */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Taille</Text>
                            <View style={styles.input}>
                                <TextInput
                                    style={styles.inputText}
                                    value={formData.taille}
                                    onChangeText={(text) => setFormData({ ...formData, taille: text })}
                                    keyboardType="numeric"
                                    placeholder="Entrez votre taille"
                                />
                                <Text style={styles.unit}>cm</Text>
                            </View>
                        </View>
                    </View>

                    {/* Navigation Buttons */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <AntDesign name="arrowright" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </GestureHandlerRootView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        padding: 20,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 40,
    },
    form: {
        marginBottom: 40,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
    },
    unit: {
        fontSize: 16,
        color: "#888",
    },
    submitButton: {
        backgroundColor: "#26336A",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    dropdown: {
        position: "absolute",
        top: 40,
        left: 0,
        right: 0,
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        zIndex: 10,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    dropdownText: {
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#26336A",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    textStyle: {
        color: "white",
        fontSize: 16,
    },
});
