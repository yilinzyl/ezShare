import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import { IconButton, Button } from "react-native-paper";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const ProfileScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [value, setValue] = React.useState("first");
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Log In");
      })
      .then(console.log("Signed out"))
      .catch((error) => alert(error.message));
  };
  const handleCreateNew = () => {
    navigation.navigate("Create Listing");
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.name}>{user.displayName}'s</Text>
          <Text style={styles.header}>Profile</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.listingContainer}>
        <ScrollView horizontal={true}>
          <TouchableOpacity
            onPress={() => console.log("settings")}
            style={styles.settingsButton}
          >
            <Text style={styles.horizontalButtonText}>My Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.replace("My Listings")}
            style={styles.myListingsButton}
          >
            <Text style={styles.horizontalButtonText}>View My Listings</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.subheaderContainer}>
          <Text style={styles.subheader}>Settings</Text>
        </View>
        <Button
          onPress={() => navigation.replace("Edit")}
          style={styles.optionsButton}
          labelStyle={styles.optionsButtonText}
          uppercase={false}
          compact={true}
          icon="pencil"
        >
          Edit Profile
        </Button>
        <Button
          onPress={() => navigation.replace("Password")}
          style={styles.optionsButton}
          labelStyle={styles.optionsButtonText}
          uppercase={false}
          compact={true}
          icon="lock"
        >
          Change password
        </Button>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerContainer}>
          <IconButton
            icon="home"
            color="#bababa"
            size={(80 * width) / height}
            onPress={() => navigation.replace("Home")}
          />
          <IconButton
            icon="magnify"
            color="#bababa"
            size={(80 * width) / height}
            onPress={() => navigation.navigate("Explore")}/>
          <IconButton
            icon="account"
            color="#b0c0f9"
            size={(80 * width) / height}
            onPress={() => console.log("Pressed")}
          />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#ffebed",
  },
  signOutButton: {
    backgroundColor: "#F898A3",
    height: 45,
    width: width * 0.33,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButton: {
    height: height * 0.07,
    width: width * 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#F898A3",
    borderBottomWidth: 3,
    backgroundColor: "#f0f0f0",
  },
  myListingsButton: {
    height: height * 0.07,
    width: width * 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#f2f2f2",
    borderBottomWidth: 3,
    borderRightColor: "#f2f2f2",
    borderRightWidth: 3,
  },
  optionsButton: {
    height: height * 0.07,
    justifyContent: "center",
    borderTopColor: "#eeedff",
    borderTopWidth: 3,
    alignItems: "flex-start"
  },
  horizontalButtonText: {
    fontFamily: "raleway-bold",
    color: "#262626",
    fontSize: (34 * width) / height,
    //alignSelf: "flex-start"
  },
  optionsButtonText: {
    fontFamily: "raleway-regular",
    color: "#262626",
    fontSize: (32 * width) / height,
    marginRight: width * 0.6,
    marginLeft: width * 0.05
    //alignSelf: "flex-start"
  },
  buttonText: {
    fontFamily: "raleway-bold",
    color: "#F9FAFE",
    fontSize: (32 * width) / height,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: height * 0.25,
    marginLeft: width * 0.1,
    marginRight: width * 0.1,
    marginBottom: height * 0.02,
  },
  header: {
    fontFamily: "raleway-bold",
    fontSize: (70 * width) / height,
  },
  subheaderContainer: {
    height: height * 0.07,
    justifyContent: "center",
  },
  subheader: {
    fontFamily: "raleway-bold",
    fontSize: (36 * width) / height,
    marginLeft: width * 0.1
  },
  name: {
    fontFamily: "raleway-bold",
    fontSize: (70 * width) / height,
  },
  listingContainer: {
    height: height * 0.62,
    backgroundColor: "#F9FAFE",
  },
  listing: {
    borderRadius: 20,
    backgroundColor: "#F9FAFE",
    borderColor: "#b0c0f9",
    //borderWidth: 2,
    height: height * 0.15,
    width: width * 0.8,
    marginLeft: width * 0.1,
    marginRight: width * 0.1,
    marginTop: height * 0.02,
  },
  footer: {
    backgroundColor: "#f2f2f2",
    height: height * 0.13,
  },
  footerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: height * 0.012,
  },
});
