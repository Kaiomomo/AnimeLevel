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
  // Calculate the current level.
  const level = Math.min(
    Math.floor(totalSeconds / SECONDS_PER_LEVEL),
    MAX_LEVEL,
  );

  // Calculate XP progress towards the next level.
  const secondsIntoLevel = totalSeconds % SECONDS_PER_LEVEL;
  const minutesIntoLevel = Math.floor(secondsIntoLevel / 60);

  const progressPercentage =
    level >= MAX_LEVEL ? 100 : (secondsIntoLevel / SECONDS_PER_LEVEL) * 100;

  // Find the correct character evolution.
  let currentCharacter = characterStages[0];

  characterStages.forEach((stage) => {
    if (level >= stage.minLevel) {
      currentCharacter = stage;
    }
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.branding}>
          <Text style={styles.eyebrow}>YOUR NEXT CHAPTER</Text>

          <Text style={styles.title}>ANIME LEVEL</Text>

          <Text style={styles.subtitle}>
            Become stronger with every session.
          </Text>
        </View>

        <View style={styles.headerActions}>
          {/* PROFILE BUTTON */}
          <Pressable
            style={styles.profileButton}
            onPress={() => navigation.navigate("Profile")}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <View style={styles.profileHead} />
            <View style={styles.profileBody} />
          </Pressable>

          {/* STATS BUTTON */}
          <Pressable
            style={styles.statsButton}
            onPress={() => navigation.navigate("Stats")}
            accessibilityRole="button"
            accessibilityLabel="Open statistics"
          >
            <Text style={styles.statsIcon}>▥</Text>
          </Pressable>
        </View>
      </View>

      {/* CHARACTER HERO */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroLabel}>✦ CURRENT HERO</Text>

          <View style={styles.formBadge}>
            <Text style={styles.formBadgeText}>
              {currentCharacter.form.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.characterStage}>
          <View style={styles.auraOuter} />
          <View style={styles.auraInner} />

          <Image
            source={currentCharacter.image}
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.heroDivider} />

        <View style={styles.levelRow}>
          <View>
            <Text style={styles.levelCaption}>CURRENT POWER</Text>

            <Text style={styles.levelText}>
              LEVEL <Text style={styles.levelNumber}>{level}</Text>
            </Text>
          </View>

          <View style={styles.powerIcon}>
            <Text style={styles.powerIconText}>✦</Text>
          </View>
        </View>

        <Text style={styles.characterHint}>
          Every hour of revision makes you stronger.
        </Text>
      </View>

      {/* XP PROGRESS */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressTitle}>
              {level >= MAX_LEVEL ? "MAX LEVEL" : "NEXT LEVEL"}
            </Text>

            <Text style={styles.progressSubtitle}>
              {level >= MAX_LEVEL
                ? "Your ultimate power is unlocked"
                : `${minutesIntoLevel} of 60 minutes completed`}
            </Text>
          </View>

          <Text style={styles.progressPercentage}>
            {Math.floor(progressPercentage)}%
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>

        <View style={styles.progressFooter}>
          <Text style={styles.progressFooterText}>
            {level >= MAX_LEVEL ? "FINAL FORM ACHIEVED" : `LEVEL ${level}`}
          </Text>

          <Text style={styles.progressFooterText}>
            {level >= MAX_LEVEL ? "LEGENDARY" : `LEVEL ${level + 1}`}
          </Text>
        </View>
      </View>

      {/* START REVISION */}
      <Pressable
        style={({ pressed }) => [
          styles.reviseButton,
          pressed && styles.reviseButtonPressed,
        ]}
        onPress={() => navigation.navigate("Revision")}
        accessibilityRole="button"
        accessibilityLabel="Start revision"
      >
        <View style={styles.playIconContainer}>
          <Text style={styles.playIcon}>▶</Text>
        </View>

        <View style={styles.reviseButtonContent}>
          <Text style={styles.reviseButtonText}>START REVISION</Text>

          <Text style={styles.reviseButtonSubtext}>
            Begin your next focus session
          </Text>
        </View>

        <Text style={styles.reviseArrow}>→</Text>
      </Pressable>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerStar}>✦</Text>

        <Text style={styles.footerText}>FOCUS · STUDY · EVOLVE</Text>

        <Text style={styles.footerStar}>✦</Text>
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
    paddingBottom: 42,
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 27,
    gap: 10,
  },

  branding: {
    flex: 1,
  },

  eyebrow: {
    color: "#A78BFA",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 7,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 1,
  },

  subtitle: {
    color: "#9C95AA",
    fontSize: 11,
    marginTop: 6,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  profileButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#221A34",
    borderWidth: 1,
    borderColor: "#4C386B",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  profileHead: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#C4B5FD",
    marginBottom: 3,
  },

  profileBody: {
    width: 21,
    height: 11,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#C4B5FD",
  },

  statsButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#34244E",
    borderWidth: 1,
    borderColor: "#7656A8",
    alignItems: "center",
    justifyContent: "center",
  },

  statsIcon: {
    color: "#C4B5FD",
    fontSize: 25,
    fontWeight: "900",
  },

  // CHARACTER HERO
  heroCard: {
    backgroundColor: "#17121F",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#352647",
    overflow: "hidden",
  },

  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  heroLabel: {
    color: "#C4B5FD",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  formBadge: {
    backgroundColor: "#302242",
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 7,
    maxWidth: "55%",
  },

  formBadgeText: {
    color: "#D8C8FF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  characterStage: {
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 8,
  },

  auraOuter: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#241934",
    borderWidth: 1,
    borderColor: "#3F2B5B",
  },

  auraInner: {
    position: "absolute",
    width: 165,
    height: 165,
    borderRadius: 83,
    backgroundColor: "#382252",
    shadowColor: "#9B6BFF",
    shadowOpacity: 0.6,
    shadowRadius: 35,
    shadowOffset: { width: 0, height: 0 },
  },

  characterImage: {
    width: "100%",
    height: 245,
  },

  heroDivider: {
    height: 1,
    backgroundColor: "#30243D",
    marginTop: 6,
    marginBottom: 20,
  },

  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  levelCaption: {
    color: "#9D92B2",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  levelText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 6,
  },

  levelNumber: {
    color: "#C4B5FD",
    fontSize: 31,
  },

  powerIcon: {
    width: 49,
    height: 49,
    borderRadius: 25,
    backgroundColor: "#34244E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#60418B",
  },

  powerIconText: {
    color: "#C4B5FD",
    fontSize: 28,
  },

  characterHint: {
    color: "#8F88A1",
    fontSize: 12,
    marginTop: 12,
  },

  // LEVEL PROGRESS
  progressSection: {
    marginTop: 27,
    paddingHorizontal: 3,
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  progressTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  progressSubtitle: {
    color: "#9790A9",
    fontSize: 12,
    marginTop: 6,
  },

  progressPercentage: {
    color: "#C4B5FD",
    fontSize: 23,
    fontWeight: "900",
  },

  progressTrack: {
    height: 12,
    backgroundColor: "#302640",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 18,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#A78BFA",
    borderRadius: 20,
  },

  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  progressFooterText: {
    color: "#8F88A1",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // MAIN ACTION
  reviseButton: {
    backgroundColor: "#7C5CFF",
    borderRadius: 21,
    paddingVertical: 18,
    paddingHorizontal: 17,
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    shadowColor: "#7C5CFF",
    shadowOpacity: 0.35,
    shadowRadius: 17,
    shadowOffset: { width: 0, height: 7 },
    elevation: 5,
  },

  reviseButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  playIconContainer: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.17)",
    alignItems: "center",
    justifyContent: "center",
  },

  playIcon: {
    color: "#FFFFFF",
    fontSize: 19,
    marginLeft: 3,
  },

  reviseButtonContent: {
    flex: 1,
  },

  reviseButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  reviseButtonSubtext: {
    color: "#E6DEFF",
    fontSize: 11,
    marginTop: 5,
  },

  reviseArrow: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "500",
  },

  // FOOTER
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    gap: 12,
  },

  footerStar: {
    color: "#7656A8",
    fontSize: 12,
  },

  footerText: {
    color: "#80788F",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
