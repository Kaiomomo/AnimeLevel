import { usePreventRemove } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import RevisionActivity from "../widgets/RevisionActivity";

const MAX_REVISION_MS = 100 * 60 * 60 * 1000;

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

export default function RevisionScreen({ navigation, finishSession }) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);

  // Keep accurate time even if the screen stops updating.
  const startTimeRef = useRef(Date.now());
  const accumulatedMsRef = useRef(0);

  // References for the iOS Live Activity.
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

    // Align the Lock Screen timer with the app timer.
    const startTimestamp = startTimeRef.current - accumulatedMsRef.current;

    const endTimestamp = startTimestamp + MAX_REVISION_MS;

    liveTimeRef.current = {
      startTimestamp,
      endTimestamp,
    };

    liveActivityRef.current = RevisionActivity.start({
      status: "FOCUS",
      minutes: 0,
      startTimestamp,
      endTimestamp,
      pauseTimestamp: null,
      pausedDisplay: "0:00",
    });
  }

  // Start the Live Activity when the Revision screen opens.
  useEffect(() => {
    startLiveActivity();
  }, []);

  // Update the Live Activity when the completed minute changes.
  const sessionMinutes = Math.floor(sessionSeconds / 60);

  useEffect(() => {
    if (!isRunning || !liveActivityRef.current || !liveTimeRef.current) {
      return;
    }

    liveActivityRef.current.update({
      status: "FOCUS",
      minutes: sessionMinutes,
      ...liveTimeRef.current,
      pauseTimestamp: null,
      pausedDisplay: formatRevisionTime(sessionSeconds),
    });
  }, [sessionMinutes, isRunning]);

  // Warn before accidentally leaving an active revision session.
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
      // PAUSE: save the exact amount of revision completed.
      accumulatedMsRef.current = getElapsedMilliseconds();

      const pausedSeconds = Math.floor(accumulatedMsRef.current / 1000);

      setSessionSeconds(pausedSeconds);
      setIsRunning(false);

      if (liveActivityRef.current && liveTimeRef.current) {
        liveActivityRef.current.update({
          status: "PAUSED",
          minutes: Math.floor(pausedSeconds / 60),
          ...liveTimeRef.current,
          pauseTimestamp: Date.now(),
          pausedDisplay: formatRevisionTime(pausedSeconds),
        });
      }
    } else {
      // RESUME: restart from the previously accumulated time.
      const resumeTimestamp = Date.now();

      startTimeRef.current = resumeTimestamp;
      setIsRunning(true);

      const elapsedMilliseconds = accumulatedMsRef.current;

      // Move the native timer's starting point forward
      // to exclude time spent paused.
      const startTimestamp = resumeTimestamp - elapsedMilliseconds;

      const endTimestamp = startTimestamp + MAX_REVISION_MS;

      liveTimeRef.current = {
        startTimestamp,
        endTimestamp,
      };

      if (liveActivityRef.current) {
        liveActivityRef.current.update({
          status: "FOCUS",
          minutes: Math.floor(elapsedMilliseconds / 60000),
          ...liveTimeRef.current,
          pauseTimestamp: null,
          pausedDisplay: formatRevisionTime(
            Math.floor(elapsedMilliseconds / 1000),
          ),
        });
      }
    }
  }

  async function handleFinishSession() {
    if (isFinishing) return;

    const finalSeconds = Math.floor(getElapsedMilliseconds() / 1000);

    setIsFinishing(true);
    setIsRunning(false);

    // Save the revision progress.
    finishSession(finalSeconds);

    // Remove the Live Activity from the Lock Screen.
    if (liveActivityRef.current) {
      await liveActivityRef.current.end("immediate");
      liveActivityRef.current = null;
    }

    liveTimeRef.current = null;

    // Show the completion screen.
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
