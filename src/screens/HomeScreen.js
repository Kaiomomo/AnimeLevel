import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ANIME LEVEL</Text>

      <View style={styles.characterContainer}>
        <Text style={styles.characterPlaceholder}>CHARACTER</Text>
      </View>

      <Text style={styles.level}>LEVEL 0</Text>

      <Text style={styles.progressText}>0 / 100 HOURS</Text>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <Pressable style={styles.reviseButton}>
        <Text style={styles.reviseButtonText}>REVISE</Text>
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
    paddingHorizontal: 30,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 40,
  },

  characterContainer: {
    width: 220,
    height: 280,
    borderRadius: 24,
    backgroundColor: "#181820",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  characterPlaceholder: {
    color: "#55555F",
    fontSize: 16,
    fontWeight: "600",
  },

  level: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
  },

  progressText: {
    color: "#8E8E9A",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },

  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#24242E",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    width: "0%",
    height: "100%",
    backgroundColor: "#7C5CFF",
  },

  reviseButton: {
    width: "100%",
    backgroundColor: "#7C5CFF",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 35,
  },

  reviseButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
