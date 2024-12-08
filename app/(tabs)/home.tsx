import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
  FlatList,
  Button,
} from "react-native";
import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
  Entypo,
  Fontisto,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import Header from "@/components/Header";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import { useMemo } from "react";
import * as SQLite from "expo-sqlite";
import { useRouter } from "expo-router";

const plat = Platform.OS == "android";

const ReminderItem = (props: {
  passed: boolean;
  date: string;
  title: string;
  time: string;
}) => {
  const { passed, date, title, time } = props;
  return (
    <SafeAreaView
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingEnd: 15,
       
      }}
    >
      <View style={styles.teminderCard}>
        <View style={{ gap: 10, flexDirection: "row", alignItems: "center" }}>
          <View>
            {passed ? (
              <FontAwesome name="bell-o" size={20} color={Colors.light.icon} />
            ) : (
              <FontAwesome name="bell" size={20} color="black" />
            )}
          </View>
          <View style={{ gap: 10 }}>
            <Text style={{ color: "black" }}>set: {date}</Text>
            <Text style={{ color: Colors.light.icon, fontWeight: "400" }}>
              {title}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              color: "black",
              fontWeight: "bold",
              fontSize: 12,
            }}
          >
            {time}
          </Text>
        </View>
      </View>

      <View>
        <TouchableOpacity style={{}}>
          <FontAwesome name="edit" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [vitals, setVitals] = useState([
    { fever: 0, cough: "0", shortness_of_breath: "0" },
  ]);
  const [cough, setCough] = useState(vitals[0].fever);
  const [fever, setFever] = useState(vitals[0].cough);
  const [breath, setBreathingDifficulty] = useState(
    vitals[0].shortness_of_breath
  );
  const [loading, setLoading] = useState(false);
  const [ChildData, setChildData] = useState([]);
  const [child, setChild] = useState({});
  const [refreshKey, setRefreshKey] = useState(0); // Add this state
  const [description, setDescription] = useState("");
  const [alertTime, setAlertTime] = useState("");
  const [alertDate, setAlertDate] = useState("");
  const [AlertsData, setAlertsData] = useState([]);
  // Memoize snap points
  const snapPoints = useMemo(() => ["50%", "75%"], []);
  // Reference for BottomSheet
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalRef_reminders = useRef<BottomSheetModal>(null);

  // Initialize database
  const initializeDatabase = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("childApp.db");

      // Check if any records exist
      const fetchedRecords = await db.getAllAsync("SELECT * FROM children");
      const fetchedRecords_vitals = await db.getAllAsync(
        "SELECT * FROM vitals ORDER BY id DESC LIMIT 1"
      );
      const fetchedRecords_alerts = await db.getAllAsync(
        "SELECT * FROM Alerts ORDER BY Alert_time DESC"
      );

      if (fetchedRecords.length > 0) {
        setChildData(fetchedRecords);
        setChild(fetchedRecords[0]);
      }
      if (fetchedRecords_vitals.length > 0) {
        setVitals(fetchedRecords_vitals);
      }
      if (fetchedRecords_alerts.length > 0) {
        setAlertsData(fetchedRecords_alerts);
      }

      console.log(AlertsData);
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  };

  // Handle form submission
  const RecordVitals = async () => {
    setLoading(false);
    handleCloseModalPress();
    try {
      const db = await SQLite.openDatabaseAsync("childApp.db");

      // Insert data into the database
      await db.runAsync(
        "INSERT INTO vitals (fever, cough, shortness_of_breath) VALUES (?, ?, ?);",
        [fever, cough, breath]
      );

      Alert.alert("Success", "Vitals Recorded successfully!");
      setFever("");
      setBreathingDifficulty("0");
      setCough("0");

      // Fetch updated records and navigate
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to record vitals.");
    } finally {
      setRefreshKey((prev) => prev + 1);
      setLoading(false);
    }
  };

  const handleSaveAlert = async () => {
    setLoading(true);
    if (!description || !alertTime || !alertDate) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync("childApp.db");

      // Insert data into the database
      await db.runAsync(
        `INSERT INTO Alerts (description, Alert_time, Alert_date) VALUES (?, ?, ?)`,
        [description, alertTime, alertDate]
      );

      setDescription("");
      setAlertTime("");
      setAlertDate("");

      // Fetch updated records and navigate
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to save notification.");
    } finally {
      setRefreshKey((prev) => prev + 1);
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeDatabase();
  }, [refreshKey]);

  // Show BottomSheet
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // Hide BottomSheet
  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  // Show BottomSheet
  const handlePresentModalPress_reminders = useCallback(() => {
    bottomSheetModalRef_reminders.current?.present();
  }, []);

  // Hide BottomSheet
  const handleCloseModalPress_reminders = useCallback(() => {
    bottomSheetModalRef_reminders.current?.close();
  }, []);

  const getColor = (value: number) => {
    if (value < 20) return "yellow";
    else if (value >= 25 && value < 35) return "orange";
    else return "red";
  };

  const barData = [
    { value: 22, label: "M" },
    { value: 32, label: "T" },
    { value: 27, label: "W" },
    { value: 34, label: "T" },
    { value: 27, label: "F" },
    { value: 38, label: "S" },
    { value: 30, label: "S" },
  ].map((item) => ({
    ...item,
    frontColor: getColor(item.value),
  }));

  const checkSeverity = () => {
    // Initialize the default color
    let color = "green";

    // Destructure vitals for readability
    const { fever, cough, shortness_of_breath } = vitals[0];

    // Logic for determining severity
    if (
      fever >= 39 ||
      shortness_of_breath === "1" ||
      (fever >= 38 && cough === "1")
    ) {
      color = "red"; // Life-threatening
    } else if (
      (fever >= 38 && fever < 39) ||
      cough === "1" ||
      shortness_of_breath === "0"
    ) {
      color = "orange"; // Severe
    } else if (fever >= 37 || cough === "1") {
      color = "yellow"; // Moderate
    } else {
      color = "green"; // Mild
    }

    return color;
  };

  const remindersSample = [
    {
      id: 1,
      date: "March 15, 2022",
      title: "Medication Reminder",
      time: "09:00 AM",
      passed: true,
    },
    {
      id: 2,
      date: "March 15, 2022",
      title: "Medication Reminder",
      time: "12:00 AM",
      passed: false,
    },
    {
      id: 3,
      date: "March 15, 2022",
      title: "Medication Reminder",
      time: "20:00 PM",
      passed: false,
    },
  ];

  const reminders = [
    {
      id: 1,
      icon: <FontAwesome6 name="pump-medical" size={24} color="white" />,
      label: "Medicine",
      color: "red",
    },
    {
      id: 2,
      icon: <AntDesign name="rest" size={24} color="white" />,
      label: "Rest",
      color: "purple",
    },
    {
      id: 3,
      icon: <MaterialIcons name="local-drink" size={24} color="white" />,
      label: "Hydrate",
      color: "green",
    },
    {
      id: 4,
      icon: <MaterialIcons name="sports-gymnastics" size={24} color="white" />,
      label: "Exercise",
      color: "orange",
    },
    {
      id: 5,
      icon: <Entypo name="water" size={24} color="white" />,
      label: "Hydrate",
      color: "blue",
    },
    {
      id: 6,
      icon: <Fontisto name="doctor" size={24} color="white" />,
      label: "Doctor",
      color: "brown",
    },
  ];

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Gradient Section */}
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={[
              checkSeverity() == "yellow" ? "green" : checkSeverity(),
              checkSeverity(),
            ]}
            style={styles.gradientSection}
          >
            <Text style={styles.gradientText}>{child.fullName}'s Vitals</Text>
            <View style={styles.gradientContent}>
              <View style={styles.readings}>
                <Text style={{ color: Colors.light.white }}>
                  Fever: {vitals[0].fever}°C
                </Text>
                <Text style={{ color: Colors.light.white }}>
                  Cough: {vitals[0].cough == "0" ? "No" : "Yes"}
                </Text>
                <Text style={{ color: Colors.light.white }}>
                  Shortness of Breath:{" "}
                  {vitals[0].shortness_of_breath == "0" ? "No" : "Yes"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handlePresentModalPress}
                style={styles.addButton}
              >
                <FontAwesome5 name="plus" size={20} color="purple" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Reminders Section */}
          <View style={styles.remindersSection}>
            <Text style={styles.sectionTitle}>
              <AntDesign name="bells" size={16} color="black" /> Reminders
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.reminderList}
            >
              {reminders.map((reminder) => (
                <View key={reminder.id} style={styles.reminderItem}>
                  <TouchableOpacity
                    style={[
                      styles.reminderCard,
                      { backgroundColor: reminder.color },
                    ]}
                    onPress={() => {
                      handlePresentModalPress_reminders();
                      setDescription(reminder.label);
                    }}
                  >
                    {reminder.icon}
                  </TouchableOpacity>
                  <Text style={styles.reminderLabel}>{reminder.label}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Next Appointment Section */}
          <View>
            <Text style={styles.sectionTitle}>Next Appointment</Text>
            <View style={styles.appointmentCard}>
              <View>
                <Text style={{ color: Colors.light.icon }}>
                  Date: March 15, 2022
                </Text>
                <Text style={{ color: Colors.light.icon }}>Time: 09:00 AM</Text>
              </View>
              <Text style={{ color: "black" }}>Doctor: Dr. John Doe</Text>
            </View>
          </View>
          {/* Next alert Section */}
          <View>
            <Text style={styles.sectionTitle}>Alerts</Text>

            {AlertsData.map((item) => (
              <ReminderItem
                key={item.id}
                passed={item.status}
                date={item.Alert_date}
                title={item.description}
                time={item.Alert_time}
              />
            ))}
          </View>
        </ScrollView>

        <BottomSheetModal
          ref={bottomSheetModalRef_reminders}
          snapPoints={snapPoints}
          index={0}
          backgroundStyle={styles.bottomSheetBackground}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 30,
              }}
            >
              <Text style={styles.sheetContent}>Add Reminder</Text>
              <TouchableOpacity onPress={handleCloseModalPress_reminders}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.label}>Alert Description:</Text>
              <TextInput
                style={[styles.input, { backgroundColor: "#ededed" }]}
                keyboardType="default"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                editable={false}
              />

              <Text style={styles.label}>Alert Time (HH:MM:SS):</Text>
              <TextInput
                style={styles.input}
                value={alertTime}
                onChangeText={setAlertTime}
                placeholder="Enter time (e.g., 14:30:00)"
              />

              <Text style={styles.label}>Alert Date (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.input}
                value={alertDate}
                onChangeText={setAlertDate}
                placeholder="Enter date (e.g., 2024-12-05)"
              />

              <View style={{ marginTop: 50, alignItems: "center" }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "purple",
                    paddingVertical: 20,
                    width: "90%",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={handleSaveAlert}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Save Alert
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        {/* BottomSheet */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          backgroundStyle={styles.bottomSheetBackground}
        >
          <BottomSheetView style={styles.contentContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.sheetContent}>Add Vitals readings</Text>
              <TouchableOpacity onPress={handleCloseModalPress}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 5, marginTop: 25 }}>
              <View>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                  Temperature (°C)
                </Text>
                <TextInput
                  placeholder="37.5"
                  keyboardType="numeric"
                  onChangeText={(fever) => setFever(fever)}
                  style={{
                    padding: 10,
                    borderWidth: 0.5,
                    borderColor: "gray",
                    borderRadius: 5,
                    marginBottom: 20,
                    color: "grey",
                  }}
                />
              </View>
              <View>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                  Any Cough
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={cough}
                    onValueChange={(value) => setCough(value)}
                    style={styles.picker}
                    itemStyle={{
                      color: "black",
                      fontSize: 14,
                    }}
                  >
                    <Picker.Item label="No" value="0" />
                    <Picker.Item label="Yes" value="1" />
                  </Picker>
                  {/* Dropdown arrow for iOS */}
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color="#000"
                      style={styles.dropdownIcon}
                    />
                  )}
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                  Shortness of Breath
                </Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={breath}
                    onValueChange={(value) => setBreathingDifficulty(value)}
                    style={styles.picker}
                    itemStyle={{
                      color: "black",
                      fontSize: 14,
                    }}
                  >
                    <Picker.Item label="No" value="0" />
                    <Picker.Item label="Yes" value="1" />
                  </Picker>
                  {/* Dropdown arrow for iOS */}
                  {Platform.OS === "ios" && (
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color="#000"
                      style={styles.dropdownIcon}
                    />
                  )}
                </View>
              </View>
            </View>

            <View style={{ marginTop: 50, alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "purple",
                  paddingVertical: 20,
                  width: "90%",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={RecordVitals}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                  >
                    Record Vitals
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: "white",
    flex: 1,
    paddingVertical: 10,
  },
  gradientSection: {
    padding: 20,
    backgroundColor: Colors.light.primary,
    margin: 10,
    borderRadius: 20,
    marginVertical: 20,
    elevation: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientText: { color: "white", fontWeight: "bold" },
  gradientContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  readings: { marginTop: 15, gap: 5 },
  addButton: {
    borderRadius: 90,
    padding: 10,
    width: 50,
    height: 50,
    backgroundColor: "white",
    elevation: 7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: "center",
    alignItems: "center",
  },
  remindersSection: { marginBottom: 30, paddingEnd: 20 },
  sectionTitle: { marginStart: 20, fontWeight: "bold", marginBottom: 10 },
  reminderList: { marginVertical: 10, marginStart: 20 },
  reminderItem: { alignItems: "center", gap: 5 },
  reminderCard: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  reminderLabel: {
    color: Colors.light.text,
    fontSize: 12,
    fontWeight: "300",
  },
  appointmentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 7,
    backgroundColor: "white",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  bottomSheetBackground: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 }, // Shadow at the top of the BottomSheet
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  sheetContent: {
    fontSize: 16,
    fontWeight: "bold",
    color: "purple",
  },
  closeButton: {
    color: "blue",
    fontSize: 14,
  },
  pickerContainer: {
    position: "relative",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    flexDirection: "row", // To position the dropdown arrow properly
    alignItems: "center", // Vertically align Picker in the container
    paddingHorizontal: 10, // Add some padding for spacing
  },
  picker: {
    flex: 1, // Allow Picker to take up available space
    color: "black",
    fontSize: 14,
  },
  dropdownIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  teminderCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 7,
    backgroundColor: "white",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    borderRadius: 10,
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: "gray",
  },
});
