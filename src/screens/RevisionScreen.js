import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function RevisionScreen({ navigation, finishSession }) {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setInterval(() => {
      setSessionSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const displayMinutes = Math.floor(sessionSeconds / 60);
  const displaySeconds = sessionSeconds % 60;

  function handleFinishSession() {
    finishSession(sessionSeconds);

    navigation.navigate("SessionComplete", {
      sessionSeconds: sessionSeconds,
    });
  }

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
          : "Your revision session is paused."}
      </Text>

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.pauseButton}
          onPress={() => setIsRunning(!isRunning)}
        >
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
    fontWeight: "800",
    letterSpacing: 3,
    marginTop: 35,
  },

  timer: {
    color: "#FFFFFF",
    fontSize: 72,
    fontWeight: "900",
    marginTop: 12,
  },

  message: {
    color: "#8E8E9A",
    fontSize: 14,
    textAlign: "center",
    marginTop: 14,
  },

  buttonRow: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    marginTop: 50,
  },

  pauseButton: {
    flex: 1,
    height: 58,
    backgroundColor: "#181820",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  finishButton: {
    flex: 1,
    height: 58,
    backgroundColor: "#7C5CFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
