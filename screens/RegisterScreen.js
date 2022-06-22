import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { firestore } from "firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import logo from "../assets/ezShare-logo.png";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [userData, setUserData] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const handleExistingUser = () => {
    navigation.replace("Log In");
  };

  const handleRegister = () => {
    if (password === cpassword) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log("Registered with", user.email);
          return user.updateProfile({
            displayName: name,
          });
        })
        .catch((error) => alert(error.message));
    } else {
      alert("Password does not match. Please confirm password again.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#B0C0F9" }}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.appLogo} />
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        // scrollEnabled={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.roundedContainer}>
          <Text style={styles.header}>Create an account</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputHeader}>Name</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={(text) => setDisplayName(text)}
                style={styles.input}
              />
            </View>
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
            <Text style={styles.inputHeader}>Confirm Password</Text>
            <View style={styles.inputBox}>
              <TextInput
                placeholder="Confirm Password"
                value={cpassword}
                onChangeText={(text) => setCPassword(text)}
                style={styles.input}
                secureTextEntry
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleRegister}
              style={styles.registerButton}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleExistingUser}
              style={styles.existingUserButton}
            >
              <Text style={styles.existingUserText}>I am an existing User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RegisterScreen;

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
    fontSize: 30,
    color: "#404040",
    top: 42,
  },
  roundedContainer: {
    backgroundColor: "white",
    top: height * 0.15,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    alignItems: "center",
    flex: 1,
  },
  inputContainer: {
    top: 70,
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
    top: 100,
  },
  registerButton: {
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
  existingUserText: {
    fontFamily: "raleway-regular",
    margin: 5,
    color: "#404040",
  },
});
