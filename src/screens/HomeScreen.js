import { usePreventRemove } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function RevisionScreen({ navigation, finishSession }) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinishing, setIsFinishing] = useState(false);

  // The real-world time when the current running period started
  const [startTime, setStartTime] = useState(Date.now());

  // Time already studied before the most recent resume
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);

  // Protect the user from accidentally losing their session
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

  // Calculate session time using the real clock
  useEffect(() => {
    if (!isRunning) return;

    function updateTimer() {
      const elapsedMilliseconds = Date.now() - startTime;
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

      setSessionSeconds(accumulatedSeconds + elapsedSeconds);
    }

    // Update immediately
    updateTimer();

    // Then refresh the display every second
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [isRunning, startTime, accumulatedSeconds]);

  function handlePauseResume() {
    if (isRunning) {
      // Save how much time has been studied so far
      setAccumulatedSeconds(sessionSeconds);
      setIsRunning(false);
    } else {
      // Start measuring a new running period from right now
      setStartTime(Date.now());
      setIsRunning(true);
    }
  }

  function handleFinishSession() {
    setIsFinishing(true);

    finishSession(sessionSeconds);

    navigation.navigate("SessionComplete", {
      sessionSeconds: sessionSeconds,
    });
  }

  const displayMinutes = Math.floor(sessionSeconds / 60);
  const displaySeconds = sessionSeconds % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>REVISION SESSION</Text>

      <Text style={styles.focusText}>{isRunning ? "FOCUS" : "PAUSED"}</Text>

      <Text style={styles.timer}>
        {displayMinutes}:{displaySeconds.toString().padStart(2, "0")}
      </Text>

      <Text style={styles.message}>
        {isRunning
          ? "Stay focused. Your progress is building."
          : "Your session is paused."}
      </Text>

      <View style={styles.buttonRow}>
        <Pressable style={styles.pauseButton} onPress={handlePauseResume}>
          <Text style={styles.buttonText}>
            {isRunning ? "PAUSE" : "RESUME"}
          </Text>
        </Pressable>

        <Pressable style={styles.finishButton} onPress={handleFinishSession}>
          <Text style={styles.buttonText}>FINISH</Text>
        </Pressable>
      </View>
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

  label: {
    color: "#8E8E9A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },

  focusText: {
    color: "#7C5CFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 3,
    marginTop: 18,
  },

  timer: {
    color: "#FFFFFF",
    fontSize: 72,
    fontWeight: "900",
    marginTop: 10,
  },

  message: {
    color: "#8E8E9A",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },

  buttonRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
    marginTop: 40,
  },

  pauseButton: {
    flex: 1,
    backgroundColor: "#24242E",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  finishButton: {
    flex: 1,
    backgroundColor: "#7C5CFF",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
