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

const JoinListingScreen = ({ route, navigation }) => {
  const { listingId } = route.params;
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [listingName, setListingName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemLink, setItemLink] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [otherRequests, setItemRequests] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [otherCosts, setOtherCosts] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [targetAmount, setTargetAmount] = useState(0);
  const [status, setStatus] = useState("");

  const addToJoinedDatabase = () => {
    db.collection("joined")
      .add({
        listingID: listingId,
        userID: user.uid,
        username: user.displayName,
        joinDate: new Date(),
        itemName: itemName,
        itemLink: itemLink,
        itemDescription: itemDescription,
        itemCost: itemCost,
        otherRequests: otherRequests,
        collected: false,
        paid: false,
        approved: false,
      })
      .then(() => {
        console.log("Joined Data Added!");
      });
  };

  const updateListingDatabase = () => {
    db.collection("listing")
      .doc(listingId)
      .update({
        currentAmount: currentAmount + itemCost,
        status: status,
      })
      .then(() => {
        console.log("Listing updated!");
      });
  };

  const exitCreatePopup = () =>
    Alert.alert("Confirm Exit?", "Changes you make will not be saved", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Exit", onPress: () => navigation.navigate("Home") },
    ]);

  useEffect(() => {
    const subscriber = db
      .collection("listing")
      .doc(listingId)
      .onSnapshot((documentSnapshot) => {
        const listingData = documentSnapshot.data();
        setListingName(listingData.listingName);
        setTargetAmount(listingData.targetAmount);
        setOtherCosts(listingData.otherCosts);
        setDeliveryFee(listingData.deliveryFee);
        setCurrentAmount(listingData.currentAmount);
        setStatus(listingData.status);
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
            onPress={exitCreatePopup}
          />
          <View>
            <Text style={styles.header}>Join {listingName}</Text>
          </View>
        </View>
        <ScrollView style={styles.listingContainer}>
          <Text style={styles.inputHeader}>Item Name</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter Name"
              value={itemName}
              onChangeText={(text) => setItemName(text)}
              style={styles.input}
            />
          </View>
          <Text style={styles.inputHeader}>Add Item URL</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter Item URL"
              value={itemLink}
              onChangeText={(text) => setItemLink(text)}
              style={styles.input}
            />
          </View>
          <Text style={styles.inputHeader}>Description</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter Item Description"
              value={itemDescription}
              onChangeText={(text) => setItemDescription(text)}
              style={styles.input}
            />
          </View>
          <Text style={styles.inputHeader}>Item Cost</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter Cost"
              keyboardType="numeric"
              value={itemCost}
              onChangeText={(text) => setItemCost(text)}
              style={styles.input}
            />
          </View>
          <Text style={styles.info}>Delivery Fee: {deliveryFee}</Text>
          <Text style={styles.info}>Commission Fee: {otherCosts}</Text>
          <Text style={styles.info}>
            Total Cost: {itemCost + deliveryFee + otherCosts}
          </Text>
          <Text style={styles.inputHeader}>Other Requests</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter Other Requests"
              value={otherRequests}
              onChangeText={(text) => setItemRequests(text)}
              style={styles.input}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              if (currentAmount + itemCost >= targetAmount) {
                setStatus("Accepting Orders - Target reached");
              }
              addToJoinedDatabase();
              updateListingDatabase();
              navigation.navigate("Home");
            }}
            style={styles.createButton}
          >
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <View style={styles.buttonBottom}></View>
        </ScrollView>
      </View>
    );
  }
};

export default JoinListingScreen;

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
  inputBox: {
    borderColor: "#B0C0F9",
    borderWidth: 2,
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.06,
    marginBottom: 13,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  input: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 6,
  },
  inputHeader: {
    fontFamily: "raleway-bold",
    fontSize: 18,
    color: "#404040",
    margin: 6,
    marginLeft: width * 0.05,
  },
  info: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    marginRight: width * 0.05,
    marginBottom: 1,
    textAlign: "right",
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
    height: 0.05 * height,
  },
});
