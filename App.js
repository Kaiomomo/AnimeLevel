import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";

import HomeScreen from "./src/screens/HomeScreen";
import RevisionScreen from "./src/screens/RevisionScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [totalSeconds, setTotalSeconds] = useState(0);

  function finishSession(sessionSeconds) {
    setTotalSeconds((previousTotal) => previousTotal + sessionSeconds);
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
