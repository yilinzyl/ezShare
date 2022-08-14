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
import { auth, db, cloudStorage } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import { IconButton, Button } from "react-native-paper";
import logo from "../assets/default-listing-icon.png";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const UserListingsScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const user = auth.currentUser;
  const [userName, setUserName] = useState("");
  const [posts, setPosts] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [reload, setReload] = useState(0);

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
          if (doc.data().imagePresent) {getImageUrl(doc.id);};
        });
        setPosts(getPostsFromFirebase);
      });
    return () => {
      subscriber1();
      subscriberListings();
    };
  }, ["userId"]);

  const getImageUrl = async (listingId) => {
    const result = await cloudStorage
           .ref("listingImages/" + listingId + ".jpg")
           .getDownloadURL();
    imageUrls[listingId] = result; 
    setReload(Math.random)
  }

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
          <Text style={styles.header}>{userName}</Text>
        </View>
      </View>
      <ScrollView horizontal={true}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("User Reviews", { userId: userId })
          }
          style={styles.myListingsButton}
        >
          <Text style={styles.horizontalButtonText}>Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("settings")}
          style={styles.settingsButton}
        >
          <Text style={styles.horizontalButtonText}>Listings</Text>
        </TouchableOpacity>
      </ScrollView>
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
              {/* {!post.imagePresent && <Image source={logo} style={styles.appLogo} />} */}
              {typeof imageUrls[post.key] === 'undefined' && <Image source={logo} style={styles.appLogo} />}
                  {typeof imageUrls[post.key] !== 'undefined' && post.imagePresent && <Image source={{uri: imageUrls[post.key]}} style={styles.appLogo} />}
              <View style={styles.listingTextContainer}>
                {post.listingName.length <= 25 && (
                  <Text style={styles.listingTitle}>
                    {post.listingName.replace(/(\r\n|\n|\r)/gm, " ")}
                  </Text>
                )}
                {post.listingName.length > 25 && (
                  <Text style={styles.listingTitle}>
                    {post.listingName
                      .replace(/(\r\n|\n|\r)/gm, " ")
                      .slice(0, 23)}
                    ...
                  </Text>
                )}
                {post.listingDescription.length <= 25 && (
                  <Text style={styles.listingText}>
                    {post.listingDescription.replace(/(\r\n|\n|\r)/gm, " ")}
                  </Text>
                )}
                {post.listingDescription.length > 25 && (
                  <Text style={styles.listingText}>
                    {post.listingDescription
                      .replace(/(\r\n|\n|\r)/gm, " ")
                      .slice(0, 23)}
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
        ))}
    </View>
  );
};

export default UserListingsScreen;

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
  horizontalButtonText: {
    fontFamily: "raleway-bold",
    color: "#262626",
    fontSize: (34 * width) / height,
    //alignSelf: "flex-start"
  },
});
