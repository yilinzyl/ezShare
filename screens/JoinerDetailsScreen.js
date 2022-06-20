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

const JoinerDetails = ({ route, navigation }) => {
  const { listingId, joinedId } = route.params;
  const user = auth.currentUser;

  const [loadingListingInfo, setLoadingListingInfo] = useState(true);
  const [loadingJoinerInfo, setLoadingJoinerInfo] = useState(true);
  const [listingName, setListingName] = useState("");
  const [listingUserId, setListingUserId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemLink, setItemLink] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [otherRequests, setItemRequests] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [joinerName, setJoinerName] = useState("");
  const [paid, setPaid] = useState(false);
  const [approved, setApproved] = useState(false);
  const [collected, setCollected] = useState(false);

  const handleApproveButton = () => {
    db.collection("joined")
      .doc(joinedId)
      .update({
        approved: true,
      })
      .then(() => {
        console.log("Joiner approved!");
      });
  };

  const handleCollectedButton = () => {
    db.collection("joined")
      .doc(joinedId)
      .update({
        collected: true,
      })
      .then(() => {
        console.log("Joiner collected!");
      });
  };

  const handlePaidButton = () => {
    db.collection("joined")
      .doc(joinedId)
      .update({
        paid: true,
      })
      .then(() => {
        console.log("Joiner paid!");
      });
  };

  useEffect(() => {
    const subscriberJoiner = db
      .collection("joined")
      .doc(joinedId)
      .onSnapshot((documentSnapshot) => {
        const joinerData = documentSnapshot.data();
        setItemName(joinerData.itemName);
        setItemLink(joinerData.itemLink);
        setItemDescription(joinerData.itemDescription);
        setItemRequests(joinerData.otherRequests);
        setJoinerName(joinerData.username);
        setCollected(joinerData.collected);
        setApproved(joinerData.approved);
        setPaid(joinerData.paid);
        setLoadingJoinerInfo(false);
      });
    const subscriberListing = db
      .collection("listing")
      .doc(listingId)
      .onSnapshot((documentSnapshot) => {
        const listingData = documentSnapshot.data();
        setListingName(listingData.listingName);
        setListingUserId(listingData.user);
        setLoadingListingInfo(false);
      });
    return () => {
      subscriberJoiner();
      subscriberListing();
    };
  }, ["joinedId"]);

  if (loadingJoinerInfo || loadingListingInfo) {
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
            <Text style={styles.header}>Track {listingName}</Text>
          </View>
        </View>
        <ScrollView style={styles.listingContainer}>
          <Text style={styles.infoHeader}>Item Name</Text>
          <Text style={styles.info}>{itemName}</Text>
          <Text style={styles.infoHeader}>Joiner Name</Text>
          <Text style={styles.info}>{joinerName}</Text>
          <Text style={styles.infoHeader}>Item Link</Text>
          <Text style={styles.info}>{itemLink}</Text>
          <Text style={styles.infoHeader}>Item Description</Text>
          <Text style={styles.info}>{itemDescription}</Text>
          <Text style={styles.infoHeader}>Item Cost</Text>
          <Text style={styles.info}>{itemCost}</Text>
          <Text style={styles.infoHeader}>Other Requests</Text>
          <Text style={styles.info}>{otherRequests}</Text>
          {approved && <Text style={styles.info}>approved</Text>}
          {paid && <Text style={styles.info}>paid</Text>}
          {collected && <Text style={styles.info}>collected</Text>}
          {user.uid == listingUserId && (
            <TouchableOpacity
              onPress={handleApproveButton}
              style={styles.updateButton}
            >
              <Text style={styles.buttonText}>Approve Order</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handlePaidButton}
            style={styles.updateButton}
          >
            <Text style={styles.buttonText}>Mark as Paid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCollectedButton}
            style={styles.updateButton}
          >
            <Text style={styles.buttonText}>Mark as Collected</Text>
          </TouchableOpacity>
          <View style={styles.buttonBottom}></View>
        </ScrollView>
      </View>
    );
  }
};

export default JoinerDetails;

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
  updateButton: {
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
    height: 0.05 * height,
  },
});
