import {
  StyleSheet,
  Text,
  View,
  TextInput,
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

const KeywordSearchScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState("....");
  const word = "Cherries";

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

  if (loading) {
    return (
      <View>
        <Text style={styles.header}>"Loading..."</Text>
      </View>
    );
  }
  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <IconButton
          icon="arrow-left"
          color="#B0C0F9"
          size={0.035 * height}
          style={{ marginLeft: width * -0.7 }}
          onPress={() => navigation.navigate("Explore")}
        />
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter keyword"
            //value={keyword}
            onChangeText={(text) => setKeyword(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.headerContainerHorizontal}>
          <Text style={styles.header}>Search by Keyword</Text>
          {/* <TouchableOpacity
            onPress={() => handleSearch()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <ScrollView style={styles.listingContainer}>
        {posts.length > 0 ? (
          posts
            .filter((post) => post.listingName != null && post.acceptingOrders)
            .filter(
              (post) =>
                keyword != "" &&
                (post.listingName
                  .toLowerCase()
                  .includes(keyword.toLowerCase()) ||
                  post.category.toLowerCase().includes(keyword.toLowerCase()))
            )
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
            ))
        ) : (
          <Text>no posts yet</Text>
        )}
      </ScrollView>
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
            color="#b0c0f9"
            size={(80 * width) / height}
            onPress={() => navigation.navigate("Explore")}
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

export default KeywordSearchScreen;

const styles = StyleSheet.create({
  appLogo: {
    height: height * 0.13,
    width: height * 0.13,
  },
  background: {
    backgroundColor: "#eeedff",
  },
  button: {
    backgroundColor: "#F898A3",
    height: 50,
    width: width * 0.2,
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
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    height: height * 0.25,
    marginRight: width * 0.1,
    marginBottom: height * 0.02,
  },
  headerContainerHorizontal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: 0.8 * width,
    marginLeft: 0.075 * width,
  },
  header: {
    fontFamily: "raleway-bold",
    fontSize: (54 * width) / height,
  },
  listingContainer: {
    height: height * 0.62,
    backgroundColor: "#f9fafe",
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
  inputBox: {
    borderColor: "#B0C0F9",
    borderWidth: 2,
    borderRadius: 10,
    width: width * 0.85,
    height: height * 0.05,
    marginLeft: width * 0.075,
    marginBottom: height * 0.02,
  },
  input: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 6,
  },
});
