import React, { useState } from "react";
import Header from "@/components/Header";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { FontAwesome5 } from "@expo/vector-icons";

export default function LogScreen() {
  // State variables for each input field
  const [age, setAge] = useState("0");
  const [fever, setFever] = useState("0");
  const [cough, setCough] = useState("0");
  const [fatigue, setFatigue] = useState("0");
  const [headache, setHeadache] = useState("0");
  const [breathingDifficulty, setBreathingDifficulty] = useState("0");
  const [chestPain, setChestPain] = useState("0");
  const [muscleStiffness, setMuscleStiffness] = useState("0");
  const [pain, setPain] = useState("0");
  const [seizures, setSeizures] = useState("0");
  const [fatigueCp, setFatigueCp] = useState("0");
  const [breathingDifficultyCp, setBreathingDifficultyCp] = useState("0");

  const [colorCode, setColorCode] = useState("green");
  const [diagnosisLeveles, setDiagnosisLeveles] = useState("0");
  const [severityLeveles, setSeverityLeveles] = useState("0");

  // Function to handle form submission
  const handleSubmit = () => {
    const data = {
      age: parseFloat(age),
      fever: parseFloat(fever),
      cough: parseFloat(cough),
      fatigue: parseFloat(fatigue),
      headache: parseFloat(headache),
      breathing_difficulty: parseFloat(breathingDifficulty),
      chest_pain: parseFloat(chestPain),
      muscle_stiffness: parseFloat(muscleStiffness),
      pain: parseFloat(pain),
      seizures: parseFloat(seizures),
      fatigue_cp: parseFloat(fatigueCp),
      breathing_difficulty_cp: parseFloat(breathingDifficultyCp),
    };

    // replace this replace-with-local-ipaddress with local IP address
    // to get your ip address try this below
    // On Windows: Run ipconfig and look for the "IPv4 Address."
    // On macOS/Linux: Run ifconfig and look for inet.
    
    fetch("http://replace-with-local-ipaddress:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        Alert.alert(
          "Prediction",
          `Diagnosis: ${responseData.diagnosis}\n${responseData.severity}`
        );

        setColorCode(responseData.severity);
        setDiagnosisLeveles(responseData.confidence.diagnosis);
        setSeverityLeveles(responseData.confidence.severity);
        console.log(responseData);
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to get prediction. Please try again.");
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
      <Header />
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ paddingVertical: 20 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 20 }}>
            How is your child performing today?
          </Text>
          <Text style={{ fontSize: 12, color: "#666", fontWeight: "400" }}>
            Complete the form below to get predictions and recommendations for
            your child.
          </Text>

          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={[colorCode, colorCode, "yellow"]}
            style={styles.gradientSection}
          >
            <View style={styles.gradientContent}>
              <View
                style={{
                  borderRadius: 5,
                  gap: 3,
                }}
              >
                <Text
                  style={{
                    backgroundColor: "white",
                    padding: 5,
                    borderRadius: 5,
                    gap: 3,
                  }}
                >
                  Confidence Levels: {parseFloat(severityLeveles) * 100}%
                </Text>
                <Text
                  style={{
                    backgroundColor: "white",
                    padding: 5,
                    borderRadius: 5,
                    gap: 3,
                  }}
                >
                  Confidence Levels: {parseFloat(diagnosisLeveles) * 100}%
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Form Inputs using Picker */}
          <View style={styles.form}>
            <Text style={styles.label}>Age</Text>
            <Picker
              selectedValue={age}
              onValueChange={(value) => setAge(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="Select Age" value="0" />
              <Picker.Item label="1-5 years" value="3" />
              <Picker.Item label="6-10 years" value="8" />
              <Picker.Item label="11-15 years" value="13" />
              <Picker.Item label="16+ years" value="16" />
            </Picker>

            <Text style={styles.label}>Fever</Text>
            <Picker
              selectedValue={fever}
              onValueChange={(value) => setFever(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

            <Text style={styles.label}>Cough</Text>
            <Picker
              selectedValue={cough}
              onValueChange={(value) => setCough(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

            {/* Repeat Picker for other inputs */}
            <Text style={styles.label}>Fatigue</Text>
            <Picker
              selectedValue={fatigue}
              onValueChange={(value) => setFatigue(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

            <Text style={styles.label}>Headache</Text>
            <Picker
              selectedValue={headache}
              onValueChange={(value) => setHeadache(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

            <Text style={styles.label}>Breathing Difficulty</Text>
            <Picker
              selectedValue={breathingDifficulty}
              onValueChange={(value) => setBreathingDifficulty(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

            <Text style={styles.label}>Chest Pain</Text>
            <Picker
              selectedValue={chestPain}
              onValueChange={(value) => setChestPain(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

            <Text style={styles.label}>Muscle Stiffness</Text>
            <Picker
              selectedValue={muscleStiffness}
              onValueChange={(value) => setMuscleStiffness(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

            <Text style={styles.label}>Pain</Text>
            <Picker
              selectedValue={pain}
              onValueChange={(value) => setPain(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

            <Text style={styles.label}>Seizures</Text>
            <Picker
              selectedValue={seizures}
              onValueChange={(value) => setSeizures(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

            <Text style={styles.label}>Fatigue CP</Text>
            <Picker
              selectedValue={fatigueCp}
              onValueChange={(value) => setFatigueCp(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

            <Text style={styles.label}>Breathing Difficulty CP</Text>
            <Picker
              selectedValue={breathingDifficultyCp}
              onValueChange={(value) => setBreathingDifficultyCp(value)}
              style={styles.picker}
              itemStyle={{
                color: "#000",
              }}
            >
              <Picker.Item label="No" value="0" />
              <Picker.Item label="Yes" value="1" />
            </Picker>

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
              onPress={handleSubmit}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    gap: 20,
  },
  form: {
    marginTop: 20,
    paddingBottom: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
});
