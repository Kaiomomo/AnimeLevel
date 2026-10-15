import { usePreventRemove } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { MAX_LEVEL, SECONDS_PER_LEVEL } from "../constants/progression";

import RevisionActivity from "../widgets/RevisionActivity";

const MAX_REVISION_MS = 100 * 60 * 60 * 1000;

// Convert revision seconds into a readable timer.
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

// One reusable function for level and XP calculations.
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

  // Saved revision time + current session time.
  const combinedSeconds = totalSeconds + sessionSeconds;
  const { level, progress } = calculateProgress(combinedSeconds);

  // Timer references keep time accurate in the background.
  const startTimeRef = useRef(Date.now());
  const accumulatedMsRef = useRef(0);

  // Live Activity references.
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

  // Update XP when the completed minute changes.
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

  // Protect unfinished sessions from accidental navigation.
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

  // Update the on-screen timer every second.
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
      // PAUSE: record the exact elapsed time.
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
      // RESUME: continue without counting paused time.
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

    // Save the revision time and earned XP.
    finishSession(finalSeconds);

    // Remove the Lock Screen Live Activity.
    if (liveActivityRef.current) {
      await liveActivityRef.current.end("immediate");
      liveActivityRef.current = null;
    }

    liveTimeRef.current = null;

    navigation.navigate("SessionComplete", {
      sessionSeconds: finalSeconds,
    });
  }

  const displayMinutes = Math.floor(sessionSeconds / 60);
  const displaySeconds = sessionSeconds % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>REVISION SESSION</Text>

      <View style={styles.timerCard}>
        <Text style={styles.focusText}>{isRunning ? "FOCUS" : "PAUSED"}</Text>

        <Text style={styles.timer}>
          {displayMinutes}:{displaySeconds.toString().padStart(2, "0")}
        </Text>

        <Text style={styles.message}>
          {isRunning
            ? "Stay focused. Your progress is building."
            : "Your session is paused."}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.pauseButton}
          onPress={handlePauseResume}
          disabled={isFinishing}
        >
          <Text style={styles.buttonText}>
            {isRunning ? "PAUSE" : "RESUME"}
          </Text>
        </Pressable>

        <Pressable
          style={styles.finishButton}
          onPress={handleFinishSession}
          disabled={isFinishing}
        >
          <Text style={styles.buttonText}>FINISH</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>
        Every second brings you closer to your next level.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D12",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  label: {
    color: "#A0A0B0",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
    marginBottom: 30,
  },

  timerCard: {
    backgroundColor: "#181820",
    borderRadius: 28,
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 25,
  },

  focusText: {
    color: "#B9A5FF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 20,
  },

  timer: {
    color: "#FFFFFF",
    fontSize: 72,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },

  message: {
    color: "#9292A2",
    fontSize: 13,
    textAlign: "center",
    marginTop: 20,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },

  pauseButton: {
    flex: 1,
    backgroundColor: "#30303D",
    paddingVertical: 19,
    borderRadius: 18,
    alignItems: "center",
  },

  finishButton: {
    flex: 1,
    backgroundColor: "#7C5CFF",
    paddingVertical: 19,
    borderRadius: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  hint: {
    color: "#777788",
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
  },
});
