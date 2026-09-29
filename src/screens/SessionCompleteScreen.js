import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SessionCompleteScreen({ navigation, route }) {
  const sessionSeconds = route.params?.sessionSeconds || 0;

  const sessionMinutes = Math.floor(sessionSeconds / 60);
  const remainingSeconds = sessionSeconds % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.smallTitle}>SESSION COMPLETE</Text>

      <Text style={styles.completeIcon}>✓</Text>

      <Text style={styles.title}>NICE WORK!</Text>

      <Text style={styles.message}>
        Another session completed. Keep building your level.
      </Text>

      <View style={styles.sessionCard}>
        <Text style={styles.cardLabel}>TIME STUDIED</Text>

        <Text style={styles.sessionTime}>
          {sessionMinutes}:{remainingSeconds.toString().padStart(2, "0")}
        </Text>
      </View>

      <Pressable
        style={styles.continueButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.continueButtonText}>CONTINUE</Text>
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

  smallTitle: {
    color: "#8E8E9A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },

  completeIcon: {
    color: "#7C5CFF",
    fontSize: 64,
    fontWeight: "900",
    marginTop: 25,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 10,
  },

  message: {
    color: "#8E8E9A",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 12,
  },

  sessionCard: {
    width: "100%",
    backgroundColor: "#181820",
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 28,
    marginTop: 40,
  },

  cardLabel: {
    color: "#8E8E9A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },

  sessionTime: {
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    marginTop: 8,
  },

  continueButton: {
    width: "100%",
    height: 58,
    backgroundColor: "#7C5CFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});
