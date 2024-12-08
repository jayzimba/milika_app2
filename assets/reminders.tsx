import Header from "@/components/Header";
import ReminderItem from "@/components/ReminderItem";
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function ReminderScreen() {
  
  const reminders = [
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

  return (
    <SafeAreaView
      style={{ paddingHorizontal: 10, backgroundColor: "#fff", flex: 1 }}
    >
      <Header />
      <View style={{ paddingVertical: 20 }}>
        <Text style={{ marginStart: 20, fontWeight: "bold", marginBottom: 20 }}>
          Set Reminders
        </Text>

        <View style={{ height: "100%" }}>
          <FlatList
            data={reminders}
            renderItem={({ item, index=item.id }) => (
              <ReminderItem
                passed={item.passed}
                date={item.date}
                title={item.title}
                time={item.time}
              />
            )}
          />
        </View>
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
});
