

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from "./screens/Home.js"

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
        name=' HomeScreen'
        component={HomeScreen}
        options={{
          title : "Stock disponible",
          headerTitleAlign : 'center',
          headerTintColor : '#000',
          headerTitleStyle : {
            fontWeight : 'bold'
          }

        }}>

        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

