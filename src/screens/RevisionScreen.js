import { usePreventRemove } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function RevisionScreen({ navigation, finishSession }) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);

  // Store timing values without waiting for a React re-render
  const startTimeRef = useRef(Date.now());
  const accumulatedMsRef = useRef(0);

  function getElapsedMilliseconds() {
    if (!isRunning) {
      return accumulatedMsRef.current;
    }

    return accumulatedMsRef.current + (Date.now() - startTimeRef.current);
  }

  // Protect the user from accidentally leaving
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

  // Update the displayed timer using real elapsed time
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
      // Save the exact elapsed time when paused
      accumulatedMsRef.current = getElapsedMilliseconds();

      setSessionSeconds(Math.floor(accumulatedMsRef.current / 1000));

      setIsRunning(false);
    } else {
      // Begin a new running period
      startTimeRef.current = Date.now();
      setIsRunning(true);
    }
  }

  function handleFinishSession() {
    // Calculate time at the exact moment FINISH is pressed
    const finalSeconds = Math.floor(getElapsedMilliseconds() / 1000);

    setIsFinishing(true);
    setIsRunning(false);

    // Save the revision time to the user's total
    finishSession(finalSeconds);

    // Open the completion screen
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
