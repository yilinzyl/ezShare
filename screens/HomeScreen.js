import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import React from "react";
import { auth } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";


const HomeScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const handleSignOut = () => {
    auth
    .signOut()
    .then(() => {
      navigation.replace("Log In")
    })
    .then(
      console.log("Signed out")
    )
    .catch(error => alert(error.message))
  }

  return (
    <View>
      <Text>Home Screen, {user.email} </Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
