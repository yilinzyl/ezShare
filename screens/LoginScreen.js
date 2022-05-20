import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import logo from "../assets/ezShare-logo.png";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const handleRegister = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with", user.email);
      })
      .catch((error) => alert(error.message));
  };
  const handleLogIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with", user.email);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#B0C0F9" }} behavior = "padding">
      <Image source={logo} style={styles.appLogo} />
      <KeyboardAvoidingView style={styles.roundedContainer} behavior="padding">
        <Text style={styles.header}>Sign In</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputHeader}>Email</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
          </View>
          <Text style={styles.inputHeader}>Password</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogIn} style={styles.signInButton}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.registerButton}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  appLogo: {
    top: 80,
    height: 67,
    width: 275,
    marginHorizontal: 50,
  },
  header: {
    fontFamily: "raleway-bold",
    fontSize: 32,
    color: "#404040",
    top: 42,
  },
  roundedContainer: {
    backgroundColor: "white",
    height: 634,
    top: 118,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    alignItems: "center",
  },
  inputContainer: {
    top: 80,
  },
  inputBox: {
    borderColor: "#B0C0F9",
    borderWidth: 2,
    borderRadius: 10,
    width: 269,
    height: 40,
    marginBottom: 13,
  },
  input: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 10,
  },
  inputHeader: {
    fontFamily: "raleway-regular",
    fontSize: 18,
    color: "#404040",
    margin: 6,
  },
  buttonContainer: {
    top: 120,
    alignItems: "center",
  },
  signInButton: {
    backgroundColor: "#B0C0F9",
    height: 50,
    width: 217,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButton: {
    backgroundColor: "#F898A3",
    margin: 16,
    height: 50,
    width: 217,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "raleway-bold",
    color: "#F9FAFE",
    fontSize: 20,
  },
});
