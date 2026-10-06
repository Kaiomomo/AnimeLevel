import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { characterStages } from "../constants/characters";

export default function StatsScreen({
  navigation,
  totalSeconds,
  sessionsCompleted,
}) {
  const totalHours = Math.floor(totalSeconds / 3600);
  const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
  const currentLevel = Math.min(Math.floor(totalSeconds / 3600), 100);

  let currentCharacter = characterStages[0];

  characterStages.forEach((stage) => {
    if (currentLevel >= stage.minLevel) {
      currentCharacter = stage;
    }
  });

  const nextEvolution = characterStages.find((stage) => {
    return stage.minLevel > currentLevel;
  });

  const levelsUntilEvolution = nextEvolution
    ? nextEvolution.minLevel - currentLevel
    : 0;

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← BACK</Text>
      </Pressable>
      <Text style={styles.title}>YOUR STATS</Text>

      <Text style={styles.subtitle}>Track your revision</Text>
      <View style={styles.statsRow}>
        <View style={styles.levelCard}>
          <View style={styles.formCard}>
            <Text style={styles.formLabel}>CURRENT FORM</Text>
            <Image
              source={currentCharacter.image}
              style={styles.characterImage}
              resizeMode="contain"
            />
            <Text style={styles.formName}>
              {currentCharacter.form.toUpperCase()}
            </Text>
          </View>
          <View style={styles.nextCard}>
            <Text style={styles.nextLabel}>NEXT EVOLUTION</Text>

            {nextEvolution ? (
              <>
                <Text style={styles.nextForm}>
                  {nextEvolution.form.toUpperCase()}
                </Text>

                <Text style={styles.nextLevel}>
                  LEVEL {nextEvolution.minLevel}
                </Text>

                <Text style={styles.levelsRemaining}>
                  {levelsUntilEvolution} LEVELS REMAINING
                </Text>
              </>
            ) : (
              <Text style={styles.nextForm}>FINAL FORM ACHIEVED</Text>
            )}
          </View>
          <Text style={styles.levelLabel}>CURRENT LEVEL</Text>

          <Text style={styles.levelNumber}>{currentLevel}</Text>
          <Text style={styles.levelMax}>/100</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {totalHours}H{remainingMinutes}M
          </Text>
          <Text style={styles.statLabel}>HOURS STUDIED</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{sessionsCompleted}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingRight: 15,
    marginBottom: 15,
  },

  backText: {
    color: "#7C5CFF",
    fontSize: 14,
    fontWeight: "800",
  },
  container: {
    flex: 1,
    backgroundColor: "#0D0D12",
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  characterImage: {
    width: 150,
    height: 150,
    marginTop: 12,
  },
  formCard: {
    width: "100%",
    backgroundColor: "#181820",
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
    marginTop: 12,
  },

  formLabel: {
    color: "#8E8E9A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  formName: {
    color: "#7C5CFF",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 8,
  },
  nextCard: {
    width: "100%",
    backgroundColor: "#181820",
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
    marginTop: 12,
  },

  nextLabel: {
    color: "#8E8E9A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  nextForm: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 8,
  },

  nextLevel: {
    color: "#7C5CFF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 5,
  },

  levelsRemaining: {
    color: "#8E8E9A",
    fontSize: 12,
    marginTop: 5,
  },
  subtitle: {
    color: "#8E8E9A",
    fontSize: 14,
    marginTop: 6,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 35,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#181820",
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },

  statLabel: {
    color: "#8E8E9A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 6,
  },
  levelCard: {
    width: "100%",
    backgroundColor: "#181820",
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
    marginTop: 12,
  },

  levelLabel: {
    color: "#8E8E9A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  levelNumber: {
    color: "#7C5CFF",
    fontSize: 42,
    fontWeight: "900",
    marginTop: 6,
  },

  levelMax: {
    color: "#666672",
    fontSize: 13,
    fontWeight: "700",
  },
});
