import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const ReminderItem = (props: {
  passed: boolean;
  date: string;
  title: string;
  time: string;
}) => {
  const { passed, date, title, time } = props;
  return (
    <View
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
    </View>
  );
};

export default ReminderItem;

const styles = StyleSheet.create({
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
});
