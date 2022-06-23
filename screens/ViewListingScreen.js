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
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IconButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
  const [collectionPoint, setCollectionPoint] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [acceptingOrders, setAcceptingOrders] = useState(false);
  const [status, setStatus] = useState("");
  const [listingOwner, setListingOwner] = useState("");
  const [listingOwnerName, setListingOwnerName] = useState("");

  useEffect(() => {
    const subscriber = db
      .collection("listing")
      .doc(listingId)
      .onSnapshot((documentSnapshot) => {
        const listingData = documentSnapshot.data();
        setCategory(listingData.category);
        setListingName(listingData.listingName);
        setDescription(listingData.listingDescription);
        setCutOffDate(listingData.cutOffDate);
        setTargetAmount(listingData.targetAmount);
        setOtherCosts(listingData.otherCosts);
        setCollectionPoint(listingData.collectionPoint);
        setDeliveryFee(listingData.deliveryFee);
        setCurrentAmount(listingData.currentAmount);
        setAcceptingOrders(listingData.acceptingOrders);
        setStatus(listingData.status);
        setListingOwner(listingData.user);
        setListingOwnerName(listingData.username);
        setLoading(false);
      });
    return () => subscriber();
  }, ["listingId"]);

  if (loading) {
    return (
      <View>
        <Text style={styles.header}>"Loading..."</Text>
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
            onPress={() => navigation.goBack()}
          />
          <View>
            <Text style={styles.header}>{listingName}</Text>
          </View>
        </View>
        <ScrollView style={styles.listingContainer}>
          <Text style={styles.infoHeader}>Category</Text>
          <Text style={styles.info}>{category}</Text>
          <Text style={styles.infoHeader}>Creator</Text>
          <Text style={styles.info}>{listingOwnerName}</Text>
          <Text style={styles.infoHeader}>Status</Text>
          <Text style={styles.info}>{status}</Text>
          <Text style={styles.infoHeader}>Description</Text>
          <Text style={styles.info}>{description}</Text>
          <Text style={styles.infoHeader}>Cut-off Date</Text>
          <Text style={styles.info}>{cutOffDate.toString()}</Text>
          <Text style={styles.infoHeader}>Target Amount</Text>
          <Text style={styles.info}>{targetAmount}</Text>
          <Text style={styles.infoHeader}>Current Amount</Text>
          <Text style={styles.info}>{currentAmount}</Text>
          <Text style={styles.infoHeader}>Delivery Fee</Text>
          <Text style={styles.info}>{deliveryFee}</Text>
          <Text style={styles.infoHeader}>Commission Fee</Text>
          <Text style={styles.info}>{otherCosts}</Text>
          <Text style={styles.infoHeader}>Collection Point</Text>
          <Text style={styles.info}>{collectionPoint}</Text>
          {acceptingOrders && user.uid != listingOwner && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Join Listing", { listingId: listingId })
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
    fontSize: (60 * width) / height,
  },
  name: {
    fontFamily: "raleway-bold",
    fontSize: (60 * width) / height,
  },
  listingContainer: {
    height: height * 0.87,
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
});
