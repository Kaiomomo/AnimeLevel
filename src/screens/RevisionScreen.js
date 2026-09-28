import { Pressable, StyleSheet, Text, View } from "react-native";

export default function RevisionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>REVISION SESSION</Text>

      <Text style={styles.focusText}>FOCUS</Text>

      <Text style={styles.timer}>00:00</Text>

      <Text style={styles.message}>
        Stay focused. Your progress is building.
      </Text>

      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>BACK</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D12",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  label: {
    color: "#8E8E9A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },

  focusText: {
    color: "#7C5CFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 3,
    marginTop: 35,
  },

  timer: {
    color: "#FFFFFF",
    fontSize: 72,
    fontWeight: "900",
    marginTop: 12,
  },

  message: {
    color: "#8E8E9A",
    fontSize: 14,
    textAlign: "center",
    marginTop: 14,
  },

  backButton: {
    width: "100%",
    height: 58,
    backgroundColor: "#181820",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
