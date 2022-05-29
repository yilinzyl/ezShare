import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Button,
} from "react-native";
import React from "react";
import { auth } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import { IconButton } from "react-native-paper";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const HomeScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Log In");
      })
      .then(console.log("Signed out"))
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.header}>Active</Text>
          <Text style={styles.header}>Listings</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Create Listing")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Create New</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.listingContainer}>
        <View style={styles.listing}></View>
        <View style={styles.listing}></View>
        <View style={styles.listing}></View>
        <View style={styles.listing}></View>
        <View style={styles.listing}></View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerContainer}>
          <IconButton
            icon="home"
            color="#B0C0F9"
            size={(80 * width) / height}
            onPress={() => console.log("Pressed")}
          />
          <IconButton
            icon="magnify"
            color="#bababa"
            size={(80 * width) / height}
            onPress={() => console.log("Pressed")}
          />
          <IconButton
            icon="account"
            color="#bababa"
            size={(80 * width) / height}
            onPress={() => navigation.navigate("Profile")}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#f9fafe",
  },
  button: {
    backgroundColor: "#F898A3",
    height: width * 0.125,
    width: width * 0.4,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "raleway-bold",
    color: "#F9FAFE",
    fontSize: (40 * width) / height,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: height * 0.2,
    marginLeft: width * 0.08,
    marginRight: width * 0.08,
    marginBottom: height * 0.02,
  },
  header: {
    fontFamily: "raleway-bold",
    fontSize: (70 * width) / height,
  },
  name: {
    fontFamily: "raleway-bold",
    fontSize: (60 * width) / height,
  },
  listingContainer: {
    height: height * 0.67,
  },
  listing: {
    borderRadius: 20,
    backgroundColor: "#bababa",
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
