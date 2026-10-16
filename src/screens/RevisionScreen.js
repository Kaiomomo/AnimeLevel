import { usePreventRemove } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MAX_LEVEL, SECONDS_PER_LEVEL } from "../constants/progression";

import RevisionActivity from "../widgets/RevisionActivity";

const MAX_REVISION_MS = 100 * 60 * 60 * 1000;

// Convert seconds into a readable timer.
function formatRevisionTime(totalSeconds) {
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

// Calculate the current level and XP.
function calculateProgress(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);

  const level = Math.min(
    Math.floor(safeSeconds / SECONDS_PER_LEVEL),
    MAX_LEVEL,
  );

  const progress =
    level >= MAX_LEVEL
      ? 100
      : ((safeSeconds % SECONDS_PER_LEVEL) / SECONDS_PER_LEVEL) * 100;

  return { level, progress };
}

export default function RevisionScreen({
  navigation,
  finishSession,
  totalSeconds = 0,
}) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);

  // Include this session in the displayed XP.
  const combinedSeconds = totalSeconds + sessionSeconds;
  const { level, progress } = calculateProgress(combinedSeconds);

  // Accurate timer references.
  const startTimeRef = useRef(Date.now());
  const accumulatedMsRef = useRef(0);

  // Lock Screen Live Activity references.
  const liveActivityRef = useRef(null);
  const liveTimeRef = useRef(null);

  function getElapsedMilliseconds() {
    if (!isRunning) {
      return accumulatedMsRef.current;
    }

    return accumulatedMsRef.current + (Date.now() - startTimeRef.current);
  }

  function startLiveActivity() {
    if (liveActivityRef.current) return;

    const startTimestamp = startTimeRef.current - accumulatedMsRef.current;

    const endTimestamp = startTimestamp + MAX_REVISION_MS;

    liveTimeRef.current = {
      startTimestamp,
      endTimestamp,
    };

    const initialProgress = calculateProgress(totalSeconds);

    liveActivityRef.current = RevisionActivity.start({
      status: "FOCUS",
      minutes: 0,
      startTimestamp,
      endTimestamp,
      level: initialProgress.level,
      progress: initialProgress.progress,
      pauseTimestamp: null,
      pausedDisplay: "0:00",
    });
  }

  // Start the Lock Screen Live Activity.
  useEffect(() => {
    startLiveActivity();
  }, []);

  // Refresh the Live Activity XP each completed minute.
  const sessionMinutes = Math.floor(sessionSeconds / 60);

  useEffect(() => {
    if (!isRunning || !liveActivityRef.current || !liveTimeRef.current) {
      return;
    }

    liveActivityRef.current.update({
      status: "FOCUS",
      minutes: sessionMinutes,
      level,
      progress,
      ...liveTimeRef.current,
      pauseTimestamp: null,
      pausedDisplay: formatRevisionTime(sessionSeconds),
    });
  }, [sessionMinutes, isRunning, level, totalSeconds]);

  // Warn before leaving an unfinished session.
  usePreventRemove(sessionSeconds > 0 && !isFinishing, ({ data }) => {
    Alert.alert("Leave Revision?", "Your current session will be lost.", [
      {
        text: "Keep Revising",
        style: "cancel",
      },
      {
        text: "Leave",
        style: "destructive",
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  // Update the displayed timer every second.
  useEffect(() => {
    if (!isRunning) return;

    function updateTimer() {
      setSessionSeconds(Math.floor(getElapsedMilliseconds() / 1000));
    }

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  function handlePauseResume() {
    if (isRunning) {
      // Pause without losing elapsed time.
      accumulatedMsRef.current = getElapsedMilliseconds();

      const pausedSeconds = Math.floor(accumulatedMsRef.current / 1000);

      setSessionSeconds(pausedSeconds);
      setIsRunning(false);

      const pausedProgress = calculateProgress(totalSeconds + pausedSeconds);

      if (liveActivityRef.current && liveTimeRef.current) {
        liveActivityRef.current.update({
          status: "PAUSED",
          minutes: Math.floor(pausedSeconds / 60),
          level: pausedProgress.level,
          progress: pausedProgress.progress,
          ...liveTimeRef.current,
          pauseTimestamp: Date.now(),
          pausedDisplay: formatRevisionTime(pausedSeconds),
        });
      }
    } else {
      // Resume without counting paused time.
      const resumeTimestamp = Date.now();

      startTimeRef.current = resumeTimestamp;
      setIsRunning(true);

      const elapsedMilliseconds = accumulatedMsRef.current;
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

      const startTimestamp = resumeTimestamp - elapsedMilliseconds;

      const endTimestamp = startTimestamp + MAX_REVISION_MS;

      liveTimeRef.current = {
        startTimestamp,
        endTimestamp,
      };

      const resumedProgress = calculateProgress(totalSeconds + elapsedSeconds);

      if (liveActivityRef.current) {
        liveActivityRef.current.update({
          status: "FOCUS",
          minutes: Math.floor(elapsedSeconds / 60),
          level: resumedProgress.level,
          progress: resumedProgress.progress,
          ...liveTimeRef.current,
          pauseTimestamp: null,
          pausedDisplay: formatRevisionTime(elapsedSeconds),
        });
      }
    }
  }

  async function handleFinishSession() {
    if (isFinishing) return;

    const finalSeconds = Math.floor(getElapsedMilliseconds() / 1000);

    setIsFinishing(true);
    setIsRunning(false);

    // Save earned revision time and XP.
    finishSession(finalSeconds);

    // End the Lock Screen Live Activity.
    if (liveActivityRef.current) {
      await liveActivityRef.current.end("immediate");
      liveActivityRef.current = null;
    }

    liveTimeRef.current = null;

    navigation.navigate("SessionComplete", {
      sessionSeconds: finalSeconds,
    });
  }

  const timerDisplay = formatRevisionTime(sessionSeconds);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>ANIME LEVEL / FOCUS MODE</Text>

          <Text style={styles.title}>Deep Focus</Text>

          <Text style={styles.subtitle}>A little progress every second.</Text>
        </View>

        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>✦</Text>
        </View>
      </View>

      {/* FOCUS TIMER */}
      <View style={styles.focusCard}>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, !isRunning && styles.pausedDot]} />

          <Text style={styles.statusText}>
            {isRunning ? "FOCUS SESSION ACTIVE" : "SESSION PAUSED"}
          </Text>
        </View>

        {/* CIRCULAR TIMER DESIGN */}
        <View style={styles.timerStage}>
          <View style={styles.outerRing} />
          <View style={styles.middleRing} />
          <View style={styles.innerCircle} />

          <View style={styles.timerContent}>
            <Text style={styles.timerLabel}>ELAPSED TIME</Text>

            <Text style={styles.timer} adjustsFontSizeToFit numberOfLines={1}>
              {timerDisplay}
            </Text>

            <Text style={styles.timerState}>
              {isRunning ? "KEEP YOUR FLOW" : "TAKE YOUR TIME"}
            </Text>
          </View>
        </View>

        <Text style={styles.focusMessage}>
          {isRunning
            ? "Your power is growing with every minute."
            : "Your progress is safe. Resume when you're ready."}
        </Text>

        <View style={styles.focusDivider} />

        <View style={styles.sessionInfo}>
          <Text style={styles.sessionInfoLabel}>SESSION PROGRESS</Text>

          <Text style={styles.sessionInfoValue}>
            {Math.floor(sessionSeconds / 60)} MIN
          </Text>
        </View>
      </View>

      {/* LIVE XP */}
      <View style={styles.xpCard}>
        <View style={styles.xpHeader}>
          <View>
            <Text style={styles.xpLabel}>CURRENT LEVEL</Text>

            <Text style={styles.xpLevel}>LVL {level}</Text>
          </View>

          <View style={styles.xpRight}>
            <Text style={styles.xpLabel}>NEXT LEVEL XP</Text>

            <Text style={styles.xpPercentage}>{Math.floor(progress)}%</Text>
          </View>
        </View>

        <View style={styles.xpTrack}>
          <View style={[styles.xpFill, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.xpHint}>
          {level >= MAX_LEVEL
            ? "Ultimate evolution achieved."
            : `Keep focusing to unlock Level ${level + 1}.`}
        </Text>
      </View>

      {/* CONTROLS */}
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.pauseButton,
            pressed && styles.pressedButton,
          ]}
          onPress={handlePauseResume}
          disabled={isFinishing}
          accessibilityRole="button"
          accessibilityLabel={isRunning ? "Pause revision" : "Resume revision"}
        >
          <Text style={styles.pauseIcon}>{isRunning ? "Ⅱ" : "▶"}</Text>

          <Text style={styles.buttonText}>
            {isRunning ? "PAUSE" : "RESUME"}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.finishButton,
            pressed && styles.pressedButton,
          ]}
          onPress={handleFinishSession}
          disabled={isFinishing}
          accessibilityRole="button"
          accessibilityLabel="Finish revision session"
        >
          <Text style={styles.finishIcon}>✓</Text>

          <Text style={styles.buttonText}>
            {isFinishing ? "SAVING..." : "FINISH"}
          </Text>
        </Pressable>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerStar}>✦</Text>

        <Text style={styles.footerText}>FOCUS ON THE MOMENT</Text>

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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 40,
    justifyContent: "center",
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    color: "#A78BFA",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 9,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  subtitle: {
    color: "#9992AA",
    fontSize: 12,
    marginTop: 7,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#271D39",
    borderWidth: 1,
    borderColor: "#584079",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIconText: {
    color: "#C4B5FD",
    fontSize: 27,
  },

  // FOCUS CARD
  focusCard: {
    backgroundColor: "#17131F",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderWidth: 1,
    borderColor: "#352744",
    alignItems: "center",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#2A2039",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#A78BFA",
  },

  pausedDot: {
    backgroundColor: "#F3C985",
  },

  statusText: {
    color: "#C4B5FD",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  // TIMER CIRCLES
  timerStage: {
    width: 250,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    marginBottom: 15,
  },

  outerRing: {
    position: "absolute",
    width: 248,
    height: 248,
    borderRadius: 124,
    borderWidth: 1,
    borderColor: "#4B3665",
  },

  middleRing: {
    position: "absolute",
    width: 221,
    height: 221,
    borderRadius: 111,
    borderWidth: 7,
    borderColor: "#7C5CBA",
    backgroundColor: "#1C1528",
    shadowColor: "#A78BFA",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },

  innerCircle: {
    position: "absolute",
    width: 186,
    height: 186,
    borderRadius: 93,
    backgroundColor: "#241A35",
    borderWidth: 1,
    borderColor: "#4C3769",
  },

  timerContent: {
    alignItems: "center",
    width: 205,
  },

  timerLabel: {
    color: "#BBA5EB",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.7,
  },

  timer: {
    color: "#FFFFFF",
    fontSize: 43,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
    marginTop: 10,
    textAlign: "center",
    width: "100%",
  },

  timerState: {
    color: "#A99AC0",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 9,
  },

  focusMessage: {
    color: "#A99ABF",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 3,
  },

  focusDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "#352842",
    marginTop: 25,
    marginBottom: 18,
  },

  sessionInfo: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sessionInfoLabel: {
    color: "#9489A8",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sessionInfoValue: {
    color: "#C4B5FD",
    fontSize: 13,
    fontWeight: "900",
  },

  // XP CARD
  xpCard: {
    backgroundColor: "#1B1626",
    borderRadius: 20,
    padding: 20,
    marginTop: 17,
    borderWidth: 1,
    borderColor: "#352747",
  },

  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  xpLabel: {
    color: "#9F94B3",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  xpLevel: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 7,
  },

  xpRight: {
    alignItems: "flex-end",
  },

  xpPercentage: {
    color: "#C4B5FD",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 7,
  },

  xpTrack: {
    height: 9,
    backgroundColor: "#352944",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 20,
  },

  xpFill: {
    height: "100%",
    backgroundColor: "#A78BFA",
    borderRadius: 20,
  },

  xpHint: {
    color: "#9389A7",
    fontSize: 11,
    marginTop: 12,
  },

  // BUTTONS
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },

  pauseButton: {
    flex: 1,
    backgroundColor: "#30263D",
    paddingVertical: 19,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#49365E",
  },

  finishButton: {
    flex: 1,
    backgroundColor: "#7C5CFF",
    paddingVertical: 19,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#7C5CFF",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  pressedButton: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  pauseIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  finishIcon: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },

  // FOOTER
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 27,
    gap: 12,
  },

  footerStar: {
    color: "#7656A8",
    fontSize: 12,
  },

  footerText: {
    color: "#82778F",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
