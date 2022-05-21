import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { auth } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";

// Variable width of current window 
var width = Dimensions.get('window').width;

// Variable height of current window
var height = Dimensions.get('window').height;

const HomeScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const handleSignOut = () => {
    auth
    .signOut()
    .then(() => {
      navigation.replace("Register")
    })
    .then(
      console.log("Signed out")
    )
    .catch(error => alert(error.message))
  }

  return (
    <View>
      <Text>Hello, {user.displayName}!</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
