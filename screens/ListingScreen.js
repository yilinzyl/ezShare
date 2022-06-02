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

const ListingScreen = () => {
  const user = auth.currentUser;
  const [category, setCategory] = useState("");
  const [listingName, setListingName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [description, setDescription] = useState("");
  const [cutOffDate, setCutOffDate] = useState("Select");
  const [targetAmount, setTargetAmount] = useState("");
  const [otherCosts, setOtherCosts] = useState("");
  const [collectionPoint, setCollectionPoint] = useState("");

  const navigation = useNavigation();

  const handleCreateListing = () => {
    db.collection("listing")
      .add({
        category: category,
        "collection-point": collectionPoint,
        "cut-off-date": cutOffDate,
        "image-url": imageURL,
        "list-date": new Date(),
        "listing-description": description,
        "listing-name": listingName,
        "other-costs": otherCosts,
        "target-amount": targetAmount,
        user: user.uid,
        "user-name": user.displayName,
      })
      .then(() => {
        navigation.navigate("Home");
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

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

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
          <Text style={styles.header}>Create Listing</Text>
        </View>
      </View>
      <ScrollView style={styles.listingContainer}>
        <Text style={styles.inputHeader}>Listing Name</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter Name"
            value={listingName}
            onChangeText={(text) => setListingName(text)}
            style={styles.input}
          />
        </View>
        <Text style={styles.inputHeader}>Add Image URL</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter Image URL"
            value={imageURL}
            onChangeText={(text) => setImageURL(text)}
            style={styles.input}
          />
        </View>
        <Text style={styles.inputHeader}>Category</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter Category"
            value={category}
            onChangeText={(text) => setCategory(text)}
            style={styles.input}
          />
        </View>
        <Text style={styles.inputHeader}>Listing Description</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={styles.input}
          />
        </View>
        <Text style={styles.inputHeader}>Cut-off Date</Text>
        <TouchableOpacity style={styles.widgetButton} onPress={showDatePicker}>
          <Text style={styles.widgetText}>{cutOffDate.toString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={(date) => {
            setCutOffDate(date);
            hideDatePicker();
            pickDate();
          }}
          onCancel={() => {
            hideDatePicker();
            console.log("failed to load date");
          }}
          onHide={() => hideDatePicker()}
        />
        <Text style={styles.inputHeader}>Target Amount</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="$"
            value={targetAmount}
            onChangeText={(text) => setTargetAmount(text)}
            style={styles.input}
          />
        </View>
        <Text style={styles.inputHeader}>Other Costs</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="$"
            value={otherCosts}
            onChangeText={(text) => setOtherCosts(text)}
            style={styles.input}
          />
        </View>
        <Text style={styles.inputHeader}>Collection Point</Text>
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter Collection Point"
            value={collectionPoint}
            onChangeText={(text) => setCollectionPoint(text)}
            style={styles.input}
          />
        </View>
        <TouchableOpacity
          onPress={handleCreateListing}
          style={styles.createButton}
          // onPress={() => {
          //   console.log(
          //     db
          //       .collection("listing")
          //       .doc("test")
          //       .get()
          //       .then(
          //         (x) => console.log(x.data()),
          //         (x) => console.log("fail")
          //       )
          //   );
          // }}
        >
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ListingScreen;

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
});
