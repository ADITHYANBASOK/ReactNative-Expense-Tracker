import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./Src/Screens/LoginScreen";
import RegisterScreen from "./Src/Screens/RegisterScreen";
import "react-native-gesture-handler"
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./Src/Screens/HomeScreen";
import AddScreen from "./Src/Screens/AddScreen";
import UpdateScreen from "./Src/Screens/UpdateScreen";
import AllTransactions from "./Src/Screens/AllTransaction";


const Stack = createStackNavigator();

export default function App() {
  const globalScreenOptions = {
    headerStyle: {
      backgroundColor: "#DDD5F1",
    },
    headerTitleStyle: {
      color: "#000000",
    },
    headerTintColor: "black",
  };
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add" component={AddScreen} />
        <Stack.Screen name="Update" component={UpdateScreen} />
        <Stack.Screen name="All" component={AllTransactions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

