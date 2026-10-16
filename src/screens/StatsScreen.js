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

export default function StatsScreen({
  navigation,
  totalSeconds = 0,
  sessionsCompleted = 0,
}) {
  // Calculate total revision time.
  const totalHours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);

  // Calculate the player's current level.
  const currentLevel = Math.min(
    Math.floor(totalSeconds / SECONDS_PER_LEVEL),
    MAX_LEVEL,
  );

  // Find the current character evolution.
  let currentCharacter = characterStages[0];

  characterStages.forEach((stage) => {
    if (currentLevel >= stage.minLevel) {
      currentCharacter = stage;
    }
  });

  // Find the next character evolution.
  const nextEvolution = characterStages.find(
    (stage) => stage.minLevel > currentLevel,
  );

  const levelsUntilEvolution = nextEvolution
    ? nextEvolution.minLevel - currentLevel
    : 0;

  // Calculate progress between character evolutions.
  const evolutionStartLevel = currentCharacter.minLevel;

  const evolutionEndLevel = nextEvolution ? nextEvolution.minLevel : MAX_LEVEL;

  const evolutionProgress = nextEvolution
    ? Math.max(
        0,
        Math.min(
          100,
          ((currentLevel - evolutionStartLevel) /
            (evolutionEndLevel - evolutionStartLevel)) *
            100,
        ),
      )
    : 100;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* BACK BUTTON */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← BACK</Text>
      </Pressable>

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>YOUR STATS</Text>

          <Text style={styles.subtitle}>
            Your journey to becoming legendary
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>✦</Text>
        </View>
      </View>

      {/* CHARACTER EVOLUTION CARD */}
      <View style={styles.characterCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionLabel}>CURRENT EVOLUTION</Text>

          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>LVL {currentLevel}</Text>
          </View>
        </View>

        <View style={styles.characterGlow}>
          <Image
            source={currentCharacter.image}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.formName}>
          {currentCharacter.form.toUpperCase()}
        </Text>

        <Text style={styles.characterHint}>
          Power grows with every revision session.
        </Text>

        {/* NEXT EVOLUTION */}
        <View style={styles.evolutionSection}>
          {nextEvolution ? (
            <>
              <View style={styles.evolutionHeader}>
                <Text style={styles.evolutionLabel}>NEXT EVOLUTION</Text>

                <Text style={styles.evolutionLevel}>
                  LEVEL {nextEvolution.minLevel}
                </Text>
              </View>

              <Text style={styles.nextForm}>
                {nextEvolution.form.toUpperCase()}
              </Text>

              <View style={styles.evolutionTrack}>
                <View
                  style={[
                    styles.evolutionFill,
                    {
                      width: `${evolutionProgress}%`,
                    },
                  ]}
                />
              </View>

              <View style={styles.progressFooter}>
                <Text style={styles.progressPercentage}>
                  {Math.floor(evolutionProgress)}%
                </Text>

                <Text style={styles.levelsRemaining}>
                  {levelsUntilEvolution} LEVELS REMAINING
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.finalFormContainer}>
              <Text style={styles.finalFormTitle}>FINAL FORM ACHIEVED</Text>

              <Text style={styles.finalFormDescription}>
                You have reached your ultimate evolution!
              </Text>

              <View style={styles.evolutionTrack}>
                <View style={[styles.evolutionFill, { width: "100%" }]} />
              </View>
            </View>
          )}
        </View>
      </View>

      {/* STATISTICS */}
      <Text style={styles.statsTitle}>YOUR ACHIEVEMENTS</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>◷</Text>

          <Text style={styles.statNumber}>
            {totalHours}H {remainingMinutes}M
          </Text>

          <Text style={styles.statLabel}>TIME STUDIED</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statIcon}>✦</Text>

          <Text style={styles.statNumber}>{sessionsCompleted}</Text>

          <Text style={styles.statLabel}>SESSIONS</Text>
        </View>
      </View>

      {/* MOTIVATIONAL FOOTER */}
      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>YOUR JOURNEY CONTINUES</Text>

        <Text style={styles.footerDescription}>
          Every minute of focus brings you closer to your next transformation.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D12",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 50,
  },

  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingRight: 15,
    marginBottom: 16,
  },

  backText: {
    color: "#A78BFA",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#9790A9",
    fontSize: 12,
    marginTop: 7,
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2A2044",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#594081",
  },

  headerIconText: {
    color: "#C4B5FD",
    fontSize: 24,
  },

  characterCard: {
    backgroundColor: "#1C172B",
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#58417E",
    shadowColor: "#7C5CFF",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 6,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionLabel: {
    color: "#C4B5FD",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  levelBadge: {
    backgroundColor: "#34244E",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#7656A8",
  },

  levelBadgeText: {
    color: "#E9D5FF",
    fontSize: 12,
    fontWeight: "900",
  },

  characterGlow: {
    alignItems: "center",
    justifyContent: "center",
    height: 205,
    marginTop: 10,
    backgroundColor: "#241A3B",
    borderRadius: 22,
  },

  characterImage: {
    width: 180,
    height: 180,
  },

  formName: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1.5,
    marginTop: 18,
  },

  characterHint: {
    color: "#A9A0B9",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },

  evolutionSection: {
    marginTop: 25,
    backgroundColor: "#171321",
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: "#352749",
  },

  evolutionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  evolutionLabel: {
    color: "#C4B5FD",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  evolutionLevel: {
    color: "#E9D5FF",
    fontSize: 11,
    fontWeight: "900",
  },

  nextForm: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
  },

  evolutionTrack: {
    height: 11,
    backgroundColor: "#302640",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#4B3673",
  },

  evolutionFill: {
    height: "100%",
    backgroundColor: "#A78BFA",
    borderRadius: 20,
  },

  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  progressPercentage: {
    color: "#C4B5FD",
    fontSize: 13,
    fontWeight: "900",
  },

  levelsRemaining: {
    color: "#938BA4",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  finalFormContainer: {
    alignItems: "center",
  },

  finalFormTitle: {
    color: "#C4B5FD",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 5,
  },

  finalFormDescription: {
    color: "#A9A0B9",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },

  statsTitle: {
    color: "#C4B5FD",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginTop: 30,
    marginBottom: 15,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#181820",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30263E",
  },

  statIcon: {
    color: "#A78BFA",
    fontSize: 26,
    marginBottom: 12,
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  statLabel: {
    color: "#9790A9",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginTop: 9,
    textAlign: "center",
  },

  footerCard: {
    backgroundColor: "#181420",
    borderRadius: 18,
    padding: 20,
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#342747",
    alignItems: "center",
  },

  footerTitle: {
    color: "#C4B5FD",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },

  footerDescription: {
    color: "#9992AA",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 19,
  },
});
