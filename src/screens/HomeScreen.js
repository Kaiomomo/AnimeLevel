import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { characterStages } from "../constants/characters";
import { MAX_LEVEL, SECONDS_PER_LEVEL } from "../constants/progression";

export default function HomeScreen({ navigation, totalSeconds = 0 }) {
  // Calculate the user's current level
  const level = Math.min(
    Math.floor(totalSeconds / SECONDS_PER_LEVEL),
    MAX_LEVEL,
  );

  // Calculate progress towards the next level
  const secondsIntoLevel = totalSeconds % SECONDS_PER_LEVEL;
  const minutesIntoLevel = Math.floor(secondsIntoLevel / 60);

  const progressPercentage =
    level >= MAX_LEVEL ? 100 : (secondsIntoLevel / SECONDS_PER_LEVEL) * 100;

  // Find the correct anime character evolution
  let currentCharacter = characterStages[0];

  characterStages.forEach((stage) => {
    if (level >= stage.minLevel) {
      currentCharacter = stage;
    }
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ANIME LEVEL</Text>
          <Text style={styles.subtitle}>Your Journey Starts Here</Text>
        </View>

        <Pressable
          style={styles.profileButton}
          onPress={() => navigation.navigate("Stats")}
        >
          <Text style={styles.profileText}>{level}</Text>
        </Pressable>
      </View>

      <View style={styles.characterCard}>
        <Text style={styles.sectionLabel}>YOUR CHARACTER</Text>

        <View style={styles.characterGlow}>
          <Image
            source={currentCharacter.image}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>
            {currentCharacter.form.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.levelText}>LEVEL {level}</Text>
        <Text style={styles.characterHint}>
          Every hour of revision makes you stronger.
        </Text>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.sectionLabel}>PROGRESS</Text>
          <Text style={styles.progressMinutes}>
            {level >= MAX_LEVEL
              ? "MAX LEVEL"
              : `${minutesIntoLevel} / 60 MINUTES`}
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>

        <Text style={styles.progressHint}>
          {level >= MAX_LEVEL
            ? "You have reached your final form!"
            : `Keep studying to reach Level ${level + 1}`}
        </Text>
      </View>

      <Pressable
        style={styles.reviseButton}
        onPress={() => navigation.navigate("Revision")}
      >
        <Text style={styles.reviseButtonText}>START REVISION</Text>
      </Pressable>

      <Text style={styles.bottomHint}>Focus. Study. Level up.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D12",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 65,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  subtitle: {
    color: "#8C8C9B",
    fontSize: 13,
    marginTop: 5,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7C5CFF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  characterCard: {
    backgroundColor: "#181820",
    borderRadius: 25,
    padding: 22,
    alignItems: "center",
    marginBottom: 20,
  },
  sectionLabel: {
    color: "#A0A0B0",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  characterGlow: {
    width: "100%",
    height: 265,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    backgroundColor: "#222038",
    borderRadius: 25,
  },
  characterImage: {
    width: "95%",
    height: "95%",
  },
  rankBadge: {
    backgroundColor: "#30264F",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  rankText: {
    color: "#B9A5FF",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  levelText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },
  characterHint: {
    color: "#858595",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  progressCard: {
    backgroundColor: "#181820",
    padding: 22,
    borderRadius: 22,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  progressMinutes: {
    color: "#B9A5FF",
    fontSize: 12,
    fontWeight: "700",
  },
  progressBar: {
    height: 12,
    backgroundColor: "#302F3B",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7C5CFF",
    borderRadius: 10,
  },
  progressHint: {
    color: "#858595",
    fontSize: 12,
    marginTop: 12,
  },
  reviseButton: {
    backgroundColor: "#7C5CFF",
    paddingVertical: 19,
    borderRadius: 18,
    alignItems: "center",
  },
  reviseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
  bottomHint: {
    color: "#777788",
    textAlign: "center",
    fontSize: 12,
    marginTop: 18,
  },
});
