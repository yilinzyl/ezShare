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
import logo from "../assets/default-listing-icon.png";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const HomeScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();

  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingJoiners, setLoadingJoiners] = useState(true);
  const [posts, setPosts] = useState([]);

  const [acceptedListingIds, setAcceptedListingIds] = useState([]);
  const [declinedListingIds, setDeclinedListingIds] = useState([]);
  const [pendingListingIds, setPendingListingIds] = useState([]);

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
    const getAcceptedListingIdsFromFirebase = [];
    const getDeclinedListingIdsFromFirebase = [];
    const getPendingListingIdsFromFirebase = [];
    const subscriberPosts = db
      .collection("joined")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const joinedData = doc.data();
          if (
            user.uid == joinedData.userID &&
            !joinedData.completed &&
            !joinedData.hidden
          ) {
            if (joinedData.approved) {
              getAcceptedListingIdsFromFirebase.push(joinedData.listingID);
            } else if (joinedData.declinedReason != "") {
              getDeclinedListingIdsFromFirebase.push(joinedData.listingID);
            } else {
              getPendingListingIdsFromFirebase.push(joinedData.listingID);
            }
          }
        });
        setAcceptedListingIds(getAcceptedListingIdsFromFirebase);
        setDeclinedListingIds(getDeclinedListingIdsFromFirebase);
        setPendingListingIds(getPendingListingIdsFromFirebase);
        setLoadingJoiners(false);
      });
    return () => {
      subscriberListings();
      subscriberPosts();
    };
  }, []);

  if (loadingListings || loadingJoiners) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "raleway-bold",
            color: "#b8c4fc",
            fontSize: (50 * width) / height,
            textAlign: "center",
          }}
        >
          Welcome to ezShare!
        </Text>
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
                              <IconButton
                      icon="plus-thick"
                      size={0.08 * width}
                      color='white'
                      />
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
              <View key={post.user + post.listDate} style={styles.listing}>
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
                  {post.listingDescription.length <= 60 && (
                    <Text style={styles.listingText}>
                      {post.listingDescription.replace(/(\r\n|\n|\r)/gm, " ")}
                    </Text>
                  )}
                  {post.listingDescription.length > 60 && (
                    <Text style={styles.listingText}>
                      {post.listingDescription
                        .replace(/(\r\n|\n|\r)/gm, " ")
                        .slice(0, 60)}
                      ...
                    </Text>
                  )}
                  <Text style={styles.listingText}>{post.category}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconButton
                      icon="timer-sand"
                      size={0.035 * width}
                      style={{
                        marginLeft: 0,
                        marginRight: -0.005 * width,
                        marginTop: 0.005 * width,
                        marginBottom: -0.005 * width,
                      }}
                    />
                    <Text style={styles.statusText}>
                      {new Date(
                        post.cutOffDate.seconds * 1000 +
                          post.cutOffDate.nanoseconds / 1000000
                      ).toString()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {post.confirmed && post.status != "Group buy cancelled" && (
                      <IconButton
                        icon="progress-check"
                        size={0.035 * width}
                        style={{
                          marginLeft: 0,
                          marginRight: -0.005 * width,
                          marginTop: -0.005 * width,
                          marginBottom: -0.005 * width,
                        }}
                      />
                    )}
                    {post.status == "Group buy cancelled" && (
                      <IconButton
                        icon="progress-alert"
                        size={0.035 * width}
                        color="red"
                        style={{
                          marginLeft: 0,
                          marginRight: -0.005 * width,
                          marginTop: -0.005 * width,
                          marginBottom: -0.005 * width,
                        }}
                      />
                    )}
                    {!post.confirmed && post.status != "Group buy cancelled" && (
                      <IconButton
                        icon="progress-question"
                        size={0.035 * width}
                        style={{
                          marginLeft: 0,
                          marginRight: -0.005 * width,
                          marginTop: -0.005 * width,
                          marginBottom: -0.005 * width,
                        }}
                      />
                    )}
                    {post.status != "Group buy cancelled" && (
                      <Text style={styles.statusText}>{post.status}</Text>
                    )}
                    {post.status == "Group buy cancelled" && (
                      <Text style={[styles.statusText, { color: "red" }]}>
                        {post.status}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        <Text style={styles.infoHeader}>Joined Listings</Text>
        {posts
          .filter((post) => acceptedListingIds.includes(post.key))
          .map((post) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("View Listing", { listingId: post.key })
              }
            >
              <View key={post.listingDate + post.user} style={styles.listing}>
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
                  {post.listingDescription.length <= 60 && (
                    <Text style={styles.listingText}>
                      {post.listingDescription.replace(/(\r\n|\n|\r)/gm, " ")}
                    </Text>
                  )}
                  {post.listingDescription.length > 60 && (
                    <Text style={styles.listingText}>
                      {post.listingDescription
                        .replace(/(\r\n|\n|\r)/gm, " ")
                        .slice(0, 60)}
                      ...
                    </Text>
                  )}
                  <Text style={styles.listingCreator}>
                    Created by {post.username}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconButton
                      icon="sticker-check-outline"
                      size={0.035 * width}
                      style={{
                        marginLeft: 0,
                        marginRight: -0.005 * width,
                        marginTop: 0.005 * width,
                        marginBottom: -0.005 * width,
                      }}
                    />
                    <Text style={styles.statusText}>Order accepted</Text>
                  </View>
                  {post.status != "Ready for Collection" &&
                    post.status != "Group buy cancelled" && (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {post.confirmed && (
                          <IconButton
                            icon="progress-check"
                            size={0.035 * width}
                            style={{
                              marginLeft: 0,
                              marginRight: -0.005 * width,
                              marginTop: -0.005 * width,
                              marginBottom: -0.005 * width,
                            }}
                          />
                        )}
                        {!post.confirmed && (
                          <IconButton
                            icon="progress-question"
                            size={0.035 * width}
                            style={{
                              marginLeft: 0,
                              marginRight: -0.005 * width,
                              marginTop: -0.005 * width,
                              marginBottom: -0.005 * width,
                            }}
                          />
                        )}
                        <Text style={styles.statusText}>{post.status}</Text>
                      </View>
                    )}
                  {post.status == "Ready for Collection" && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <IconButton
                        icon="check-circle-outline"
                        size={0.035 * width}
                        color="green"
                        style={{
                          marginLeft: 0,
                          marginRight: -0.005 * width,
                          marginTop: -0.005 * width,
                          marginBottom: -0.005 * width,
                        }}
                      />
                      <Text style={[styles.statusText, { color: "green" }]}>
                        {post.status}
                      </Text>
                    </View>
                  )}
                  {post.status == "Group buy cancelled" && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <IconButton
                        icon="progress-alert"
                        size={0.035 * width}
                        color="red"
                        style={{
                          marginLeft: 0,
                          marginRight: -0.005 * width,
                          marginTop: -0.005 * width,
                          marginBottom: -0.005 * width,
                        }}
                      />
                      <Text style={[styles.statusText, { color: "red" }]}>
                        {post.status}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        {posts
          .filter((post) => pendingListingIds.includes(post.key))
          .map((post) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("View Listing", { listingId: post.key })
              }
            >
              <View key={post.listingDate + post.user} style={styles.listing}>
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
                  {post.listingDescription.length <= 60 && (
                    <Text style={styles.listingText}>
                      {post.listingDescription.replace(/(\r\n|\n|\r)/gm, " ")}
                    </Text>
                  )}
                  {post.listingDescription.length > 60 && (
                    <Text style={styles.listingText}>
                      {post.listingDescription
                        .replace(/(\r\n|\n|\r)/gm, " ")
                        .slice(0, 60)}
                      ...
                    </Text>
                  )}
                  <Text style={styles.listingCreator}>
                    Created by {post.username}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconButton
                      icon="sticker-outline"
                      size={0.035 * width}
                      style={{
                        marginLeft: 0,
                        marginRight: -0.005 * width,
                        marginTop: 0.005 * width,
                        marginBottom: -0.005 * width,
                      }}
                    />
                    <Text style={styles.statusText}>Pending Acceptance</Text>
                  </View>
                  {post.status != "Ready for Collection" &&
                    post.status != "Group buy cancelled" && (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {post.confirmed && (
                          <IconButton
                            icon="progress-check"
                            size={0.035 * width}
                            style={{
                              marginLeft: 0,
                              marginRight: -0.005 * width,
                              marginTop: -0.005 * width,
                              marginBottom: -0.005 * width,
                            }}
                          />
                        )}
                        {!post.confirmed && (
                          <IconButton
                            icon="progress-question"
                            size={0.035 * width}
                            style={{
                              marginLeft: 0,
                              marginRight: -0.005 * width,
                              marginTop: -0.005 * width,
                              marginBottom: -0.005 * width,
                            }}
                          />
                        )}
                        <Text style={styles.statusText}>{post.status}</Text>
                      </View>
                    )}
                  {post.status == "Ready for Collection" && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <IconButton
                        icon="check-circle-outline"
                        size={0.035 * width}
                        color="green"
                        style={{
                          marginLeft: 0,
                          marginRight: -0.005 * width,
                          marginTop: -0.005 * width,
                          marginBottom: -0.005 * width,
                        }}
                      />
                      <Text style={[styles.statusText, { color: "green" }]}>
                        {post.status}
                      </Text>
                    </View>
                  )}
                  {post.status == "Group buy cancelled" && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <IconButton
                        icon="progress-alert"
                        size={0.035 * width}
                        color="red"
                        style={{
                          marginLeft: 0,
                          marginRight: -0.005 * width,
                          marginTop: -0.005 * width,
                          marginBottom: -0.005 * width,
                        }}
                      />
                      <Text style={[styles.statusText, { color: "red" }]}>
                        {post.status}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        {posts
          .filter((post) => declinedListingIds.includes(post.key))
          .map((post) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("View Listing", { listingId: post.key })
              }
            >
              <View key={post.listingDate + post.user} style={styles.listing}>
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
                  {post.listingDescription.length <= 60 && (
                    <Text style={styles.listingText}>
                      {post.listingDescription.replace(/(\r\n|\n|\r)/gm, " ")}
                    </Text>
                  )}
                  {post.listingDescription.length > 60 && (
                    <Text style={styles.listingText}>
                      {post.listingDescription
                        .replace(/(\r\n|\n|\r)/gm, " ")
                        .slice(0, 60)}
                      ...
                    </Text>
                  )}
                  <Text style={styles.listingCreator}>
                    Created by {post.username}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <IconButton
                      icon="sticker-alert-outline"
                      size={0.035 * width}
                      color="red"
                      style={{
                        marginLeft: 0,
                        marginRight: -0.005 * width,
                        marginTop: 0.005 * width,
                        marginBottom: -0.005 * width,
                      }}
                    />
                    <Text style={[styles.statusText, { color: "red" }]}>
                      Order Rejected
                    </Text>
                  </View>
                  {post.status != "Ready for Collection" &&
                    post.status != "Group buy cancelled" && (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {post.confirmed && (
                          <IconButton
                            icon="progress-check"
                            size={0.035 * width}
                            style={{
                              marginLeft: 0,
                              marginRight: -0.005 * width,
                              marginTop: -0.005 * width,
                              marginBottom: -0.005 * width,
                            }}
                          />
                        )}
                        {!post.confirmed && (
                          <IconButton
                            icon="progress-question"
                            size={0.035 * width}
                            style={{
                              marginLeft: 0,
                              marginRight: -0.005 * width,
                              marginTop: -0.005 * width,
                              marginBottom: -0.005 * width,
                            }}
                          />
                        )}
                        <Text style={styles.statusText}>{post.status}</Text>
                      </View>
                    )}
                  {post.status == "Ready for Collection" && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <IconButton
                        icon="check-circle-outline"
                        size={0.035 * width}
                        color="green"
                        style={{
                          marginLeft: 0,
                          marginRight: -0.005 * width,
                          marginTop: -0.005 * width,
                          marginBottom: -0.005 * width,
                        }}
                      />
                      <Text style={[styles.statusText, { color: "green" }]}>
                        {post.status}
                      </Text>
                    </View>
                  )}
                  {post.status == "Group buy cancelled" && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <IconButton
                        icon="progress-alert"
                        size={0.035 * width}
                        color="red"
                        style={{
                          marginLeft: 0,
                          marginRight: -0.005 * width,
                          marginTop: -0.005 * width,
                          marginBottom: -0.005 * width,
                        }}
                      />
                      <Text style={[styles.statusText, { color: "red" }]}>
                        {post.status}
                      </Text>
                    </View>
                  )}
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
            onPress={() => navigation.navigate("Explore")}
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
    width: width * 0.125,
    borderRadius: 10,
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
    height: height * 0.7,
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
    //marginLeft: 0.05 * width,
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
  statusText: {
    fontFamily: "raleway-regular",
    color: "#707070",
    fontSize: (20 * width) / height,
  },
});
