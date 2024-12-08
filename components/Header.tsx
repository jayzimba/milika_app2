import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingEnd: 20,
        }}
      >
        <View>
          <Text style={styles.headerText}>Milika's Monitor</Text>
          <Text style={styles.subText}>A healthy me makes mom happy</Text>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: "#e5e5e5" }}></View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    gap: 8,
    marginStart: 10,
    marginTop: Platform.OS == "android" ? 40 : 0,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "purple",
  },
  subText: {
    fontSize: 12,
    color: "#687076",
  },
});
