"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native"
import { AntDesign, Feather } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { TextInput, GestureHandlerRootView } from "react-native-gesture-handler"
import { Calendar } from "react-native-calendars"

export default function SuiteSignUp() {
    const [formData, setFormData] = useState({
        dateNaissance: new Date(),
        sexe: "",
        poids: "",
        taille: "",
    })

    const [showCalendar, setShowCalendar] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

    // Récupérer les paramètres
    const params = useLocalSearchParams()
    const previousFormData = params.previousFormData ? JSON.parse(params.previousFormData as string) : {}

    const handleSubmit = () => {
        const allData = {
            ...previousFormData,
            ...formData,
            dateNaissance: formData.dateNaissance.toISOString().split("T")[0], // Format as YYYY-MM-DD
        }
        console.log("All form data:", allData)
        router.push("/(tabs)")
    }

    const onDateChange = (day: { dateString: string }) => {
        setFormData({ ...formData, dateNaissance: new Date(day.dateString) })
        setShowCalendar(false)
    }

    return (
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
                                        todayTextColor: "#26336A",
                                        dayTextColor: "#2d4150",
                                        textDisabledColor: "#d9e1e8",
                                        dotColor: "#26336A",
                                        selectedDotColor: "#ffffff",
                                        arrowColor: "#26336A",
                                        monthTextColor: "#26336A",
                                        indicatorColor: "#26336A",
                                        textDayFontWeight: "300",
                                        textMonthFontWeight: "bold",
                                        textDayHeaderFontWeight: "300",
                                        textDayFontSize: 16,
                                        textMonthFontSize: 16,
                                        textDayHeaderFontSize: 16,
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
                                            setFormData({ ...formData, sexe: option })
                                            setShowDropdown(false)
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

                    {/* Informations complémentaires */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Informations complémentaires*</Text>
                        <TouchableOpacity style={styles.input}>
                            <Text style={styles.addButton}>Ajouter</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.footnote}>* Vous pouvez configurer ces informations plus tard dans Mon Profil</Text>
                </View>

                {/* Navigation Buttons */}
                <View style={styles.navigation}>
                    <TouchableOpacity style={styles.navButton} onPress={() => router.back()}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <AntDesign name="arrowright" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 40,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        color: "black",
    },
    input: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 50,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
    },
    unit: {
        fontSize: 16,
        color: "#666",
    },
    addButton: {
        color: "#666",
        fontSize: 16,
    },
    footnote: {
        fontSize: 12,
        color: "#666",
        marginTop: 8,
    },
    navigation: {
        position: "absolute",
        bottom: 20,
        left: 20,
    },
    dropdown: {
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        marginTop: 8,
    },
    dropdownItem: {
        padding: 15,
    },
    dropdownText: {
        fontSize: 16,
        color: "black",
    },
    navButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#F0F0F0",
        justifyContent: "center",
        alignItems: "center",
    },
    submitButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#26336A",
        justifyContent: "center",
        alignItems: "center",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        backgroundColor: "#26336A",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
})

