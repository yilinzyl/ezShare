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
} from "react-native";
import React, { useEffect, useState } from "react";
import { firestore } from "firebase/firestore";
import { auth, db, cloudStorage } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IconButton } from "react-native-paper";
import logo from "../assets/default-listing-icon.png";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const ViewListingScreen = ({ route, navigation }) => {
  const user = auth.currentUser;
  //const navigation = useNavigation();

  const { listingId } = route.params;

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [listingName, setListingName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [cutOffDate, setCutOffDate] = useState(0);
  const [targetAmount, setTargetAmount] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);
  const [mailingMethod, setMailingMethod] = useState("");
  const [collectionPoint, setCollectionPoint] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [acceptingOrders, setAcceptingOrders] = useState(false);
  const [status, setStatus] = useState("");
  const [listingOwner, setListingOwner] = useState("");
  const [listingOwnerName, setListingOwnerName] = useState("");
  const [image, setImage] = useState(logo);
  const [imagePresent, setImagePresent] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [approved, setApproved] = useState(false);
  const [joinedId, setJoinedId] = useState("");
  const [contact, setContact] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const getImage = (listingId) => {
    cloudStorage
      .ref("listingImages/" + listingId + ".jpg")
      .getDownloadURL()
      .then((url) => {
        setImage(url);
        setImageLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getImage(listingId);
    const subscriber1 = db
      .collection("listing")
      .doc(listingId)
      .onSnapshot((documentSnapshot) => {
        const listingData = documentSnapshot.data();
        setCategory(listingData.category);
        setListingName(listingData.listingName);
        setDescription(listingData.listingDescription);
        setCutOffDate(
          new Date(
            listingData.cutOffDate.seconds * 1000 +
              listingData.cutOffDate.nanoseconds / 1000000
          )
        );
        setTargetAmount(listingData.targetAmount);
        setOtherCosts(listingData.otherCosts);
        setMailingMethod(listingData.mailingMethod);
        setCollectionPoint(listingData.collectionPoint);
        setDeliveryFee(listingData.deliveryFee);
        setCurrentAmount(listingData.currentAmount);
        setAcceptingOrders(listingData.acceptingOrders);
        setStatus(listingData.status);
        setListingOwner(listingData.user);
        setListingOwnerName(listingData.username);
        setImagePresent(listingData.imagePresent);
        setPaymentMethod(
          listingData.paymentMethod == "banking"
            ? "Paylah/Paynow"
            : "Cash on Collect"
        );
        setPaymentDetails(listingData.paymentDetails);
        setContact(listingData.contact);
        setConfirmed(listingData.confirmed);
        setCancelled(listingData.cancelled);
        setLoading(false);
      });

    const subscriber2 = db
      .collection("joined")
      .doc(listingId + "-" + user.uid)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setJoinedId(listingId + "-" + user.uid);
          setApproved(documentSnapshot.data().approved);
        } else {
        }
      });

    if (user.uid == listingOwner) {
      setApproved(true);
    }

    return () => {
      subscriber1();
      subscriber2();
    };
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
        <View style={styles.headerContainer}>
          <IconButton
            icon="arrow-left"
            color="#B0C0F9"
            size={0.08 * width}
            style={{ marginLeft: width * -0.02 }}
            onPress={() => navigation.popToTop()}
          />
          <View>
            <Text style={styles.header}>{listingName}</Text>
            <Text style={styles.createdBy}>Created by {listingOwnerName}</Text>
          </View>
        </View>
        <ScrollView style={styles.listingContainer}>
          <View style={styles.imageContainer}>
            {imageLoading && (
              <Image style={{ width: 250, height: 250 }} source={logo} />
            )}
            {!imageLoading && (
              <Image
                style={{ width: 250, height: 250 }}
                source={{
                  uri: image,
                }}
              />
            )}
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            {confirmed && (
              <IconButton
                icon="checkbox-outline"
                size={0.05 * width}
                style={{ marginLeft: width * 0.05, marginRight: width * -0.05 }}
              />
            )}
            {!confirmed && !cancelled && (
              <IconButton
                icon="checkbox-blank-outline"
                size={0.05 * width}
                style={{ marginLeft: width * 0.05, marginRight: width * -0.05 }}
              />
            )}
            {!cancelled && <Text style={styles.info}>Confirmed</Text>}
          </View>
          {cancelled && (
            <Text style={styles.cancelledText}>
              This group buy has been cancelled.
            </Text>
          )}
          <Text style={styles.infoHeader}>Category</Text>
          <Text style={styles.info}>{category}</Text>
          <Text style={styles.infoHeader}>Status</Text>
          <Text style={styles.info}>{status}</Text>
          <Text style={styles.infoHeader}>Description</Text>
          <Text style={styles.info}>{description}</Text>
          <Text style={styles.infoHeader}>Cut-off Date</Text>
          <Text style={styles.info}>{cutOffDate.toString()}</Text>
          <Text style={styles.infoHeader}>Current / Target Amount</Text>
          <Text style={styles.info}>
            {currentAmount} / {targetAmount} S$
          </Text>
          <Text style={styles.infoHeader}>Delivery Fee</Text>
          <Text style={styles.info}>S$ {deliveryFee}</Text>
          <Text style={styles.infoHeader}>Commission Fee</Text>
          <Text style={styles.info}>S$ {otherCosts}</Text>
          <Text style={styles.infoHeader}>Collection Method</Text>
          {mailingMethod != "" && (
            <View
              style={{
                flexDirection: "row",
                marginLeft: width * 0.05,
                alignItems: "flex-end",
              }}
            >
              <IconButton
                icon="truck"
                size={width * 0.08}
                color="black"
                style={{
                  marginLeft: width * -0.02,
                  marginRight: width * -0.02,
                }}
              />
              <Text style={styles.collectionInfo}>Mailing</Text>
            </View>
          )}
          {collectionPoint != "" && (
            <View
              style={{
                flexDirection: "row",
                marginLeft: width * 0.05,
                alignItems: "flex-end",
              }}
            >
              <IconButton
                icon="map-marker"
                size={width * 0.08}
                color="black"
                style={{
                  marginLeft: width * -0.02,
                  marginRight: width * -0.02,
                }}
              />
              <Text style={styles.collectionInfo}>
                Meet-up at: {collectionPoint}
              </Text>
            </View>
          )}
          <Text style={styles.infoHeader}>Payment Method</Text>
          <Text style={styles.info}>{paymentMethod}</Text>
          {approved && paymentMethod != "Cash on Collect" && (
            <View>
              <Text style={styles.infoHeader}>Payment Details</Text>
              <Text style={styles.info}>{paymentDetails}</Text>
            </View>
          )}
          {approved && (
            <View>
              <Text style={styles.infoHeader}>Contact Details</Text>
              <Text style={styles.info}>{contact}</Text>
            </View>
          )}
          {acceptingOrders && user.uid != listingOwner && joinedId == "" && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Join Listing", {
                  listingId: listingId,
                })
              }
              style={styles.joinButton}
            >
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
          )}
          {user.uid == listingOwner && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Track", { listingId: listingId })
              }
              style={styles.joinButton}
            >
              <Text style={styles.buttonText}>Track</Text>
            </TouchableOpacity>
          )}
          {user.uid != listingOwner && joinedId != "" && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Joiner Details", {
                  listingId: listingId,
                  joinedId: joinedId,
                })
              }
              style={styles.joinButton}
            >
              <Text style={styles.buttonText}>View Order</Text>
            </TouchableOpacity>
          )}
          <View style={styles.buttonBottom}></View>
        </ScrollView>
      </View>
    );
  }
};

export default ViewListingScreen;

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
  createdBy: {
    color: "#B0C0F9",
    textAlign: "right",
    fontFamily: "raleway-bold",
    fontSize: (30 * width) / height,
  },
  name: {
    fontFamily: "raleway-bold",
    fontSize: (60 * width) / height,
  },
  listingContainer: { flex: 1 },
  info: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    marginLeft: width * 0.05,
    marginBottom: 15,
    marginRight: width * 0.05,
  },
  collectionInfo: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    marginLeft: width * 0.05,
    marginBottom: 15,
    marginRight: width * 0.15,
  },
  infoHeader: {
    fontFamily: "raleway-bold",
    fontSize: 18,
    color: "#404040",
    margin: 6,
    marginLeft: width * 0.05,
  },
  joinButton: {
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
  buttonBottom: {
    height: 0.05 * height,
  },
  imageContainer: {
    alignItems: "center",
    textAlign: "center",
  },
  cancelledText: {
    fontFamily: "raleway-bold",
    color: "red",
    marginLeft: width * 0.05,
    fontSize: 16,
  },
});
