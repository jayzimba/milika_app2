import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        start={{ x: 1, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={["#FFFFFF", "purple"]}
        style={{ padding: 20, flex: 1, justifyContent: "flex-end" }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.title}>Your Child's Health Matters</Text>
          <Text style={styles.subTitle}>Your Child's Health Matters</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/signUp")}
          >
            <Text style={styles.buttonText}>Get started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    color: Colors.light.tint,
    fontSize: 40,
    fontWeight: "bold",
  },
  subTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "400",
  },
});
