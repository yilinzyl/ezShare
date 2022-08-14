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

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const UserReviewScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const user = auth.currentUser;
  const [userName, setUserName] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber1 = db
      .collection("users")
      .doc(userId)
      .onSnapshot((documentSnapshot) => {
        const userData = documentSnapshot.data();
        setUserName(userData.name);
        setLoading(false);
      });
    const getReviewsFromFirebase = [];
    const subscriberReviews = db
      .collection("reviews")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getReviewsFromFirebase.push({
            ...doc.data(),
            key: doc.id,
          });
        });
        setReviews(getReviewsFromFirebase);
      });
    return () => {
      subscriber1();
      subscriberReviews();
    };
  }, ["userId"]);

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
            onPress={() => console.log("settings")}
            style={styles.settingsButton}
          >
            <Text style={styles.horizontalButtonText}>Reviews</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("User Listings", { userId: userId })
            }
            style={styles.myListingsButton}
          >
            <Text style={styles.horizontalButtonText}>Listings</Text>
          </TouchableOpacity>
        </ScrollView>
        {reviews
          .filter((review) => review.to == userId)
          .map((review) => (
            <View key={review.key} style={styles.listing}>
              <View style={styles.listingTextContainer}>
                <Text style={styles.listingCreator}>
                  Review by {review.fromName} ({review.fromRole})
                </Text>
                <Text style={styles.listingTitle}>
                  For: {review.listingName}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {review.rating >= 1 && (
                    <IconButton
                      icon="star"
                      color="#F6BE00"
                      size={0.05 * width}
                      style={{
                        margin: 0,
                      }}
                    />
                  )}
                  {review.rating >= 2 && (
                    <IconButton
                      icon="star"
                      color="#F6BE00"
                      size={0.05 * width}
                      style={{
                        margin: 0,
                      }}
                    />
                  )}
                  {review.rating >= 3 && (
                    <IconButton
                      icon="star"
                      color="#F6BE00"
                      size={0.05 * width}
                      style={{
                        margin: 0,
                      }}
                    />
                  )}
                  {review.rating >= 4 && (
                    <IconButton
                      icon="star"
                      color="#F6BE00"
                      size={0.05 * width}
                      style={{
                        margin: 0,
                      }}
                    />
                  )}
                  {review.rating >= 5 && (
                    <IconButton
                      icon="star"
                      color="#F6BE00"
                      size={0.05 * width}
                      style={{
                        margin: 0,
                      }}
                    />
                  )}
                </View>
                <Text style={styles.listingText}>{review.review}</Text>
              </View>
            </View>
          ))}
      </View>
    );
};

export default UserReviewScreen;

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
    backgroundColor: "#f9fafe",
  },
  listing: {
    backgroundColor: "#f9fafe",
    padding: 0.03 * width,
    display: "flex",
    flexDirection: "row",
    borderColor: "#eeedff",
    borderTopWidth: 2,
    alignItems: "center",
  },
  listingTextContainer: {
    marginLeft: 0.05 * width,
    width: 0.9 * width,
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
