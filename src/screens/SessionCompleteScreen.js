import { useEffect, useRef } from "react";

import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { characterStages } from "../constants/characters";
import { MAX_LEVEL, SECONDS_PER_LEVEL } from "../constants/progression";

// Format the completed session time.
function formatSessionTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds,
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function SessionCompleteScreen({
  navigation,
  route,
  totalSeconds = 0,
}) {
  const sessionSeconds = Math.max(0, route.params?.sessionSeconds ?? 0);

  const sessionMinutes = Math.floor(sessionSeconds / 60);
  const sessionTime = formatSessionTime(sessionSeconds);

  // Determine the level before and after the session.
  const previousTotalSeconds = Math.max(0, totalSeconds - sessionSeconds);

  const previousLevel = Math.min(
    Math.floor(previousTotalSeconds / SECONDS_PER_LEVEL),
    MAX_LEVEL,
  );

  const level = Math.min(
    Math.floor(totalSeconds / SECONDS_PER_LEVEL),
    MAX_LEVEL,
  );

  const didLevelUp = level > previousLevel;
  const isMaxLevel = level >= MAX_LEVEL;

  // Use the same character evolution data as Home and Stats.
  const evolution = characterStages.find(
    (stage) => stage.minLevel > previousLevel && stage.minLevel <= level,
  );

  const didEvolve = evolution !== undefined;

  // XP progress towards the next level.
  const secondsIntoLevel = totalSeconds % SECONDS_PER_LEVEL;
  const minutesIntoLevel = Math.floor(secondsIntoLevel / 60);

  const progressPercentage = isMaxLevel
    ? 100
    : (secondsIntoLevel / SECONDS_PER_LEVEL) * 100;

  // Celebration animations.
  const celebrationScale = useRef(new Animated.Value(0.65)).current;

  const celebrationOpacity = useRef(new Animated.Value(0)).current;

  const evolutionScale = useRef(new Animated.Value(0.4)).current;

  const evolutionOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(celebrationScale, {
        toValue: 1,
        friction: 5,
        tension: 65,
        useNativeDriver: true,
      }),

      Animated.timing(celebrationOpacity, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();

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
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    celebrationScale,
    celebrationOpacity,
    didEvolve,
    evolutionScale,
    evolutionOpacity,
  ]);

  const resultTitle = didEvolve
    ? "EVOLUTION!"
    : didLevelUp
      ? "LEVEL UP!"
      : "QUEST CLEARED!";

  const resultMessage = didEvolve
    ? `You've unlocked ${evolution.form}! Your journey has entered a new chapter.`
    : didLevelUp
      ? `You've reached Level ${level}. Your power is growing!`
      : isMaxLevel
        ? "You've mastered your final form. Keep your focus alive."
        : "Another victory on your journey to greatness.";

  return (
    <ScrollView
      style={[styles.container, didEvolve && styles.evolutionBackground]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* VICTORY HEADER */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>✦ CHAPTER COMPLETE ✦</Text>

        <Animated.View
          style={[
            styles.victoryEmblem,
            {
              opacity: celebrationOpacity,
              transform: [{ scale: celebrationScale }],
            },
          ]}
        >
          <View style={styles.emblemOuter}>
            <View style={styles.emblemInner}>
              <Text style={styles.checkmark}>{didEvolve ? "✦" : "✓"}</Text>
            </View>
          </View>
        </Animated.View>

        <Text style={styles.title}>{resultTitle}</Text>

        <Text style={styles.message}>{resultMessage}</Text>
      </View>

      {/* SPECIAL EVOLUTION REVEAL */}
      {didEvolve && (
        <View style={styles.evolutionCard}>
          <Text style={styles.evolutionLabel}>✦ NEW FORM UNLOCKED ✦</Text>

          <View style={styles.evolutionStage}>
            <View style={styles.evolutionAura} />

            <Animated.Image
              source={evolution.image}
              resizeMode="contain"
              style={[
                styles.evolutionImage,
                {
                  opacity: evolutionOpacity,
                  transform: [{ scale: evolutionScale }],
                },
              ]}
            />
          </View>

          <Text style={styles.evolutionName}>
            {evolution.form.toUpperCase()}
          </Text>

          <View style={styles.evolutionBadge}>
            <Text style={styles.evolutionBadgeText}>
              LEVEL {evolution.minLevel}
            </Text>
          </View>

          <Text style={styles.evolutionDescription}>
            A new power has awakened.
          </Text>
        </View>
      )}

      {/* SESSION REWARD */}
      <View style={styles.rewardCard}>
        <View style={styles.rewardHeading}>
          <Text style={styles.rewardLabel}>REVISION REWARD</Text>

          <View style={styles.rewardSymbol}>
            <Text style={styles.rewardSymbolText}>✦</Text>
          </View>
        </View>

        <Text style={styles.timeLabel}>TIME STUDIED</Text>

        <Text style={styles.sessionTime}>{sessionTime}</Text>

        <View style={styles.earnedBadge}>
          <Text style={styles.earnedText}>
            +{sessionMinutes} MINUTES OF FOCUS
          </Text>
        </View>

        <View style={styles.rewardDivider} />

        <View style={styles.levelHeader}>
          <View>
            <Text style={styles.levelCaption}>CURRENT POWER</Text>

            <Text style={styles.levelText}>LEVEL {level}</Text>
          </View>

          <View style={styles.progressRight}>
            <Text style={styles.levelCaption}>NEXT LEVEL XP</Text>

            <Text style={styles.progressPercentage}>
              {Math.floor(progressPercentage)}%
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>

        <View style={styles.progressFooter}>
          <Text style={styles.progressFooterText}>
            {isMaxLevel ? "MAX LEVEL" : `${minutesIntoLevel} / 60 MIN`}
          </Text>

          <Text style={styles.progressFooterText}>
            {isMaxLevel ? "LEGENDARY" : `LEVEL ${level + 1}`}
          </Text>
        </View>
      </View>

      {/* CONTINUE */}
      <Pressable
        style={({ pressed }) => [
          styles.continueButton,
          pressed && styles.continuePressed,
        ]}
        onPress={() => navigation.navigate("Home")}
        accessibilityRole="button"
        accessibilityLabel="Continue to home"
      >
        <Text style={styles.continueText}>CONTINUE JOURNEY</Text>

        <Text style={styles.continueArrow}>→</Text>
      </Pressable>

      <Text style={styles.footer}>✦ EVERY SESSION MAKES YOU STRONGER ✦</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D12",
  },

  evolutionBackground: {
    backgroundColor: "#110D1D",
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 45,
    justifyContent: "center",
  },

  // VICTORY HEADER
  header: {
    alignItems: "center",
    marginBottom: 26,
  },

  eyebrow: {
    color: "#C4B5FD",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
  },

  victoryEmblem: {
    marginTop: 23,
    marginBottom: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  emblemOuter: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "#20172F",
    borderWidth: 1,
    borderColor: "#64478B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A78BFA",
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
  },

  emblemInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#38244F",
    borderWidth: 2,
    borderColor: "#9B75E4",
    alignItems: "center",
    justifyContent: "center",
  },

  checkmark: {
    color: "#E9D5FF",
    fontSize: 49,
    fontWeight: "900",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },

  message: {
    color: "#A99EB9",
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 12,
  },

  // EVOLUTION REVEAL
  evolutionCard: {
    backgroundColor: "#241936",
    borderRadius: 26,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#9565E0",
    marginBottom: 22,
    shadowColor: "#A78BFA",
    shadowOpacity: 0.25,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
  },

  evolutionLabel: {
    color: "#D8C8FF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  evolutionStage: {
    height: 225,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  evolutionAura: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#392253",
    borderWidth: 1,
    borderColor: "#694597",
  },

  evolutionImage: {
    width: 215,
    height: 215,
  },

  evolutionName: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    marginTop: 5,
  },

  evolutionBadge: {
    backgroundColor: "#44305F",
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 12,
  },

  evolutionBadgeText: {
    color: "#E9D5FF",
    fontSize: 12,
    fontWeight: "900",
  },

  evolutionDescription: {
    color: "#B4A4C9",
    fontSize: 12,
    marginTop: 13,
  },

  // REWARD CARD
  rewardCard: {
    backgroundColor: "#1D172A",
    borderRadius: 25,
    padding: 22,
    borderWidth: 1,
    borderColor: "#4C3866",
  },

  rewardHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  rewardLabel: {
    color: "#C4B5FD",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  rewardSymbol: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#38274D",
    alignItems: "center",
    justifyContent: "center",
  },

  rewardSymbolText: {
    color: "#C4B5FD",
    fontSize: 20,
  },

  timeLabel: {
    color: "#9F94B3",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  sessionTime: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 8,
    fontVariant: ["tabular-nums"],
  },

  earnedBadge: {
    alignSelf: "center",
    backgroundColor: "#36264A",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginTop: 13,
  },

  earnedText: {
    color: "#D4BFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  rewardDivider: {
    height: 1,
    backgroundColor: "#453457",
    marginTop: 24,
    marginBottom: 22,
  },

  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  levelCaption: {
    color: "#9F94B3",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  levelText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 8,
  },

  progressRight: {
    alignItems: "flex-end",
  },

  progressPercentage: {
    color: "#C4B5FD",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 8,
  },

  progressTrack: {
    height: 10,
    backgroundColor: "#352944",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 21,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#B69AFF",
    borderRadius: 20,
  },

  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 11,
  },

  progressFooterText: {
    color: "#9F94B3",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // CONTINUE BUTTON
  continueButton: {
    backgroundColor: "#7C5CFF",
    borderRadius: 20,
    paddingVertical: 19,
    paddingHorizontal: 21,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#7C5CFF",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  continuePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },

  continueArrow: {
    color: "#FFFFFF",
    fontSize: 26,
  },

  footer: {
    color: "#847892",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: 28,
  },
});
