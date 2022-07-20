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
  const [oldStatus, setOldStatus] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [closed, setClosed] = useState(false);
  const [readyForCollection, setReadyForCollection] = useState(false);
  const [readyForCollectionOld, setReadyForCollectionOld] = useState(false);
  const [joiners, setJoiners] = useState([]);

  const statuses = [
    "Accepting Orders - Target not reached",
    "Accepting Orders - Target reached",
    "Stopped Accepting Orders",
    "Orders Placed",
    "Orders out for Delivery",
    "Ready for Collection",
    "Group buy completed!",
    "Group buy cancelled",
  ];

  const handleConfirmUpdate = () =>
    Alert.alert("Confirm Update Status?", "This action is irreversible", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Confirm", onPress: handleUpdateStatus },
    ]);

  const handleUpdateStatus = () => {
    if (newStatus == oldStatus || newStatus == "") {
      Alert.alert("No change has been made", "Please select a new status", [
        {
          text: "Ok",
          style: "cancel",
        },
      ]);
    } else {
      db.collection("listing")
        .doc(listingId)
        .update({
          status: newStatus,
          acceptingOrders: acceptingOrders,
          readyForCollection: readyForCollection,
          closed: closed,
        })
        .then(() =>
          Alert.alert("Status Updated!", "", [
            {
              text: "Ok",
              style: "cancel",
            },
          ])
        );
    }
  };

  useEffect(() => {
    const subscriberListing = db
      .collection("listing")
      .doc(listingId)
      .onSnapshot((documentSnapshot) => {
        const listingData = documentSnapshot.data();
        setListingName(listingData.listingName);
        setOldStatus(listingData.status);
        setReadyForCollectionOld(listingData.readyForCollection);
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
  });

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
            <Text style={styles.header}>
              <Text style={{ color: "#696969" }}>Track: </Text> {listingName}
            </Text>
          </View>
        </View>
        <View style={styles.updateStatusContainer}>
          <View style={styles.statusIconsContainer}>
            <View style={styles.eachStatus}>
              <IconButton
                icon="text-box-plus-outline"
                color={
                  oldStatus == "Accepting Orders - Target not reached" ||
                  oldStatus == "Accepting Orders - Target reached"
                    ? "#9EACE0"
                    : statuses.indexOf(oldStatus) > 1
                    ? "#bababa"
                    : "black"
                }
                size={0.09 * width}
                onPress={() => {}}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      oldStatus == "Accepting Orders - Target not reached" ||
                      oldStatus == "Accepting Orders - Target reached"
                        ? "#9EACE0"
                        : statuses.indexOf(oldStatus) > 1
                        ? "#bababa"
                        : "black",
                  },
                ]}
              >
                Accepting Orders
              </Text>
            </View>
            <View style={styles.eachStatus}>
              <IconButton
                icon="text-box-remove-outline"
                color={
                  oldStatus == "Stopped Accepting Orders"
                    ? "#9EACE0"
                    : statuses.indexOf(oldStatus) > 2
                    ? "#bababa"
                    : newStatus == "Stopped Accepting Orders"
                    ? "#f8a2ac"
                    : "black"
                }
                size={0.09 * width}
                onPress={() => {
                  if (statuses.indexOf(oldStatus) > 2) {
                  } else {
                    setNewStatus("Stopped Accepting Orders");
                    setAcceptingOrders(false);
                    setClosed(false);
                    setReadyForCollection(false);
                  }
                }}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      oldStatus == "Stopped Accepting Orders"
                        ? "#9EACE0"
                        : statuses.indexOf(oldStatus) > 2
                        ? "#bababa"
                        : newStatus == "Stopped Accepting Orders"
                        ? "#f8a2ac"
                        : "black",
                  },
                ]}
              >
                No Longer Accepting Orders
              </Text>
            </View>
            <View style={styles.eachStatus}>
              <IconButton
                icon="cart"
                color={
                  oldStatus == "Orders Placed"
                    ? "#7B86AE"
                    : statuses.indexOf(oldStatus) > 3
                    ? "#bababa"
                    : newStatus == "Orders Placed"
                    ? "#f8a2ac"
                    : "black"
                }
                size={0.09 * width}
                onPress={() => {
                  if (statuses.indexOf(oldStatus) > 3) {
                  } else {
                    setNewStatus("Orders Placed");
                    setAcceptingOrders(false);
                    setClosed(false);
                    setReadyForCollection(false);
                  }
                }}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      oldStatus == "Orders Placed"
                        ? "#9EACE0"
                        : statuses.indexOf(oldStatus) > 3
                        ? "#bababa"
                        : newStatus == "Orders Placed"
                        ? "#f8a2ac"
                        : "black",
                  },
                ]}
              >
                Orders Placed
              </Text>
            </View>
            <View style={styles.eachStatus}>
              <IconButton
                icon="airplane"
                color={
                  oldStatus == "Orders out for Delivery"
                    ? "#9EACE0"
                    : statuses.indexOf(oldStatus) > 4
                    ? "#bababa"
                    : newStatus == "Orders out for Delivery"
                    ? "#f8a2ac"
                    : "black"
                }
                size={0.09 * width}
                onPress={() => {
                  if (statuses.indexOf(oldStatus) > 4) {
                  } else {
                    setNewStatus("Orders out for Delivery");
                    setAcceptingOrders(false);
                    setClosed(false);
                    setReadyForCollection(false);
                  }
                }}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      oldStatus == "Orders out for Delivery"
                        ? "#9EACE0"
                        : statuses.indexOf(oldStatus) > 4
                        ? "#bababa"
                        : newStatus == "Orders out for Delivery"
                        ? "#f8a2ac"
                        : "black",
                  },
                ]}
              >
                Orders out for Delivery
              </Text>
            </View>
            <View style={styles.eachStatus}>
              <IconButton
                icon="shopping"
                color={
                  oldStatus == "Ready for Collection"
                    ? "#9EACE0"
                    : statuses.indexOf(oldStatus) > 5
                    ? "#bababa"
                    : newStatus == "Ready for Collection"
                    ? "#f8a2ac"
                    : "black"
                }
                size={0.09 * width}
                onPress={() => {
                  if (statuses.indexOf(oldStatus) > 5) {
                  } else {
                    setNewStatus("Ready for Collection");
                    setAcceptingOrders(false);
                    setReadyForCollection(true);
                    setClosed(false);
                  }
                }}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      oldStatus == "Ready for Collection"
                        ? "#9EACE0"
                        : statuses.indexOf(oldStatus) > 5
                        ? "#bababa"
                        : newStatus == "Ready for Collection"
                        ? "#f8a2ac"
                        : "black",
                  },
                ]}
              >
                Ready for Collection
              </Text>
            </View>
            <View style={styles.eachStatus}>
              <IconButton
                icon="check-circle-outline"
                color={
                  oldStatus == "Group buy completed!"
                    ? "#9EACE0"
                    : statuses.indexOf(oldStatus) > 6
                    ? "#bababa"
                    : newStatus == "Group buy completed!"
                    ? "#f8a2ac"
                    : "black"
                }
                size={0.09 * width}
                onPress={() => {
                  if (statuses.indexOf(oldStatus) > 6) {
                  } else {
                    setNewStatus("Group buy completed!");
                    setAcceptingOrders(false);
                    setReadyForCollection(true);
                    setClosed(true);
                  }
                }}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      oldStatus == "Group buy completed!"
                        ? "#9EACE0"
                        : statuses.indexOf(oldStatus) > 6
                        ? "#bababa"
                        : newStatus == "Group buy completed!"
                        ? "#f8a2ac"
                        : "black",
                  },
                ]}
              >
                Group buy completed!
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleConfirmUpdate}
            style={styles.updateButton}
          >
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <View style={styles.buttonBottom}></View>
        </View>
        <ScrollView style={styles.listingContainer}>
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
                    <Text style={styles.listingCreator}>
                      Joined by {joiner.username}
                    </Text>
                    {joiner.itemDescription.length <= 50 && (
                      <Text style={styles.listingText}>
                        {joiner.itemDescription}
                      </Text>
                    )}
                    {joiner.itemDescription.length > 50 && (
                      <Text style={styles.listingText}>
                        {joiner.itemDescription.slice(0, 50)}...
                      </Text>
                    )}

                    <View style={styles.statusContainer}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {joiner.approved && (
                          <IconButton
                            icon="checkbox-outline"
                            size={0.035 * width}
                          />
                        )}
                        {!joiner.approved && (
                          <IconButton
                            icon="checkbox-blank-outline"
                            size={0.035 * width}
                          />
                        )}

                        <Text style={styles.listingText}>Approved</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {joiner.paid && (
                          <IconButton
                            icon="checkbox-outline"
                            size={0.035 * width}
                          />
                        )}
                        {!joiner.paid && (
                          <IconButton
                            icon="checkbox-blank-outline"
                            size={0.035 * width}
                          />
                        )}
                        <Text style={styles.listingText}>Paid</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {joiner.collected && (
                          <IconButton
                            icon="checkbox-outline"
                            size={0.035 * width}
                          />
                        )}
                        {!joiner.collected && (
                          <IconButton
                            icon="checkbox-blank-outline"
                            size={0.035 * width}
                          />
                        )}
                        <Text style={styles.listingText}>Collected</Text>
                      </View>
                    </View>
                    {!joiner.approved && (
                      <Text style={styles.actionText}>
                        Action Required: Approve Joiner Now
                      </Text>
                    )}
                    {!joiner.paid && joiner.paymentProof != "" && (
                      <Text style={styles.actionText}>
                        Action Required: Joiner has made payment. Verify payment
                        now.
                      </Text>
                    )}
                    {readyForCollectionOld &&
                      joiner.deliveryProof == "" &&
                      !joiner.collected && (
                        <Text style={styles.actionText}>
                          Action Required: Provide collection/mailing proof
                        </Text>
                      )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View>
              <Text style={styles.infoHeader}>No joiners yet.</Text>
              <Text style={styles.info}>
                Details of those who joined your listing will be displayed here.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
};

export default TrackScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f9fafe",
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
  name: {
    fontFamily: "raleway-bold",
    fontSize: (60 * width) / height,
  },
  updateStatusContainer: {
    height: height * 0.21,
    backgroundColor: "#f9fafe",
    alignItems: "center",
  },
  statusIconsContainer: {
    width: width,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  eachStatus: {
    flexDirection: "column",
    alignItems: "center",
    width: width * 0.13,
  },
  listingContainer: {
    flex: 1,
    backgroundColor: "#f9fafe",
  },
  info: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    marginLeft: width * 0.05,
  },
  infoHeader: {
    fontFamily: "raleway-bold",
    fontSize: 26,
    marginLeft: width * 0.05,
  },
  statusText: {
    fontFamily: "raleway-regular",
    marginTop: height * -0.02,
    fontSize: 9,
    textAlign: "center",
  },
  inputHeader: {
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
    marginTop: 10,
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
  listing: {
    backgroundColor: "#f9fafe",

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
  actionText: {
    fontFamily: "raleway-regular",
    color: "#F88379",
    fontSize: (25 * width) / height,
  },
  listingCreator: {
    fontFamily: "raleway-bold",
    color: "#B0C0F9",
    fontSize: (30 * width) / height,
  },
  horizontalContainer: {
    flexDirection: "row",
    width: width * 0.9,
    justifyContent: "space-between",
  },
  statusContainer: {
    flexDirection: "row",
    width: width * 0.9,
    justifyContent: "space-around",
  },
});
