import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { MAX_LEVEL, SECONDS_PER_LEVEL } from "../constants/progression";

const evolutions = [
  {
    level: 10,
    form: "Awakened",
    image: require("../../assets/characters/stage2.png"),
  },
  {
    level: 25,
    form: "Warrior",
    image: require("../../assets/characters/stage3.png"),
  },
  {
    level: 50,
    form: "Elite",
    image: require("../../assets/characters/stage4.png"),
  },
  {
    level: 75,
    form: "Ascended",
    image: require("../../assets/characters/stage5.png"),
  },
  {
    level: 100,
    form: "Final Form",
    image: require("../../assets/characters/stage6.png"),
  },
];

export default function SessionCompleteScreen({
  navigation,
  route,
  totalSeconds,
}) {
  // Time completed during this session
  const sessionSeconds = route.params?.sessionSeconds || 0;
  const previousTotalSeconds = totalSeconds - sessionSeconds;
  const calculatedPreviousLevel = Math.floor(
    previousTotalSeconds / secondsPerLevel,
  );
  const previousLevel = Math.min(calculatedPreviousLevel, MAX_LEVEL);

  const sessionMinutes = Math.floor(sessionSeconds / 60);
  const remainingSessionSeconds = sessionSeconds % 60;

  // Level calculations
  const secondsPerLevel = SECONDS_PER_LEVEL;

  const calculatedLevel = Math.floor(totalSeconds / secondsPerLevel);
  const level = Math.min(calculatedLevel, MAX_LEVEL);
  const didLevelUp = level > previousLevel;

  const evolution = evolutions.find((evolution) => {
    return previousLevel < evolution.level && level >= evolution.level;
  });

  const evolutionScale = useRef(new Animated.Value(0.4)).current;
  const evolutionOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (didEvolve) {
      Animated.parallel([
        Animated.spring(evolutionScale, {
          toValue: 1,
          friction: 4,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(evolutionOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [didEvolve]);
  const didEvolve = evolution !== undefined;

  const isMaxLevel = level == MAX_LEVEL;
  const secondsIntoLevel = totalSeconds % secondsPerLevel;

  const minutesIntoLevel = Math.floor(secondsIntoLevel / 60);
  const progressPercentage = isMaxLevel
    ? 100
    : (secondsIntoLevel / secondsPerLevel) * 100;
  return (
    <View style={[styles.container, didEvolve && styles.evolutionContainer]}>
      <Text style={styles.smallTitle}>SESSION COMPLETE</Text>

      <View style={styles.checkCircle}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.title}>
        {didEvolve
          ? "CHARACTER EVOLVED!"
          : didLevelUp
            ? "LEVEL UP!"
            : "NICE WORK!"}
      </Text>

      <Text style={styles.message}>
        {isMaxLevel
          ? `You reached level ${level}! Your Character evolved into ${evolution.form}!`
          : didLevelUp
            ? `You reached Level ${level}! Your power has increased.`
            : "Your training is paying off, Keep pushing toward your next level"}
      </Text>

      {didEvolve && (
        <View style={styles.evolutionCard}>
          <Text styles={styles.evolutionLabel}>⚡ EVOLUTION UNLOCKED ⚡</Text>

          <Animated.Image
            source={evolution.image}
            style={[
              styles.evolutionImage,
              {
                opacity: evolutionOpacity,
                transform: [{ scale: evolutionScale }],
              },
            ]}
          />

          <Text styles={styles.evolutionForm}>
            {evolution.form.toUpperCase()}
          </Text>
          <Text styles={styles.evolutionLevel}>Level{evolution.level} </Text>
        </View>
      )}

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
  evolutionImage: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    marginTop: 10,
  },

  earnedText: {
    color: "#7C5CFF",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
    letterSpacing: 1,
  },
  evolutionCard: {
    width: "100%",
    backgroundColor: "#21183D",
    borderWidth: 2,
    borderColor: "#7C5CFF",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 24,
  },

  evolutionLabel: {
    color: "#B9A7FF",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
  },

  evolutionForm: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 12,
  },

  evolutionLevel: {
    color: "#8E8E9A",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 8,
  },
  evolutionContainer: {
    backgroundColor: "#120D24",
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
