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
import { auth, db, cloudStorage } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import { IconButton } from "react-native-paper";
import logo from "../assets/default-listing-icon.png";

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
  const [imageUrls, setImageUrls] = useState({});
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriber = db.collection("listing").onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        getPostsFromFirebase.push({
          ...doc.data(),
          key: doc.id,
        });
        if (doc.data().imagePresent) {getImageUrl(doc.id);};
      });
      setPosts(getPostsFromFirebase);
      setLoading(false); 
    });
    return () => subscriber();
  }, []);

  const getImageUrl = async (listingId) => {
    const result = await cloudStorage
           .ref("listingImages/" + listingId + ".jpg")
           .getDownloadURL();
    imageUrls[listingId] = result; 
    setReload(Math.random)
  }

  if (loading) {
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
          Loading...
        </Text>
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
                  {typeof imageUrls[post.key] === 'undefined' && <Image source={logo} style={styles.appLogo} />}
                  {typeof imageUrls[post.key] !== 'undefined' && post.imagePresent && <Image source={{uri: imageUrls[post.key]}} style={styles.appLogo} />}
                  {/* <Image source={logo} style={styles.appLogo} /> */}
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
                    <View style={styles.statusContainer}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        {post.confirmed && (
                          <IconButton
                            icon="checkbox-outline"
                            size={0.035 * width}
                            style={{
                              marginLeft: 0,
                              marginRight: 0,
                            }}
                          />
                        )}
                        {!post.confirmed && (
                          <IconButton
                            icon="checkbox-blank-outline"
                            size={0.035 * width}
                            style={{
                              marginLeft: 0,
                              marginRight: 0,
                            }}
                          />
                        )}
                      </View>
                      {post.mailingMethod != "" && (
                        <IconButton
                          icon="truck"
                          size={0.035 * width}
                          style={{
                            marginLeft: 0,
                            marginRight: 0,
                          }}
                        />
                      )}
                      {post.collectionPoint != "" && (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <IconButton
                            icon="map-marker"
                            size={0.035 * width}
                            style={{
                              marginLeft: 0,
                              marginRight: -0.01 * width,
                            }}
                          />
                          {post.collectionPoint.length > 35 && (
                            <Text style={styles.statusText}>
                              {post.collectionPoint.slice(0, 35)} ...
                            </Text>
                          )}
                          {post.collectionPoint.length <= 35 && (
                            <Text style={styles.statusText}>
                              {post.collectionPoint}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
        ) : (
            <Text style={{    fontFamily: "raleway-regular",
            fontSize: (30 * width) / height,
            marginLeft: 0.1 * width,
            }}>no posts yet</Text>
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
  statusContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: -0.02 * width,
  },
  statusText: {
    fontFamily: "raleway-regular",
    color: "#707070",
    fontSize: (20 * width) / height,
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
