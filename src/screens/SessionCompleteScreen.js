import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SessionCompleteScreen({
  navigation,
  route,
  totalSeconds,
}) {
  // Time completed during this session
  const sessionSeconds = route.params?.sessionSeconds || 0;
  const previousTotalSeconds = totalSeconds - sessionSeconds;
  const previousLevel = Math.floor(previousTotalSeconds / (60 * 60));

  const sessionMinutes = Math.floor(sessionSeconds / 60);
  const remainingSessionSeconds = sessionSeconds % 60;

  // Level calculations
  const secondsPerLevel = 10;

  const level = Math.floor(totalSeconds / secondsPerLevel);
  const didLevelUp = level > previousLevel;

  const secondsIntoLevel = totalSeconds % secondsPerLevel;

  const minutesIntoLevel = Math.floor(secondsIntoLevel / 60);

  const progressPercentage = (secondsIntoLevel / secondsPerLevel) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.smallTitle}>SESSION COMPLETE</Text>

      <View style={styles.checkCircle}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.title}>
        {didLevelUp ? "LEVEL UP!" : "NICE WORK!"}
      </Text>

      <Text style={styles.message}>
        {didLevelUp
          ? `you reached Level ${level}! Your power has increased.`
          : "Your training is paying off, Keep pushing toward your next level"}
      </Text>

      <View style={styles.sessionCard}>
        <Text style={styles.cardLabel}>TIME STUDIED</Text>

        <Text style={styles.sessionTime}>
          {sessionMinutes}:{remainingSessionSeconds.toString().padStart(2, "0")}
        </Text>

        <Text style={styles.earnedText}>+{sessionMinutes} MINUTES</Text>
      </View>

      <View style={styles.levelSection}>
        <View style={styles.levelHeader}>
          <Text style={styles.levelText}>LEVEL {level}</Text>

          <Text style={styles.progressText}>{minutesIntoLevel} / 60 MIN</Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>

        <Text style={styles.nextLevelText}>
          KEEP GOING — LEVEL {level + 1} AWAITS
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

  checkCircle: {
    width: 85,
    height: 85,
    borderRadius: 43,
    backgroundColor: "#181820",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  check: {
    color: "#7C5CFF",
    fontSize: 48,
    fontWeight: "900",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 20,
  },

  message: {
    color: "#8E8E9A",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
  },

  sessionCard: {
    width: "100%",
    backgroundColor: "#181820",
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 24,
    marginTop: 30,
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
    marginTop: 6,
  },

  earnedText: {
    color: "#7C5CFF",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
    letterSpacing: 1,
  },

  levelSection: {
    width: "100%",
    marginTop: 30,
  },

  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  levelText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  progressText: {
    color: "#8E8E9A",
    fontSize: 12,
    fontWeight: "700",
  },

  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#24242E",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 12,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#7C5CFF",
    borderRadius: 6,
  },

  nextLevelText: {
    color: "#666672",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: 12,
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
