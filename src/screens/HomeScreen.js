import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MAX_LEVEL, SECONDS_PER_LEVEL } from "../constants/progression";

const characterStages = [
  {
    minLevel: 0,
    form: "Rookie",
    image: require("../../assets/characters/stage1.png"),
  },
  {
    minLevel: 10,
    form: "Awakened",
    image: require("../../assets/characters/stage2.png"),
  },
  {
    minLevel: 25,
    form: "Warrior",
    image: require("../../assets/characters/stage3.png"),
  },
  {
    minLevel: 50,
    form: "Elite",
    image: require("../../assets/characters/stage4.png"),
  },
  {
    minLevel: 75,
    form: "Ascended",
    image: require("../../assets/characters/stage5.png"),
  },
  {
    minLevel: 100,
    form: "Final Form",
    image: require("../../assets/characters/stage6.png"),
  },
];

export default function HomeScreen({ navigation, totalSeconds }) {
  const secondsPerLevel = SECONDS_PER_LEVEL;

  // Work out the user's level and stop it at Level 100
  const calculatedLevel = Math.floor(totalSeconds / secondsPerLevel);
  const level = Math.min(calculatedLevel, MAX_LEVEL);

  // Find which character form should be displayed
  let currentCharacter = characterStages[0];

  characterStages.forEach((stage) => {
    if (level >= stage.minLevel) {
      currentCharacter = stage;
    }
  });

  // Check if the user has reached the maximum level
  const isMaxLevel = level === MAX_LEVEL;

  // Calculate progress toward the next level
  const secondsIntoLevel = totalSeconds % secondsPerLevel;
  const minutesIntoLevel = Math.floor(secondsIntoLevel / 60);

  const progressPercentage = isMaxLevel
    ? 100
    : (secondsIntoLevel / secondsPerLevel) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ANIME LEVEL</Text>
          <Text style={styles.subtitle}>Your Journey Starts Here</Text>
        </View>

        <Pressable style={styles.profileButton}>
          <Text style={styles.profileText}>0</Text>
        </Pressable>
      </View>

      {/* Character */}
      <View style={styles.characterContainer}>
        <Image source={currentCharacter.image} style={styles.characterImage} />

        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>
            {currentCharacter.form.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Level */}
      <Text style={styles.level}>LEVEL {level}</Text>

      {/* Progress information */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>PROGRESS</Text>

        <Text style={styles.progressText}>
          {isMaxLevel ? "MAX LEVEL" : `${minutesIntoLevel} / 60 MINUTES`}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progressPercentage}%` }]}
        />
      </View>

      {/* Revision button */}
      <Pressable
        style={styles.reviseButton}
        onPress={() => navigation.navigate("Revision")}
      >
        <Text style={styles.reviseButtonText}>REVISE</Text>
      </Pressable>

      <Text style={styles.reviseHint}>
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

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#8E8E9A",
    fontSize: 13,
    marginTop: 4,
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

  characterImage: {
    width: "90%",
    height: 230,
    resizeMode: "contain",
  },

  rankBadge: {
    backgroundColor: "#7C5CFF",
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 8,
  },

  rankText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  level: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1,
  },

  progressHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 10,
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
    height: "100%",
    backgroundColor: "#7C5CFF",
    borderRadius: 6,
  },

  reviseButton: {
    width: "100%",
    height: 58,
    backgroundColor: "#7C5CFF",
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

  reviseHint: {
    color: "#666672",
    fontSize: 12,
    marginTop: 12,
  },
});
