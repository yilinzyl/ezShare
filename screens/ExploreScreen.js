import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db, cloudStorage } from "../firebase";
import { NavigationContainer } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import { IconButton } from "react-native-paper";
// import logo from "../assets/default-listing-icon.png";
import logo from "../assets/default-listing-icon.png";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const ExploreScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Find something that interests you");
  const [images, setImages] = useState({});

  const getImage = (listingId) => {
    return cloudStorage
      .ref("listingImages/" + listingId + ".jpg")
      .getDownloadURL();
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

  useEffect(() => {
    const getImagesFromFirebase = {};
    let numImages = 0;
    let currImages = 0;
    if (!loading) {
      posts.forEach((doc) => {
        if (doc.imagePresent) {
          numImages++;
          getImage(doc.key)
            .then((uid) => {
              currImages++;
              getImagesFromFirebase[doc.key] = uid;
              console.log("done");
              if (numImages == currImages) {
                setImages(getImagesFromFirebase);
              }
            })
            .catch((e) => {
              currImages++;
              getImagesFromFirebase[doc.key] =
                Image.resolveAssetSource(logo).uri;
              console.log("error");
              if (numImages == currImages) {
                console.log(getImagesFromFirebase);
                setImages(getImagesFromFirebase);
                console.log(images);
              }
            });
        }
      });
    }
  }, []);

  // useEffect(() => {
  //   const getImagesFromFirebase = {};
  //   let numImages = 0;
  //   let currImages = 0;

  //   const getImage = async (listingId) => {
  //     // try {
  //     console.log("defined");
  //     const uid = await cloudStorage
  //       .ref("listingImages/" + listingId + ".jpg")
  //       .getDownloadURL();
  //     getImagesFromFirebase[listingId] = uid;
  //     console.log(uid);
  //     currImages++;
  //     if (numImages == currImages) {
  //       console.log(getImagesFromFirebase);
  //       setImages(getImagesFromFirebase);
  //       console.log(images);
  //     }
  //     // } catch (err) {
  //     //   getImagesFromFirebase[listingId] = Image.resolveAssetSource(logo).uri;
  //     //   currImages++;
  //     //   if (numImages == currImages) {
  //     //     console.log(getImagesFromFirebase);
  //     //     setImages(getImagesFromFirebase);
  //     //     console.log(images);
  //     //   }
  //     // }
  //   };

  //   if (!loading) {
  //     posts.forEach((doc) => {
  //       getImage(doc.key);
  //       numImages++;
  //     });
  //   }
  // }, []);

  const handleFood = () => setCategory("Food");
  const handleFashion = () => setCategory("Fashion");
  const handleSports = () => setCategory("Sports");
  const handleElectronics = () => setCategory("Electronics");
  const handleEntertainment = () => setCategory("Entertainment");
  const handleOthers = () => setCategory("Others");

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContainerHorizontal}>
          <Text style={styles.header}>Explore</Text>
          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Keyword")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Search by Keyword</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("User Search")}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Search by User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView horizontal={true} style={styles.headerContainerScroll}>
        <TouchableOpacity
          onPress={() => setCategory("Find something that interests you")}
          style={styles.shortCatButton}
        >
          <Text style={styles.catButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFood()} style={styles.catButton}>
          <Text style={styles.catButtonText}>Food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleFashion()}
          style={styles.catButton}
        >
          <Text style={styles.catButtonText}>Fashion</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSports()}
          style={styles.catButton}
        >
          <Text style={styles.catButtonText}>Sports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleElectronics()}
          style={styles.longCatButton}
        >
          <Text style={styles.catButtonText}>Electronics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleEntertainment()}
          style={styles.longCatButton}
        >
          <Text style={styles.catButtonText}>Entertainment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleOthers()}
          style={styles.catButton}
        >
          <Text style={styles.catButtonText}>Others</Text>
        </TouchableOpacity>
      </ScrollView>
      <ScrollView style={styles.listingContainer}>
        <Text style={styles.catNameText}>{category}</Text>
        {posts.length > 0 ? (
          posts
            .filter((post) => post.listingName != null && post.acceptingOrders)
            .filter(
              (post) =>
                post.category.toLowerCase().includes(category.toLowerCase()) ||
                category == "Find something that interests you"
            )
            .map((post) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("View Listing", { listingId: post.key })
                }
              >
                <View key={post.user + post.listDate} style={styles.listing}>
                  {/* temporary image for testing purposes */}
                  {/* {post.imagePresent && (
                    <Image
                      source={{ uri: images[post.key] }}
                      style={styles.appLogo}
                    />
                  )} */}
                  {/* {!post.imagePresent && (
                    <Image source={logo} style={styles.appLogo} />
                  )} */}
                  <Image source={logo} style={styles.appLogo} />
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
                          .slice(0, 30)}
                        ...
                      </Text>
                    )}
                    {post.listingDescription.length <= 30 && (
                      <Text style={styles.listingText}>
                        {post.listingDescription.replace(/(\r\n|\n|\r)/gm, " ")}
                      </Text>
                    )}
                    {post.listingDescription.length > 30 && (
                      <Text style={styles.listingText}>
                        {post.listingDescription
                          .replace(/(\r\n|\n|\r)/gm, " ")
                          .slice(0, 30)}
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
          <Text>no posts yet</Text>
        )}
        <View style={styles.endPageContainer}>
          <Text style={styles.endPageText}>
            Can't seem to find what you're looking for?
          </Text>
          <Text style={styles.endPageText}>Start your own Group Buy!</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Create Listing")}
            style={styles.createButton}
          >
            <Text style={styles.buttonText}>Create Listing</Text>
          </TouchableOpacity>
        </View>
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
            color="#b0c0f9"
            size={(80 * width) / height}
            onPress={() => console.log("Pressed")}
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

export default ExploreScreen;

const styles = StyleSheet.create({
  appLogo: {
    height: height * 0.13,
    width: height * 0.13,
  },
  background: {
    backgroundColor: "#eeedff",
  },
  button: {
    backgroundColor: "#b0c0f9",
    height: 45,
    width: width * 0.4,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.005,
  },
  createButton: {
    backgroundColor: "#F898A3",
    height: 50,
    width: width * 0.33,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  catButton: {
    //backgroundColor: "#e4e6f0",
    height: height * 0.06,
    width: width * 0.15,
    alignItems: "center",
    justifyContent: "center",
  },
  shortCatButton: {
    //backgroundColor: "#e4e6f0",
    height: height * 0.06,
    width: width * 0.12,
    alignItems: "center",
    justifyContent: "center",
  },
  longCatButton: {
    //backgroundColor: "#e4e6f0",
    height: height * 0.06,
    width: width * 0.28,
    alignItems: "center",
    justifyContent: "center",
  },
  catButtonText: {
    fontFamily: "raleway-bold",
    color: "#262626",
    fontSize: (30 * width) / height,
  },
  catNameText: {
    fontFamily: "raleway-bold",
    color: "#262626",
    fontSize: (40 * width) / height,
    marginLeft: 0.1 * width,
    marginTop: 0.03 * height,
  },
  buttonText: {
    fontFamily: "raleway-bold",
    color: "white",
    fontSize: (30 * width) / height,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    height: height * 0.2,
    marginRight: width * 0.1,
    marginBottom: height * 0.02,
  },
  headerContainerHorizontal: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: 0.8 * width,
    marginLeft: width * 0.1,
  },
  headerContainerScroll: {
    height: height * 0.06,
  },
  header: {
    fontFamily: "raleway-bold",
    fontSize: (70 * width) / height,
  },
  listingContainer: {
    height: height * 0.61,
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
  endPageContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  endPageText: {
    fontFamily: "raleway-bold",
    color: "#545454",
    fontSize: (36 * width) / height,
    marginTop: 0.03 * height,
    marginHorizontal: 0.1 * width,
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
