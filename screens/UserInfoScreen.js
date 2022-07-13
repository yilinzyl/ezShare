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
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import { IconButton, Button } from "react-native-paper";
import logo from "../assets/lazada.jpg";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const UserInfoScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const user = auth.currentUser;
  const [userName, setUserName] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const subscriber1 = db
      .collection("users")
      .doc(userId)
      .onSnapshot((documentSnapshot) => {
        const userData = documentSnapshot.data();
        setUserName(userData.name);
      });
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
      });
  });

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <IconButton
          icon="arrow-left"
          color="#B0C0F9"
          size={0.08 * width}
          style={{ marginLeft: width * -0.02 }}
          onPress={() => navigation.goBack()}
        />
        <View>
          <Text style={styles.smallHeader}>View Posts by</Text>
          <Text style={styles.header}>{userName}</Text>
        </View>
      </View>
      {posts
        .filter((post) => post.user == userId && !post.closed)
        .map((post) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("View Listing", { listingId: post.key })
            }
          >
            <View key={post.user + post.listDate} style={styles.listing}>
              {/* temporary image for testing purposes */}
              <Image source={logo} style={styles.appLogo} />
              <View style={styles.listingTextContainer}>
                <Text style={styles.listingTitle}>{post.listingName}</Text>
                {post.listingDescription.length <= 30 && (
                  <Text style={styles.listingText}>
                    {post.listingDescription}
                  </Text>
                )}
                {post.listingDescription.length > 30 && (
                  <Text style={styles.listingText}>
                    {post.listingDescription.slice(0, 30)}...
                  </Text>
                )}
                <Text style={styles.listingText}>{post.category}</Text>
                <Text style={styles.listingCreator}>
                  Created by {post.username}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default UserInfoScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#ffebed",
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
  smallHeader: {
    fontFamily: "raleway-regular",
    fontSize: (45 * width) / height,
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
  appLogo: {
    height: height * 0.13,
    width: height * 0.13,
  },
});
