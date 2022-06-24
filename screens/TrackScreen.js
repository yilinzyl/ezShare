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

const TrackScreen = ({ route, navigation }) => {
  const { listingId } = route.params;
  const user = auth.currentUser;

  const [loadingListingInfo, setLoadingListingInfo] = useState(true);
  const [loadingJoinerInfo, setLoadingJoinerInfo] = useState(true);
  const [listingName, setListingName] = useState("");
  const [acceptingOrders, setAcceptingOrders] = useState("");
  const [status, setStatus] = useState("");
  const [readyForCollection, setReadyForCollection] = useState(false);
  const [joiners, setJoiners] = useState([]);

  const handleStopAcceptingOrders = () =>
    Alert.alert("Confirm?", "Action cannot be reversed", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          db.collection("listing")
            .doc(listingId)
            .update({
              acceptingOrders: false,
            })
            .then(() => {
              console.log("Stopped Accepting Orders");
            });
        },
      },
    ]);

  const handleReadyToCollect = () =>
    Alert.alert("Confirm?", "Action cannot be reversed", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: () => {
          console.log("Updated Ready To Collect");
          db.collection("listing")
            .doc(listingId)
            .update({
              readyForCollection: true,
            })
            .then(() => {
              console.log("Updated Ready To Collect");
            });
        },
      },
    ]);

  const handleUpdateStatus = () => {
    db.collection("listing")
      .doc(listingId)
      .update({
        status: status,
      })
      .then(() => {
        console.log("Status updated!");
      });
  };

  useEffect(() => {
    const subscriberListing = db
      .collection("listing")
      .doc(listingId)
      .onSnapshot((documentSnapshot) => {
        const listingData = documentSnapshot.data();
        setListingName(listingData.listingName);
        setAcceptingOrders(listingData.acceptingOrders);
        setStatus(listingData.status);
        setReadyForCollection(listingData.readyForCollection);
        setLoadingListingInfo(false);
      });
    const getJoinersFromFirebase = [];
    const subscriberJoiner = db
      .collection("joined")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().listingID == listingId) {
            getJoinersFromFirebase.push({
              ...doc.data(),
              key: doc.id,
            });
          }
        });
        setJoiners(getJoinersFromFirebase);
        setLoadingJoinerInfo(false);
      });
    return () => {
      subscriberListing();
      subscriberJoiner();
    };
  }, ["listingId"]);

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
          {acceptingOrders && (
            <TouchableOpacity
              onPress={handleStopAcceptingOrders}
              style={styles.updateButton}
            >
              <Text style={styles.buttonText}>Stop Accepting Orders</Text>
            </TouchableOpacity>
          )}
          {!readyForCollection && (
            <TouchableOpacity
              onPress={handleReadyToCollect}
              style={styles.updateButton}
            >
              <Text style={styles.buttonText}>Ready to Collect</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.inputHeader}>Update Status</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter New Status"
              value={status}
              onChangeText={(text) => setStatus(text)}
              style={styles.input}
            />
          </View>
          <TouchableOpacity
            onPress={handleUpdateStatus}
            style={styles.updateButton}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          {joiners.length > 0 ? (
            joiners.map((joiner) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Joiner Details", {
                    listingId: listingId,
                    joinedId: joiner.key,
                  })
                }
              >
                <View key={joiner.key} style={styles.listing}>
                  <View style={styles.listingTextContainer}>
                    <Text style={styles.listingTitle}>{joiner.itemName}</Text>
                    <Text style={styles.listingText}>
                      {joiner.itemDescription}
                    </Text>
                    <View style={styles.joinerStatusContainer}>
                      {joiner.approved && (
                        <Text style={styles.listingText}>approved</Text>
                      )}
                      {joiner.paid && (
                        <Text style={styles.listingText}>paid</Text>
                      )}
                      {joiner.collected && (
                        <Text style={styles.listingText}>collected</Text>
                      )}
                    </View>
                    <Text style={styles.listingCreator}>
                      Joined by {joiner.username}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ marginLeft: width * 0.05 }}>no joiners yet</Text>
          )}
        </ScrollView>
      </View>
    );
  }
};

export default TrackScreen;

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
  listing: {
    backgroundColor: "#f9fafe",
    height: height * 0.15,
    display: "flex",
    flexDirection: "row",
    borderColor: "#eeedff",
    borderTopWidth: 2,
    alignItems: "center",
  },
  listingTextContainer: {
    marginLeft: 0.05 * width,
    width: 0.6 * width,
    justifyContent: "flex-end",
  },
  joinerStatusContainer: {
    marginRight: 0.05 * width,
    width: 0.5 * width,
    alignItems: "flex-end",
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
});
