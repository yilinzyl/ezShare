import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
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

const ProfileScreen = () => {
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
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.listingContainer}></ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerContainer}>
          <IconButton
            icon="home"
            color="#bababa"
            size={(80 * width) / height}
            onPress={() => navigation.navigate("Home")}
          />
          <IconButton
            icon="magnify"
            color="#bababa"
            size={(80 * width) / height}
            onPress={() => console.log("Pressed")}
          />
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
    backgroundColor: "#f9fafe",
  },
  button: {
    backgroundColor: "#F898A3",
    height: 50,
    width: width * 0.33,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
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
    height: height * 0.2,
    marginLeft: width * 0.1,
    marginRight: width * 0.1,
    marginBottom: height * 0.02,
  },
  header: {
    fontFamily: "raleway-bold",
    fontSize: (70 * width) / height,
  },
  name: {
    fontFamily: "raleway-bold",
    fontSize: (70 * width) / height,
  },
  listingContainer: {
    height: height * 0.67,
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
    backgroundColor: "#f9FAFE",
    height: height * 0.13,
  },
  footerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: height * 0.012,
  },
});
