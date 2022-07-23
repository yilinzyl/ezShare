import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { firestore } from "firebase/firestore";
import { auth, db, cloudStorage } from "../firebase";
import { IconButton } from "react-native-paper";
import Loader from "react-native-modal-loader";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const CreateReviewScreen = ({ route, navigation }) => {
  const user = auth.currentUser;
  //const navigation = useNavigation();

  const { listingId, joinerId, joinerName } = route.params;

  const [loading, setLoading] = useState(true);
  const [listingName, setListingName] = useState("");
  const [listingOwner, setListingOwner] = useState("");
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const [posting, setPosting] = useState(false);

  const exitCreatePopup = () =>
    Alert.alert("Confirm Exit?", "Changes you make will not be saved", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Exit", onPress: () => navigation.goBack() },
    ]);

  const handleCreateReview = () => {
    setPosting(true);
    db.collection("reviews")
      .doc(listingId + "-" + user.uid)
      .set({
        listingName: listingName,
        listingId: listingId,
        to: user.uid == listingOwner ? joinerId : listingOwner,
        from: user.uid,
        fromName: user.displayName,
        review: review,
        rating: rating,
        fromRole: user.uid == listingOwner ? "creator" : "joiner",
      })
      .then((docRef) => {
        setPosting(false);
        navigation.goBack();
      });
  };
  useEffect(() => {
    const subscriber = db
      .collection("listing")
      .doc(listingId)
      .onSnapshot((documentSnapshot) => {
        const listingData = documentSnapshot.data();
        setListingName(listingData.listingName);
        setListingOwner(listingData.user);
        setLoading(false);
      });

    return subscriber;
  }, ["listingId"]);

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
  } else {
    return (
      <View style={styles.background}>
        <Loader loading={posting} color="#ff66be" />
        <View style={styles.headerContainer}>
          <IconButton
            icon="arrow-left"
            color="#B0C0F9"
            size={0.08 * width}
            style={{ marginLeft: width * -0.02 }}
            onPress={exitCreatePopup}
          />
          <View>
            <Text style={styles.header}>
              <Text style={{ color: "#696969" }}>Review: </Text>
              {listingName}
            </Text>
          </View>
        </View>
        <View style={styles.starsContainer}>
          {rating < 1 && (
            <IconButton
              icon="star-outline"
              color="#B0C0F9"
              size={0.1 * width}
              style={{ marginLeft: width * -0.02 }}
              onPress={() => setRating(1)}
            />
          )}
          {rating >= 1 && (
            <IconButton
              icon="star"
              color="#B0C0F9"
              size={0.1 * width}
              style={{ marginLeft: width * -0.02 }}
              onPress={() => setRating(1)}
            />
          )}
          {rating < 2 && (
            <IconButton
              icon="star-outline"
              color="#B0C0F9"
              size={0.1 * width}
              style={{ marginLeft: width * -0.02 }}
              onPress={() => setRating(2)}
            />
          )}
          {rating >= 2 && (
            <IconButton
              icon="star"
              color="#B0C0F9"
              size={0.1 * width}
              style={{ marginLeft: width * -0.02 }}
              onPress={() => setRating(2)}
            />
          )}
          {rating < 3 && (
            <IconButton
              icon="star-outline"
              color="#B0C0F9"
              size={0.1 * width}
              style={{ marginLeft: width * -0.02 }}
              onPress={() => setRating(3)}
            />
          )}
          {rating >= 3 && (
            <IconButton
              icon="star"
              color="#B0C0F9"
              size={0.1 * width}
              style={{ marginLeft: width * -0.02 }}
              onPress={() => setRating(3)}
            />
          )}
          {rating < 4 && (
            <IconButton
              icon="star-outline"
              color="#B0C0F9"
              size={0.1 * width}
              style={{ marginLeft: width * -0.02 }}
              onPress={() => setRating(4)}
            />
          )}
          {rating >= 4 && (
            <IconButton
              icon="star"
              color="#B0C0F9"
              size={0.1 * width}
              style={{ marginLeft: width * -0.02 }}
              onPress={() => setRating(4)}
            />
          )}
          {rating < 5 && (
            <IconButton
              icon="star-outline"
              color="#B0C0F9"
              size={0.1 * width}
              style={{ marginLeft: width * -0.02 }}
              onPress={() => setRating(5)}
            />
          )}
          {rating >= 5 && (
            <IconButton
              icon="star"
              color="#B0C0F9"
              size={0.1 * width}
              style={{ marginLeft: width * -0.02 }}
              onPress={() => setRating(5)}
            />
          )}
        </View>
        <View style={styles.inputBox}>
          <TextInput
            multiline
            placeholder="Enter review"
            value={review}
            onChangeText={(text) => {
              setReview(text);
            }}
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          onPress={handleCreateReview}
          style={styles.createButton}
        >
          <Text style={styles.buttonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

export default CreateReviewScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    flex: 1,
  },
  headerContainer: {
    flexWrap: "wrap",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: height * 0.05,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    marginBottom: height * 0.02,
  },
  header: {
    fontFamily: "raleway-bold",
    fontSize: (60 * width) / height,
  },
  inputBox: {
    borderColor: "#B0C0F9",
    borderWidth: 2,
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.4,
    marginBottom: 13,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  input: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 6,
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
  starsContainer: {
    flexDirection: "row",
    width: 0.9 * width,
    alignSelf: "center",
    alignContent: "space-between",
  },
});
