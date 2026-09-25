import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ANIME LEVEL</Text>
          <Text style={styles.subtitle}>Your Journey Starts Here</Text>
        </View>

        <Pressable style={styles.profileButton}>
          <Text style={styles.profileText}>0</Text>
        </Pressable>
      </View>

      <View style={styles.characterContainer}>
        <View style={styles.characterGlow}>
          <Text style={styles.characterPlaceholder}>?</Text>
        </View>

        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>BEGINNER</Text>
        </View>
      </View>

      <Text style={styles.level}>LEVEL 0</Text>

      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>PROGRESS</Text>
        <Text style={styles.progressText}>0 / 60 MINUTES</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={styles.progressFill} />
      </View>

      <Pressable style={styles.reviseButton}>
        <Text style={styles.reviseButtonText}>REVISE</Text>
      </Pressable>
      <Text style={styles.reviseHint}>
        {" "}
        Start a study session and earn progress
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D12",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtitle: {
    color: "#8E8E9A",
    fontSize: 13,
    marginTop: 4,
  },

  characterContainer: {
    width: "100%",
    height: 300,
    borderRadius: 28,
    backgroundColor: "#181820",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,
    marginBottom: 28,
    overflow: "hidden",
  },

  characterPlaceholder: {
    color: "#7C5CFF",
    fontSize: 42,
    fontWeight: "800",
  },

  characterGlow: {
    width: 100,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#242432",
    alignItems: "center",
    justifyContent: "center",
  },

  level: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#7C5CFF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  progressText: {
    color: "#8E8E9A",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  progressHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBotoom: 10,
  },

  progressLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  progressText: {
    color: "#8E8E9A",
    fontSize: 12,
    fontWeight: "600",
  },

  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#24242E",
    borderRadius: 6,
    overflow: "hidden",
  },

  progressFill: {
    width: "0%",
    height: "100%",
    backgroundColor: "#7C5CFF",
    borderRadius: 6,
  },

  rankBadge: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#7C5CFF",
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
  },
  rankText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  reviseHint: {
    color: "#666672",
    fontSize: 12,
    marginTop: 12,
  },

  reviseButton: {
    width: "100%",
    height: 58,
    backgroundColor: "#7C5CFF",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },

  reviseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});
