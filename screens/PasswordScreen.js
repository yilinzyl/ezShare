import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { firestore } from "firebase/firestore";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IconButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const PasswordScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [cPassword, setCPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const exitCreatePopup = () =>
    Alert.alert("Confirm Exit?", "Changes you make will not be saved", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Exit", onPress: () => navigation.navigate("Profile") },
    ]
    );

    const handleSave = () => user.updatePassword(newPassword).then(Alert.alert("Password has been changed succesfully.")).then(() =>
navigation.navigate("Profile")
     ) ;
  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <IconButton
          icon="arrow-left"
          color="#B0C0F9"
          size={0.08 * width}
          style={{ marginLeft: width * -0.02 }}
          onPress={exitCreatePopup}
        />
        <View>
          <Text style={styles.header}>Change password</Text>
        </View>
      </View>
      <ScrollView style={styles.listingContainer}>
        <Text style={styles.inputHeader}>New Password</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter New Password"
            onChangeText={(text) => setNewPassword(text)}
            style={styles.nameInput}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity
          onPress={() => handleSave()}
          style={styles.createButton}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
        <View style={styles.buttonBottom}></View>
      </ScrollView>
      <View style={styles.footer}></View>
    </View>
  );
};

export default PasswordScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
    height: height * 0.23,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    marginBottom: height * 0.02,
  },
  header: {
    fontFamily: "raleway-bold",
    fontSize: (70 * width) / height,
  },
  emailText: {
    fontFamily: "raleway-regular",
    fontSize: (30 * width) / height,
    color: "#262626",
    marginBottom: height * 0.01,
    marginLeft: width * 0.05,
  },
  name: {
    fontFamily: "raleway-bold",
    fontSize: (60 * width) / height,
  },
  listingContainer: {
    height: height * 0.8,
  },
  inputBox: {
    borderColor: "#B0C0F9",
    borderWidth: 2,
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.05,
    marginBottom: 13,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  input: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 6,
  },
  nameInput: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 6,
    color: "#262626"
  },
  inputHeader: {
    fontFamily: "raleway-bold",
    fontSize: 18,
    color: "#404040",
    margin: 6,
    marginLeft: width * 0.05,
  },
  createButton: {
    backgroundColor: "#F898A3",
    height: 50,
    width: 217,
    borderRadius: 45,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 19,
    marginBottom: height * 0.03,
  },
  buttonText: {
    fontFamily: "raleway-bold",
    color: "#F9FAFE",
    fontSize: 20,
  },
  widgetButton: {
    color: "white",
  },
  widgetText: {
    fontFamily: "raleway-regular",
    color: "#6F8EFA",
    fontSize: 16,
    textDecorationLine: "underline",
    marginBottom: 13,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  buttonBottom: {
    height: 0.4 * height,
  },
  footer: {
    height: 0.05 * height,
  },
});
