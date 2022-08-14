import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { firestore } from "firebase/firestore";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IconButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const EditProfileScreen = () => {
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [name, setName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [posts, setPosts] = useState([]);
  const [listingIds, setlistingIds] = useState([]);
  const [reviewIds, setReviewIds] = useState([]);

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriberListings = db
      .collection("listing")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            userID: doc.data().user,
            key: doc.id,
          });
        });
        setPosts(getPostsFromFirebase);
      });
    const getListingIdsFromFirebase = [];
    const subscriberPosts = db
      .collection("joined")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getListingIdsFromFirebase.push({
            userID: doc.data().userID,
            key: doc.id,
          });
        });
        setlistingIds(getListingIdsFromFirebase);
      });
      const getReviewIdsFromFirebase = [];
      const subscriberReviews = db
        .collection("reviews")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            getReviewIdsFromFirebase.push({
              userID: doc.data().from,
              key: doc.id,
            });
          });
          setReviewIds(getReviewIdsFromFirebase);
        });
    return () => {
      subscriberListings();
      subscriberPosts();
      subscriberReviews();
    };
  }, []);

  const exitCreatePopup = () =>
    Alert.alert("Confirm Exit?", "Changes you make will not be saved", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Exit", onPress: () => navigation.navigate("Profile") },
    ]);

  const handleSave = () =>
    user
      .updateProfile({ displayName: name })
      .then(
        email !== ""
          ? user.updateEmail(email)
          : console.log("email not changed")
      )
      .then(
        db
          .collection("users")
          .doc(user.uid)
          .set({ name: name, userid: user.uid, email: user.email })
      )
      .then(
        posts
          .filter((post) => post.userID == user.uid)
          .map((post) =>
            db.collection("listing").doc(post.key).update({ username: name })
          )
      )
      .then(
        listingIds
          .filter((post) => post.userID == user.uid)
          .map((post) =>
            db.collection("joined").doc(post.key).update({ username: name })
          )
      )
      .then(
        reviewIds
          .filter((post) => post.userID == user.uid)
          .map((post) =>
            db.collection("reviews").doc(post.key).update({ fromName: name })
          )
      )
      .then(() => navigation.navigate("Profile"));
  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <IconButton
          icon="arrow-left"
          color="#B0C0F9"
          size={0.08 * width}
          style={{ marginLeft: width * -0.02 }}
          onPress={exitCreatePopup}
        />
        <View>
          <Text style={styles.header}>Edit Profile</Text>
        </View>
      </View>
      <ScrollView style={styles.listingContainer}>
        <Text style={styles.inputHeader}>Display Name</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter Name"
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.nameInput}
          />
        </View>
        <Text style={styles.inputHeader}>Change Email</Text>
        <Text style={styles.emailText}>
          Currently signed in as {user.email}{" "}
        </Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter New Email"
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          onPress={() => handleSave()}
          style={styles.createButton}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
        <View style={styles.buttonBottom}></View>
      </ScrollView>
      <View style={styles.footer}></View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: height * 0.15,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    marginBottom: height * 0.02,
  },
  header: {
    fontFamily: "raleway-bold",
    fontSize: (70 * width) / height,
  },
  emailText: {
    fontFamily: "raleway-regular",
    fontSize: (30 * width) / height,
    color: "#262626",
    marginBottom: height * 0.01,
    marginLeft: width * 0.05,
  },
  name: {
    fontFamily: "raleway-bold",
    fontSize: (60 * width) / height,
  },
  listingContainer: {
    height: height * 0.8,
  },
  inputBox: {
    borderColor: "#B0C0F9",
    borderWidth: 2,
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.05,
    marginBottom: 13,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  input: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 6,
  },
  nameInput: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 6,
    color: "#262626",
  },
  inputHeader: {
    fontFamily: "raleway-bold",
    fontSize: 18,
    color: "#404040",
    margin: 6,
    marginLeft: width * 0.05,
  },
  createButton: {
    backgroundColor: "#F898A3",
    height: 50,
    width: 217,
    borderRadius: 45,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 19,
    marginBottom: height * 0.03,
  },
  buttonText: {
    fontFamily: "raleway-bold",
    color: "#F9FAFE",
    fontSize: 20,
  },
  widgetButton: {
    color: "white",
  },
  widgetText: {
    fontFamily: "raleway-regular",
    color: "#6F8EFA",
    fontSize: 16,
    textDecorationLine: "underline",
    marginBottom: 13,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  buttonBottom: {
    height: 0.4 * height,
  },
  footer: {
    height: 0.05 * height,
  },
});
