import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreateListingScreen from "./screens/CreateListingScreen";
import ExploreScreen from "./screens/ExploreScreen";
import KeywordSearchScreen from "./screens/KeywordSearchScreen";
import MyListingsScreen from "./screens/MyListingsScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import JoinListingScreen from "./screens/JoinListingScreen";
import ViewListingScreen from "./screens/ViewListingScreen";
import PasswordScreen from "./screens/PasswordScreen";
import TrackScreen from "./screens/TrackScreen";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import JoinerDetails from "./screens/JoinerDetailsScreen";

// Adding custom fonts to the project
// Only included regular and bold for now
const getFonts = () =>
  Font.loadAsync({
    "raleway-regular": require("./assets/fonts/Raleway-Regular.ttf"),
    "raleway-bold": require("./assets/fonts/Raleway-Bold.ttf"),
  });

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Log In"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Register"
            component={RegisterScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Profile"
            component={ProfileScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Create Listing"
            component={CreateListingScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Explore"
            component={ExploreScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Keyword"
            component={KeywordSearchScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="My Listings"
            component={MyListingsScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Edit"
            component={EditProfileScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Password"
            component={PasswordScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="View Listing"
            component={ViewListingScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Join Listing"
            component={JoinListingScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Track"
            component={TrackScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Joiner Details"
            component={JoinerDetails}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={() => console.log("error")}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
