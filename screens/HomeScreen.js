import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Button,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import { IconButton } from "react-native-paper";
import logo from "../assets/lazada.jpg";

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

  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingJoiners, setLoadingJoiners] = useState(true);
  const [posts, setPosts] = useState([]);
  const [listingIds, setlistingIds] = useState([]);

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriberListings = db
      .collection("listing")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(),
            key: doc.id,
          });
        });
        setPosts(getPostsFromFirebase);
        setLoadingListings(false);
      });
    const getListingIdsFromFirebase = [];
    const subscriberPosts = db
      .collection("joined")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const joinedData = doc.data();
          if (user.uid == joinedData.userID) {
            getListingIdsFromFirebase.push(joinedData.listingID);
          }
        });
        setlistingIds(getListingIdsFromFirebase);
        setLoadingJoiners(false);
      });
    return () => {
      subscriberListings();
      subscriberPosts();
    };
  }, []);

  if (loadingListings || loadingJoiners) {
    return (
      <View>
        <Text style={styles.header}>Welcome to ezShare!</Text>
      </View>
    );
  }

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
        <Text style={styles.infoHeader}>Created by Me</Text>
        {posts
          .filter((post) => post.user == user.uid && !post.closed)
          .map((post) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("View Listing", { listingId: post.key })
              }
            >
              <View key={post.listingName} style={styles.listing}>
                {/* temporary image for testing purposes */}
                <Image source={logo} style={styles.appLogo} />
                <View style={styles.listingTextContainer}>
                  <Text style={styles.listingTitle}>{post.listingName}</Text>
                  <Text style={styles.listingText}>
                    {post.listingDescription}
                  </Text>
                  <Text style={styles.listingText}>{post.category}</Text>
                  <Text style={styles.listingCreator}>
                    Created by {post.username}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        <Text style={styles.infoHeader}>Joined Listings</Text>
        <Text style={styles.info}>Ready For Collection</Text>
        {posts
          .filter(
            (post) =>
              listingIds.includes(post.key) &&
              !post.closed &&
              post.readyForCollection
          )
          .map((post) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("View Listing", { listingId: post.key })
              }
            >
              <View key={post.listingName} style={styles.listing}>
                {/* temporary image for testing purposes */}
                <Image source={logo} style={styles.appLogo} />
                <View style={styles.listingTextContainer}>
                  <Text style={styles.listingTitle}>{post.listingName}</Text>
                  <Text style={styles.listingText}>
                    {post.listingDescription}
                  </Text>
                  <Text style={styles.listingText}>{post.category}</Text>
                  <Text style={styles.listingCreator}>
                    Created by {post.username}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        <Text style={styles.info}>Pending</Text>
        {posts
          .filter(
            (post) =>
              listingIds.includes(post.key) &&
              !post.closed &&
              !post.readyForCollection
          )
          .map((post) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("View Listing", { listingId: post.key })
              }
            >
              <View key={post.listingName} style={styles.listing}>
                {/* temporary image for testing purposes */}
                <Image source={logo} style={styles.appLogo} />
                <View style={styles.listingTextContainer}>
                  <Text style={styles.listingTitle}>{post.listingName}</Text>
                  <Text style={styles.listingText}>
                    {post.listingDescription}
                  </Text>
                  <Text style={styles.listingText}>{post.category}</Text>
                  <Text style={styles.listingCreator}>
                    Created by {post.username}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
            onPress={() => navigation.replace("Explore")}
          />
          <IconButton
            icon="account"
            color="#bababa"
            size={(80 * width) / height}
            onPress={() => navigation.replace("Profile")}
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
  appLogo: {
    height: height * 0.13,
    width: height * 0.13,
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
  info: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    marginLeft: width * 0.05,
    marginBottom: 15,
  },
  infoHeader: {
    fontFamily: "raleway-bold",
    fontSize: 18,
    color: "#404040",
    margin: 6,
    marginLeft: width * 0.05,
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
  listingContainer: {
    height: height * 0.67,
    backgroundColor: "#f9fafe",
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
    width: 0.6 * width,
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
});
