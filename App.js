import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

import HomeScreen from "./src/screens/HomeScreen";
import RevisionScreen from "./src/screens/RevisionScreen";
import SessionCompleteScreen from "./src/screens/SessionCompleteScreen";
import StatsScreen from "./src/screens/StatsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    async function loadProgress() {
      const savedTotal = await AsyncStorage.getItem("totalSeconds");
      const savedSessions = await AsyncStorage.getItem("sessionsCompleted");

      if (savedTotal !== null) {
        setTotalSeconds(Number(savedTotal));
      }

      if (savedSessions !== null) {
        setSessionsCompleted(Number(savedSessions));
      }
    }

    loadProgress();
  }, []);

  function finishSession(sessionSeconds) {
    setTotalSeconds((previousTotal) => {
      const newTotal = previousTotal + sessionSeconds;
      AsyncStorage.setItem("totalSeconds", newTotal.toString());

      return newTotal;
    });
    setSessionsCompleted((previousSessions) => {
      const newSessions = previousSessions + 1;

      AsyncStorage.setItem("sessionsCompleted", newSessions.toString());
      return newSessions;
    });
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} totalSeconds={totalSeconds} />}
        </Stack.Screen>

        <Stack.Screen name="Revision">
          {(props) => (
            <RevisionScreen {...props} finishSession={finishSession} />
          )}
        </Stack.Screen>

        <Stack.Screen name="SessionComplete">
          {(props) => (
            <SessionCompleteScreen {...props} totalSeconds={totalSeconds} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Stats">
          {(props) => (
            <StatsScreen
              {...props}
              totalSeconds={totalSeconds}
              sessionsCompleted={sessionsCompleted}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
