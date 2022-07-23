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
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { firestore } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IconButton } from "react-native-paper";
import Loader from "react-native-modal-loader";
import DropDownPicker from "react-native-dropdown-picker";

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
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [collectionMethods, setCollectionMethods] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collectionPoint, setCollectionPoint] = useState("");
  const [errorFields, setErrorFields] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [posting, setPosting] = useState(false);

  const [collectionOpen, setCollectionOpen] = useState(false);
  const collectionOptions = [
    { label: "Mailing", value: "Mailing" },
    { label: "Meet up", value: "MeetUp" },
  ];

  const addToJoinedDatabase = () => {
    db.collection("joined")
      .doc(listingId + "-" + user.uid)
      .set({
        listingID: listingId,
        userID: user.uid,
        username: user.displayName,
        joinDate: new Date(),
        itemName: itemName,
        itemLink: itemLink,
        itemDescription: itemDescription,
        itemCost: itemCost,
        totalCost:
          parseFloat(itemCost) +
          parseFloat(deliveryFee) +
          parseFloat(otherCosts),
        otherRequests: otherRequests,
        collected: false,
        paid: false,
        approved: false,
        paymentProof: "",
        deliveryProof: "",
        completed: false,
        declinedReason: "",
        contact: contact,
        address: address,
        collectionMethod: selectedCollection,
        hidden: false,
      })
      .then(() => {
        console.log("Joined Data Added!");
        navigation.navigate("Explore");
      });
  };

  const handleJoinButton = () => {
    const nowErrorFields = [];
    const nowErrorMessages = {};

    if (itemName == "") {
      nowErrorFields.push("itemName");
      nowErrorMessages["itemName"] = "Required Field";
    }
    if (itemDescription == "") {
      nowErrorFields.push("itemDescription");
      nowErrorMessages["itemDescription"] = "Required Field";
    }
    if (itemCost == "") {
      nowErrorFields.push("itemCost");
      nowErrorMessages["itemCost"] = "Required Field";
    }
    if (isNaN(itemCost)) {
      nowErrorFields.push("itemCost");
      nowErrorMessages["itemCost"] = "Please enter a number";
    }
    if (contact == "") {
      nowErrorFields.push("contact");
      nowErrorMessages["contact"] = "Required Field";
    }
    if (selectedCollection == "") {
      nowErrorFields.push("selectedCollection");
      nowErrorMessages["selectedCollection"] = "Required Field";
    }
    if (selectedCollection == "Mailing" && address == "") {
      nowErrorFields.push("address");
      nowErrorMessages["address"] = "Required for mailing option";
    }
    if (itemLink != "") {
      Linking.canOpenURL(itemLink).then((supported) => {
        if (supported) {
          setErrorFields(nowErrorFields);
          setErrorMessages(nowErrorMessages);
          if (nowErrorFields.length == 0) {
            setPosting(true);
            addToJoinedDatabase();
          }
        } else {
          nowErrorFields.push("itemLink");
          nowErrorMessages["itemLink"] = "Please enter a valid link";
          setErrorFields(nowErrorFields);
          setErrorMessages(nowErrorMessages);
        }
      });
    } else {
      setErrorFields(nowErrorFields);
      setErrorMessages(nowErrorMessages);
      if (nowErrorFields.length == 0) {
        setPosting(true);
        addToJoinedDatabase();
      }
    }
  };

  const exitCreatePopup = () =>
    Alert.alert("Confirm Exit?", "Changes you make will not be saved", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Exit", onPress: () => navigation.goBack() },
    ]);

  useEffect(() => {
    const subscriber = db
      .collection("listing")
      .doc(listingId)
      .onSnapshot((documentSnapshot) => {
        const listingData = documentSnapshot.data();
        setListingName(listingData.listingName);
        setTargetAmount(listingData.targetAmount);
        setOtherCosts(Number(listingData.otherCosts));
        setDeliveryFee(Number(listingData.deliveryFee));
        setCurrentAmount(listingData.currentAmount);
        if (listingData.collectionPoint == "") {
          setSelectedCollection("Mailing");
          setCollectionMethods("Mailing");
        }
        if (listingData.mailingMethod == "") {
          setSelectedCollection("MeetUp");
          setCollectionMethods("MeetUp");
        }
        setCollectionPoint(listingData.collectionPoint);
        setStatus(listingData.status);
        setLoading(false);
      });
    return () => subscriber();
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
              <Text style={{ color: "#696969" }}>Join: </Text> {listingName}
            </Text>
          </View>
        </View>
        <ScrollView style={styles.listingContainer}>
          <View style={styles.listingTitleAndErrorContainer}>
            <Text style={styles.inputHeader}>Item Name</Text>
            {errorFields.includes("itemName") && (
              <Text style={styles.warning}>{errorMessages["itemName"]}</Text>
            )}
          </View>
          <View
            style={[
              styles.inputBox,
              {
                borderColor: errorFields.includes("itemName")
                  ? "red"
                  : "#B0C0F9",
              },
            ]}
          >
            <TextInput
              placeholder="Enter Name"
              value={itemName}
              onChangeText={(text) => setItemName(text)}
              style={styles.input}
            />
          </View>
          <View style={styles.listingTitleAndErrorContainer}>
            <Text style={styles.inputHeader}>Item URL</Text>
            {errorFields.includes("itemLink") && (
              <Text style={styles.warning}>{errorMessages["itemLink"]}</Text>
            )}
          </View>
          <View
            style={[
              styles.inputBox,
              {
                borderColor: errorFields.includes("itemLink")
                  ? "red"
                  : "#B0C0F9",
              },
            ]}
          >
            <TextInput
              placeholder="Enter Item URL"
              value={itemLink}
              onChangeText={(text) => setItemLink(text)}
              style={styles.input}
            />
          </View>
          <View style={styles.listingTitleAndErrorContainer}>
            <Text style={styles.inputHeader}>Item Details</Text>
            {errorFields.includes("itemDescription") && (
              <Text style={styles.warning}>
                {errorMessages["itemDescription"]}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.inputBoxBig,
              {
                borderColor: errorFields.includes("itemDescription")
                  ? "red"
                  : "#B0C0F9",
              },
            ]}
          >
            <TextInput
              multiline
              placeholder="Enter details (eg. quantity, size, colour)"
              value={itemDescription}
              onChangeText={(text) => setItemDescription(text)}
              style={styles.input}
            />
          </View>
          <View style={styles.listingTitleAndErrorContainer}>
            <Text style={styles.inputHeader}>Item Cost</Text>
            {errorFields.includes("itemCost") && (
              <Text style={styles.warning}>{errorMessages["itemCost"]}</Text>
            )}
          </View>
          <View
            style={[
              styles.inputBox,
              {
                borderColor: errorFields.includes("itemCost")
                  ? "red"
                  : "#B0C0F9",
              },
            ]}
          >
            <TextInput
              placeholder="S$"
              keyboardType="numeric"
              value={itemCost}
              onChangeText={(text) => {
                const numericRegex = /^([.,0-9]{0,100})+$/;
                if (numericRegex.test(text)) {
                  setItemCost(text);
                }
              }}
              style={styles.input}
            />
          </View>
          <Text style={styles.info}>Delivery Fee: S${deliveryFee}</Text>
          <Text style={styles.info}>Commission Fee: S${otherCosts}</Text>
          {itemCost != "" && (
            <Text style={styles.info}>
              Total Cost: S$
              {parseFloat(itemCost) +
                parseFloat(deliveryFee) +
                parseFloat(otherCosts)}
            </Text>
          )}
          {itemCost == "" && (
            <Text style={styles.info}>
              Total Cost: S${parseFloat(deliveryFee) + parseFloat(otherCosts)}
            </Text>
          )}
          <View style={styles.listingTitleAndErrorContainer}>
            <Text style={styles.inputHeader}>Collection Method</Text>
            {errorFields.includes("selectedCollection") && (
              <Text style={styles.warning}>
                {errorMessages["selectedCollection"]}
              </Text>
            )}
          </View>
          {collectionMethods == "" && (
            <DropDownPicker
              style={[
                styles.dropdown,
                {
                  borderColor: errorFields.includes("selectedCollection")
                    ? "red"
                    : "#B0C0F9",
                  zIndex: 1000,
                },
              ]}
              dropDownContainerStyle={styles.dropdownContainer}
              labelStyle={styles.input}
              listItemLabelStyle={styles.input}
              open={collectionOpen}
              value={selectedCollection}
              items={collectionOptions}
              setOpen={setCollectionOpen}
              setValue={setSelectedCollection}
              placeholder="Select Collection Method"
              listMode="SCROLLVIEW"
              placeholderStyle={[styles.input, { color: "#A9A9A9" }]}
            />
          )}
          {selectedCollection == "Mailing" && (
            <View>
              {errorFields.includes("address") && (
                <Text style={[styles.warning, { marginLeft: width * 0.05 }]}>
                  {errorMessages["address"]}
                </Text>
              )}
              <View style={styles.listingTitleAndErrorContainer}>
                <View
                  style={[
                    styles.inputBox,
                    {
                      borderColor: errorFields.includes("address")
                        ? "red"
                        : "#B0C0F9",
                    },
                  ]}
                >
                  <TextInput
                    placeholder="Enter Mailing Address"
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                    style={styles.input}
                  />
                </View>
              </View>
            </View>
          )}
          {selectedCollection == "MeetUp" && (
            <View>
              <Text style={styles.info}>
                Please arrange meet up with creator at:
              </Text>
              <Text style={styles.info}>{collectionPoint}</Text>
            </View>
          )}
          <Text style={styles.inputHeader}>Other Requests</Text>
          <View style={styles.inputBoxBig}>
            <TextInput
              multiline
              placeholder="Enter Other Requests"
              value={otherRequests}
              onChangeText={(text) => setItemRequests(text)}
              style={styles.input}
            />
          </View>
          <View style={styles.listingTitleAndErrorContainer}>
            <Text style={styles.inputHeader}>Contact Details</Text>
            {errorFields.includes("contact") && (
              <Text style={styles.warning}>{errorMessages["contact"]}</Text>
            )}
          </View>
          <View
            style={[
              styles.inputBox,
              {
                borderColor: errorFields.includes("contact")
                  ? "red"
                  : "#B0C0F9",
              },
            ]}
          >
            <TextInput
              placeholder="(eg. phone number/telegram handle)"
              value={contact}
              onChangeText={(text) => setContact(text)}
              style={styles.input}
            />
          </View>
          <TouchableOpacity
            onPress={handleJoinButton}
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
    flex: 1,
    backgroundColor: "white",
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
  listingContainer: {
    height: height * 0.87,
  },
  listingTitleAndErrorContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
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
  inputBoxBig: {
    borderColor: "#B0C0F9",
    borderWidth: 2,
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.2,
    marginBottom: 13,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  input: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 6,
  },
  warning: {
    fontFamily: "raleway-regular",
    fontSize: 12,
    marginRight: width * 0.05,
    color: "red",
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
  dropdown: {
    borderColor: "#d7dffc",
    borderWidth: 0.75,
    width: width * 0.9,
    height: height * 0.06,
    marginBottom: 13,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    marginTop: 5,
    height: height * 0.06,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#58607c",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 5,

    elevation: 2,
  },
  dropdownContainer: {
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    width: width * 0.9,
    marginBottom: 13,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
});
