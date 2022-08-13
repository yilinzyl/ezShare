import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import logo from "../assets/default-listing-icon.png";
import { IconButton, Button } from "react-native-paper";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const MyListingsScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriber = db.collection("listing").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getPostsFromFirebase.push({
          ...doc.data(),
          key: doc.id,
        });
      });
      setPosts(getPostsFromFirebase);
      setLoading(false);
    });

    return () => subscriber();
  }, []);

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
      <ScrollView horizontal={true}>
        <TouchableOpacity
          onPress={() => navigation.replace("Profile")}
          style={styles.settingsButton}
        >
          <Text style={styles.horizontalButtonText}>My Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("my listings")}
          style={styles.myListingsButton}
        >
          <Text style={styles.horizontalButtonText}>View My Listings</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.subheaderContainer}>
        <Text style={styles.subheader}>
          Listings Created by {user.displayName}
        </Text>
      </View>
      <ScrollView style={styles.listingContainer}>
        {posts.length > 0 ? (
          posts
            .filter((post) => post.listingName != null)
            .filter((post) => post.user == user.uid)
            .map((post) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("View Listing", { listingId: post.key })
                }
              >
                <View key={post.listingName} style={styles.listing}>
                  {/* temporary image for testing purposes */}
                  {/* <Image source={logo} style={styles.appLogo} /> */}
                  <View style={styles.listingTextContainer}>
                    {post.listingName.length <= 50 && (
                      <Text style={styles.listingTitle}>
                        {post.listingName.replace(/(\r\n|\n|\r)/gm, " ")}
                      </Text>
                    )}
                    {post.listingName.length > 50 && (
                      <Text style={styles.listingTitle}>
                        {post.listingName
                          .replace(/(\r\n|\n|\r)/gm, " ")
                          .slice(0, 50)}
                        ...
                      </Text>
                    )}
                    {post.listingDescription.length <= 55 && (
                      <Text style={styles.listingText}>
                        {post.listingDescription.replace(/(\r\n|\n|\r)/gm, " ")}
                      </Text>
                    )}
                    {post.listingDescription.length > 55 && (
                      <Text style={styles.listingText}>
                        {post.listingDescription
                          .replace(/(\r\n|\n|\r)/gm, " ")
                          .slice(0, 55)}
                        ...
                      </Text>
                    )}
                    <Text style={styles.listingText}>{post.category}</Text>
                    <Text style={styles.listingCreator}>
                      Created by {post.username}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
        ) : (
          <Text style={styles.subheader}>
            You have not created any listings.
          </Text>
        )}
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
            onPress={() => navigation.replace("Explore")}
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

export default MyListingsScreen;

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
  myListingsButton: {
    height: height * 0.07,
    width: width * 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#F898A3",
    borderBottomWidth: 3,
    borderRightColor: "#f2f2f2",
  },
  settingsButton: {
    height: height * 0.07,
    width: width * 0.5,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#f2f2f2",
    borderBottomWidth: 3,
    borderRightColor: "#f2f2f2",
    borderRightWidth: 3,
    backgroundColor: "#f9fafe",
  },
  optionsButton: {
    height: height * 0.07,
    justifyContent: "center",
    borderTopColor: "#eeedff",
    borderTopWidth: 3,
    alignItems: "flex-start",
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
    marginLeft: width * 0.05,
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
    backgroundColor: "#f9fafe",
  },
  subheader: {
    fontFamily: "raleway-bold",
    fontSize: (36 * width) / height,
    marginLeft: width * 0.1,
  },
  name: {
    fontFamily: "raleway-bold",
    fontSize: (70 * width) / height,
  },
  appLogo: {
    height: height * 0.13,
    width: height * 0.13,
  },
  listingContainer: {
    height: height * 0.48,
    backgroundColor: "#F9FAFE",
  },
  listing: {
    backgroundColor: "#f9fafe",
    height: height * 0.15,
    display: "flex",
    flexDirection: "row",
    borderColor: "#eeedff",
    borderTopWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  listingTextContainer: {
    marginLeft: 0.05 * width,
    width: 0.85 * width,
  },
  listingTitle: {
    fontFamily: "raleway-bold",
    color: "#262626",
    fontSize: (30 * width) / height,
  },
  listingText: {
    fontFamily: "raleway-regular",
    color: "#707070",
    fontSize: (30 * width) / height,
  },
  listingCreator: {
    fontFamily: "raleway-bold",
    color: "#B0C0F9",
    fontSize: (30 * width) / height,
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
