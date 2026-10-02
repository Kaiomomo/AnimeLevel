import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

import HomeScreen from "./src/screens/HomeScreen";
import RevisionScreen from "./src/screens/RevisionScreen";
import SessionCompleteScreen from "./src/screens/SessionCompleteScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    async function loadProgress() {
      const savedTotal = await AsyncStorage.getItem("totalSeconds");

      if (savedTotal !== null) {
        setTotalSeconds(Number(savedTotal));
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
