import Header from "@/components/Header";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "react-native/Libraries/NewAppScreen";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Feather, FontAwesome5, Fontisto } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import { useRouter } from "expo-router";

export default function DoctorScreen() {
  const router = useRouter();
  const [doctorName, setDoctorName] = useState("");
  const [doctorNumber, setDoctorNumber] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [DoctorData, setDoctorData] = useState([]);
  const [Doctor, setDoctor] = useState({});
  const [hasDoctor, setHasDoctor] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Add this state

  const initializeDatabase = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("childApp.db");

      // Check if any records exist
      const fetchedRecords = await db.getAllAsync("SELECT * FROM Doctor");
      if (fetchedRecords.length > 0) {
        setDoctorData(fetchedRecords);
        setDoctor(fetchedRecords[0]);
        setHasDoctor(true);
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  };

  useEffect(() => {
    initializeDatabase();
  }, [refreshKey]);

  // Handle form submission
  const onBoardDoctor = async () => {
    setLoading(true);
    if (!doctorName || !doctorNumber || !hospitalName || !email) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync("childApp.db");

      // Insert data into the database
      await db.runAsync(
        "INSERT INTO Doctor (name, phone, email, hospital) VALUES (?, ?, ?, ?);",
        [doctorName, doctorNumber, email, hospitalName]
      );

      Alert.alert("Success", "Doctor onboarded successfully!");
      setDoctorName("");
      setDoctorNumber("");
      setEmail("");
      setHospitalName("");

      setRefreshKey((prev) => prev + 1);

      // Fetch updated records and navigate
      const updatedChildren = await db.getAllAsync("SELECT * FROM children");
    } catch (error) {
      console.error("Error onboarding Doctor:", error);
      Alert.alert("Error", "Failed to onboard the Doctor.");
    } finally {
      setLoading(false);
    }
  };
  const deleteDoctor = async () => {
    setLoading(true);

    try {
      const db = await SQLite.openDatabaseAsync("childApp.db");

      // Insert data into the database
      await db.runAsync("DELETE FROM Doctor;");

      Alert.alert("Success", "Doctor records deleted successfully!");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error onboarding Doctor:", error);
      Alert.alert("Error", "Failed to delete the Doctor.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <Header />
      <View style={{ paddingHorizontal: 20 }}>
        {!hasDoctor && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingVertical: 20, paddingBottom: 200 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
                Do you want to onboard a personal doctor?
              </Text>

              <View style={{ marginVertical: 10 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.light.icon,
                    fontWeight: "400",
                  }}
                >
                  Your doctor will receive all the symptoms you log on the app
                  via email, this will allow him to give you quick response
                  based on the case recorded.
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    marginBottom: 20,
                    marginTop: 10,
                  }}
                >
                  To continue you have to update this form records.
                </Text>
              </View>

              {/* input section goes here */}
              <View>
                {/* doctor's name inout */}
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 0.2,
                    borderColor: Colors.light.icon,
                    padding: 10,
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 7,
                    }}
                  >
                    <FontAwesome6 name="user-doctor" size={18} color="black" />
                    <Text
                      style={{
                        fontWeight: "300",
                        fontSize: 12,
                        color: "purple",
                      }}
                    >
                      Doctor Name
                    </Text>
                  </View>
                  <TextInput
                    value={doctorName}
                    onChangeText={setDoctorName}
                    selectionColor={"purple"}
                    placeholderTextColor={"gray"}
                    placeholder="Enter doctor name"
                    style={{
                      marginStart: 15,
                      fontSize: 16,
                    }}
                  />
                </View>

                {/* doctor's phone number inout */}
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 0.2,
                    borderColor: Colors.light.icon,
                    padding: 10,
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 7,
                    }}
                  >
                    <FontAwesome6 name="phone" size={18} color="black" />
                    <Text
                      style={{
                        fontWeight: "300",
                        fontSize: 12,
                        color: "purple",
                      }}
                    >
                      Phone number
                    </Text>
                  </View>
                  <TextInput
                    value={doctorNumber}
                    onChangeText={setDoctorNumber}
                    selectionColor={"purple"}
                    keyboardType="phone-pad"
                    placeholderTextColor={"gray"}
                    placeholder="Enter phone number"
                    style={{
                      marginStart: 15,
                      fontSize: 16,
                    }}
                  />
                </View>

                {/* doctor's email input */}
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 0.2,
                    borderColor: Colors.light.icon,
                    padding: 10,
                    marginBottom: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 7,
                    }}
                  >
                    <Fontisto name="email" size={18} color="black" />
                    <Text
                      style={{
                        fontWeight: "300",
                        fontSize: 12,
                        color: "purple",
                      }}
                    >
                      Doctor Email
                    </Text>
                  </View>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    selectionColor={"purple"}
                    keyboardType="default"
                    autoCapitalize="none"
                    placeholderTextColor={"gray"}
                    placeholder="Enter doctor email"
                    style={{
                      marginStart: 15,
                      fontSize: 16,
                    }}
                  />
                </View>

                {/* doctor's hospital input */}
                <View
                  style={{
                    borderRadius: 10,
                    borderWidth: 0.2,
                    borderColor: Colors.light.icon,
                    padding: 10,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      marginBottom: 7,
                    }}
                  >
                    <FontAwesome5 name="hospital" size={18} color="black" />
                    <Text
                      style={{
                        fontWeight: "300",
                        fontSize: 12,
                        color: "purple",
                      }}
                    >
                      Hospital Name
                    </Text>
                  </View>
                  <TextInput
                    value={hospitalName}
                    onChangeText={setHospitalName}
                    selectionColor={"purple"}
                    keyboardType="default"
                    placeholderTextColor={"gray"}
                    placeholder="Enter hospital name"
                    style={{
                      marginStart: 15,
                      fontSize: 16,
                    }}
                  />
                </View>
              </View>

              {/* inputs end here */}

              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  borderWidth: 0.2,
                  backgroundColor: "purple",
                  padding: 15,
                  marginVertical: 30,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={onBoardDoctor}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  OnBoard Doctor
                </Text>
              </TouchableOpacity>

              {loading && (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <ActivityIndicator size={"large"} color={"purple"} />
                  <Text
                    style={{
                      color: Colors.light.icon,
                      marginTop: 10,
                      fontSize: 12,
                    }}
                  >
                    Loading
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
        {hasDoctor && (
          <View style={{ paddingVertical: 20 }}>
            <View style={styles.rowDisplay}>
              <FontAwesome6 name="user-doctor" size={24} color="black" />
              <Text>{Doctor.name}</Text>
            </View>
            <View style={styles.rowDisplay}>
              <Feather name="phone" size={24} color="black" />
              <Text>{Doctor.phone}</Text>
            </View>
            <View style={styles.rowDisplay}>
              <Fontisto name="email" size={24} color="black" />
              <Text>{Doctor.email}</Text>
            </View>
            <View style={styles.rowDisplay}>
              <FontAwesome5 name="hospital" size={24} color="black" />
              <Text>{Doctor.hospital}</Text>
            </View>

            <TouchableOpacity
              style={{
                borderRadius: 10,
                borderWidth: 0.2,
                backgroundColor: "purple",
                padding: 15,
                marginVertical: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={deleteDoctor}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Delete Records
              </Text>
            </TouchableOpacity>

            {loading && (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size={"large"} color={"purple"} />
                <Text
                  style={{
                    color: Colors.light.icon,
                    marginTop: 10,
                    fontSize: 12,
                  }}
                >
                  Loading
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 23,
    marginStart: 10,
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
    marginStart: 20,
    marginEnd: 20,
    marginBottom: 20,
  },
  rowDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});
