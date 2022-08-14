import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import logo from "../assets/ezShare-logo.png";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HORIZONTAL } from "react-native/Libraries/Components/ScrollView/ScrollViewContext";
  
// Variable width of current window 
var width = Dimensions.get('window').width;

// Variable height of current window
var height = Dimensions.get('window').height;

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

  const handleNewUser = () => {
    navigation.replace("Register");
  }

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
    <View
      style={{ flex: 1, backgroundColor: "#B0C0F9" }}
    >
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.appLogo} />
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        // scrollEnabled={false}
        contentContainerStyle={{flexGrow: 1}}
      >
        <View style={styles.roundedContainer} behavior="padding">
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
              onPress={handleNewUser}
              style={styles.registerButton}
            >
              <Text style={styles.registerText}>
                Not a user yet?{" "}
                <Text style={[styles.registerText,{textDecorationLine: 'underline',}]}>Create a new account.</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
  },
  appLogo: {
    top: height * 0.125,
    height: height * 0.1,
    width: height * 0.1 * 3.42,
  },
  header: {
    fontFamily: "raleway-bold",
    fontSize: 32,
    color: "#404040",
    top: 42,
  },
  roundedContainer: {
    backgroundColor: "white",
    top: height * 0.2,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    alignItems: "center",
    flex: 1,
  },
  inputContainer: {
    top: 80,
  },
  inputBox: {
    borderColor: "#B0C0F9",
    borderWidth: 2,
    borderRadius: 10,
    width: width * 0.65,
    height: height * 0.044,
    marginBottom: 13,
  },
  input: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 6,
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
    backgroundColor: "#F898A3",
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
  registerText: {
    fontFamily: "raleway-regular",
    color: "#404040",
    margin: 10,
  },
});
