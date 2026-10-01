import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen({ navigation, totalSeconds }) {
  const secondsPerLevel = 60 * 60;
  const level = Math.floor(totalSeconds / secondsPerLevel);

  let characterStage = 1;
  if (level >= 100) {
    characterStage = 6;
  } else if (level >= 75) {
    characterStage = 5;
  } else if (level >= 50) {
    characterStage = 4;
  } else if (level >= 25) {
    characterStage = 3;
  } else if (level >= 10) {
    characterStage = 2;
  }

  let characterImage;
  if (characterStage == 1) {
    characterImage = require("../../assets/characters/stage1.png");
  } else if (characterStage == 2) {
    characterImage = require("../../assets/characters/stage2.png");
  }

  let characterForm = "Rookie";
  if (characterStage == 6) {
    characterForm = "Final Form";
  } else if (characterStage == 5) {
    characterForm = "Ascended";
  } else if (characterStage == 4) {
    characterForm = "Elite";
  } else if (characterStage == 3) {
    characterForm = "Warrior";
  } else if (characterStage) {
    characterForm = "Awakened";
  }

  const secondsIntoLevel = totalSeconds % secondsPerLevel;
  const minutesIntoLevel = Math.floor(secondsIntoLevel / 60);
  const progressPercentage = (secondsIntoLevel / secondsPerLevel) * 100;

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
        <Image source={characterImage} style={styles.characterImage} />

        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{characterForm.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.level}>LEVEL {level}</Text>

      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>PROGRESS</Text>
        <Text style={styles.progressText}>{minutesIntoLevel} / 60 MINUTES</Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${progressPercentage}%` }]}
        />
      </View>

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

  characterPlaceholder: {
    color: "#7C5CFF",
    fontSize: 42,
    fontWeight: "800",
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
