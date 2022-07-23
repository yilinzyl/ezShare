import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db, cloudStorage } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { IconButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import Loader from "react-native-modal-loader";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const CreateListingScreen = () => {
  const user = auth.currentUser;
  const [category, setCategory] = useState("");
  const [listingName, setListingName] = useState("");
  const [description, setDescription] = useState("");
  const [cutOffDate, setCutOffDate] = useState("Select");
  const [targetAmount, setTargetAmount] = useState("");
  const [otherCosts, setOtherCosts] = useState("");
  const [collectionMethods, setCollectionMethods] = useState([]);
  const [collectionPoint, setCollectionPoint] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [errorFields, setErrorFields] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [image, setImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");

  const [contact, setContact] = useState("");

  const [catOpen, setCatOpen] = useState(false);
  const categoryOptions = [
    { label: "Food", value: "Food" },
    { label: "Fashion", value: "Fashion" },
    { label: "Sports", value: "Sports" },
    { label: "Electronics", value: "Electronics" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Others", value: "Others" },
  ];

  const [payOpen, setPayOpen] = useState(false);
  const paymentOptions = [
    { label: "Cash on Collection", value: "cash" },
    { label: "Paylah/Paynow", value: "banking" },
  ];
  const [collectionOpen, setCollectionOpen] = useState(false);
  const collectionOptions = [
    { label: "Mailing", value: "Mailing" },
    { label: "Meet up", value: "MeetUp" },
  ];

  const navigation = useNavigation();

  const handleCreateListing = () => {
    const nowErrorFields = [];
    const nowErrorMessages = {};
    if (category == "") {
      nowErrorFields.push("category");
      nowErrorMessages["category"] = "Required Field";
    }
    if (listingName == "") {
      nowErrorFields.push("listingName");
      nowErrorMessages["listingName"] = "Required Field";
    }
    if (cutOffDate == "Select") {
      nowErrorFields.push("cutOffDate");
      nowErrorMessages["cutOffDate"] = "Required Field";
    }
    if (cutOffDate <= new Date()) {
      nowErrorFields.push("cutOffDate");
      nowErrorMessages["cutOffDate"] = "Cut off date must be in the future";
    }
    if (targetAmount == "") {
      nowErrorFields.push("targetAmount");
      nowErrorMessages["targetAmount"] = "Required Field";
    }
    if (otherCosts == "") {
      nowErrorFields.push("otherCosts");
      nowErrorMessages["otherCosts"] = "Required Field";
    }
    if (deliveryFee == "") {
      nowErrorFields.push("deliveryFee");
      nowErrorMessages["deliveryFee"] = "Required Field";
    }
    if (isNaN(targetAmount)) {
      nowErrorFields.push("targetAmount");
      nowErrorMessages["targetAmount"] = "Please enter a number";
    }
    if (isNaN(otherCosts)) {
      nowErrorFields.push("otherCosts");
      nowErrorMessages["otherCosts"] = "Please enter a number";
    }
    if (isNaN(deliveryFee)) {
      nowErrorFields.push("deliveryFee");
      nowErrorMessages["deliveryFee"] = "Please enter a number";
    }
    if (collectionMethods.length == 0) {
      nowErrorFields.push("collectionMethods");
      nowErrorMessages["collectionMethods"] = "Please select at least 1 option";
    }
    if (collectionMethods.includes("MeetUp") && collectionPoint == "") {
      nowErrorFields.push("collectionPoint");
      nowErrorMessages["collectionPoint"] = "Required for meet-ups";
    }
    if (paymentMethod == "") {
      nowErrorFields.push("paymentMethod");
      nowErrorMessages["paymentMethod"] = "Required Field";
    }
    if (paymentMethod == "banking" && paymentDetails == "") {
      nowErrorFields.push("paymentDetails");
      nowErrorMessages["paymentDetails"] = "Required for this payment method";
    }
    if (contact == "") {
      nowErrorFields.push("contact");
      nowErrorMessages["contact"] = "Required Field";
    }

    setErrorFields(nowErrorFields);
    setErrorMessages(nowErrorMessages);

    if (nowErrorFields.length == 0) {
      setPosting(true);
      db.collection("listing")
        .add({
          category: category,
          mailingMethod: collectionMethods.includes("Mailing") ? "Mailing" : "",
          collectionPoint: collectionPoint,
          cutOffDate: cutOffDate,
          listDate: new Date(),
          listingDescription: description,
          listingName: listingName,
          otherCosts: Number(otherCosts),
          deliveryFee: Number(deliveryFee),
          targetAmount: Number(targetAmount),
          user: user.uid,
          username: user.displayName,
          currentAmount: 0,
          status: "Accepting Orders - Target not reached",
          imagePresent: image != null,
          paymentMethod: paymentMethod,
          paymentDetails: paymentDetails,
          contact: contact,
          confirmed: false,
          cancelled: false,
          readyForCollection: false,
          closed: false,
          acceptingOrders: true,
        })
        .then((docRef) => {
          if (image != null) {
            uploadImage(image, docRef.id);
            navigation.navigate("View New Listing", { listingId: docRef.id });
          } else {
            navigation.navigate("View New Listing", { listingId: docRef.id });
          }
        });
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

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async (uri, id) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed")); // error occurred, rejecting
      };
      xhr.responseType = "blob"; // use BlobModule's UriHandler
      xhr.open("GET", uri, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });
    var ref = cloudStorage.ref("listingImages/" + id + ".jpg");
    return ref.put(blob).then(() => {
      blob.close();
    });
  };

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
          <Text style={styles.header}>Create Listing</Text>
        </View>
      </View>
      <ScrollView style={styles.listingContainer}>
        <View style={styles.listingTitleAndErrorContainer}>
          <Text style={styles.inputHeader}>Listing Name</Text>
          {errorFields.includes("listingName") && (
            <Text style={styles.warning}>{errorMessages["listingName"]}</Text>
          )}
        </View>
        <View
          style={[
            styles.inputBox,
            {
              borderColor: errorFields.includes("listingName")
                ? "red"
                : "#B0C0F9",
            },
          ]}
        >
          <TextInput
            placeholder="Enter Name"
            value={listingName}
            onChangeText={(text) => setListingName(text)}
            style={styles.input}
          />
        </View>
        <Text style={styles.inputHeader}>Add Image</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            icon="camera"
            mode="contained-tonal"
            color="#B0C0F9"
            size={(80 * width) / height}
            onPress={takePhoto}
          />
          <IconButton
            icon="camera-burst"
            mode="contained-tonal"
            color="#B0C0F9"
            size={(80 * width) / height}
            onPress={pickImage}
          />
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
        <View style={styles.listingTitleAndErrorContainer}>
          <Text style={styles.inputHeader}>Category</Text>
          {errorFields.includes("category") && (
            <Text style={styles.warning}>{errorMessages["category"]}</Text>
          )}
        </View>
        <DropDownPicker
          style={[
            styles.dropdown,
            {
              borderColor: errorFields.includes("category") ? "red" : "#B0C0F9",
            },
          ]}
          dropDownContainerStyle={styles.dropdownContainer}
          labelStyle={styles.input}
          listItemLabelStyle={styles.input}
          open={catOpen}
          value={category}
          items={categoryOptions}
          setOpen={setCatOpen}
          setValue={setCategory}
          placeholder="Select Category"
          listMode="SCROLLVIEW"
          placeholderStyle={[styles.input, { color: "#A9A9A9" }]}
        />
        <Text style={styles.inputHeader}>Listing Description</Text>
        <View style={styles.inputBoxBig}>
          <TextInput
            multiline
            placeholder="Enter Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.listingTitleAndErrorContainer}>
          <Text style={styles.inputHeader}>Cut-off Date</Text>
          {errorFields.includes("cutOffDate") && (
            <Text style={styles.warning}>{errorMessages["cutOffDate"]}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.widgetButton} onPress={showDatePicker}>
          <Text
            style={[
              styles.widgetText,
              {
                color: errorFields.includes("cutOffDate") ? "red" : "#6F8EFA",
              },
            ]}
          >
            {cutOffDate.toString()}
          </Text>
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
        <View style={styles.listingTitleAndErrorContainer}>
          <Text style={styles.inputHeader}>Target Amount</Text>
          {errorFields.includes("targetAmount") && (
            <Text style={styles.warning}>{errorMessages["targetAmount"]}</Text>
          )}
        </View>
        <View
          style={[
            styles.inputBox,
            {
              borderColor: errorFields.includes("targetAmount")
                ? "red"
                : "#B0C0F9",
            },
          ]}
        >
          <TextInput
            keyboardType="numeric"
            placeholder="S$"
            value={targetAmount}
            onChangeText={(text) => {
              const numericRegex = /^([.,0-9]{0,100})+$/;
              if (numericRegex.test(text)) {
                setTargetAmount(text);
              }
            }}
            style={styles.input}
          />
        </View>
        <View style={styles.listingTitleAndErrorContainer}>
          <Text style={styles.inputHeader}>Delivery Fee</Text>
          {errorFields.includes("deliveryFee") && (
            <Text style={styles.warning}>{errorMessages["deliveryFee"]}</Text>
          )}
        </View>
        <View
          style={[
            styles.inputBox,
            {
              borderColor: errorFields.includes("deliveryFee")
                ? "red"
                : "#B0C0F9",
            },
          ]}
        >
          <TextInput
            keyboardType="numeric"
            placeholder="S$"
            value={deliveryFee}
            onChangeText={(text) => {
              const numericRegex = /^([.,0-9]{0,100})+$/;
              if (numericRegex.test(text)) {
                setDeliveryFee(text);
              }
            }}
            style={styles.input}
          />
        </View>
        <View style={styles.listingTitleAndErrorContainer}>
          <Text style={styles.inputHeader}>Commission Fee</Text>
          {errorFields.includes("otherCosts") && (
            <Text style={styles.warning}>{errorMessages["otherCosts"]}</Text>
          )}
        </View>
        <View
          style={[
            styles.inputBox,
            {
              borderColor: errorFields.includes("otherCosts")
                ? "red"
                : "#B0C0F9",
            },
          ]}
        >
          <TextInput
            keyboardType="numeric"
            placeholder="S$"
            value={otherCosts}
            onChangeText={(text) => {
              const numericRegex = /^([.,0-9]{0,100})+$/;
              if (numericRegex.test(text)) {
                setOtherCosts(text);
              }
            }}
            style={styles.input}
          />
        </View>
        <View style={styles.listingTitleAndErrorContainer}>
          <Text style={styles.inputHeader}>Collection Details</Text>
          {errorFields.includes("collectionMethods") && (
            <Text style={styles.warning}>
              {errorMessages["collectionMethods"]}
            </Text>
          )}
        </View>
        <DropDownPicker
          style={[
            styles.dropdown,
            {
              borderColor: errorFields.includes("collectionMethods")
                ? "red"
                : "#B0C0F9",
            },
          ]}
          dropDownContainerStyle={styles.dropdownContainer}
          labelStyle={styles.input}
          listItemLabelStyle={styles.input}
          multiple={true}
          open={collectionOpen}
          value={collectionMethods}
          items={collectionOptions}
          setOpen={setCollectionOpen}
          setValue={setCollectionMethods}
          placeholder="Select Collection Method"
          listMode="SCROLLVIEW"
          placeholderStyle={[styles.input, { color: "#A9A9A9" }]}
          mode="BADGE"
        />
        {collectionMethods.includes("MeetUp") && (
          <View>
            {errorFields.includes("collectionPoint") && (
              <Text style={[styles.warning, { marginLeft: width * 0.05 }]}>
                {errorMessages["collectionPoint"]}
              </Text>
            )}
            <View style={styles.listingTitleAndErrorContainer}>
              <View
                style={[
                  styles.inputBox,
                  {
                    borderColor: errorFields.includes("collectionPoint")
                      ? "red"
                      : "#B0C0F9",
                  },
                ]}
              >
                <TextInput
                  placeholder="Enter Collection Point"
                  value={collectionPoint}
                  onChangeText={(text) => setCollectionPoint(text)}
                  style={styles.input}
                />
              </View>
            </View>
          </View>
        )}
        <View style={styles.listingTitleAndErrorContainer}>
          <Text style={styles.inputHeader}>Payment Details</Text>
          {errorFields.includes("paymentMethod") && (
            <Text style={styles.warning}>{errorMessages["paymentMethod"]}</Text>
          )}
        </View>
        <DropDownPicker
          style={[
            styles.dropdown,
            {
              borderColor: errorFields.includes("paymentMethod")
                ? "red"
                : "#B0C0F9",
              zIndex: 1000,
            },
          ]}
          dropDownContainerStyle={styles.dropdownContainer}
          labelStyle={styles.input}
          listItemLabelStyle={styles.input}
          open={payOpen}
          value={paymentMethod}
          items={paymentOptions}
          setOpen={setPayOpen}
          setValue={setPaymentMethod}
          placeholder="Select Payment Method"
          listMode="SCROLLVIEW"
          placeholderStyle={[styles.input, { color: "#A9A9A9" }]}
        />
        {paymentMethod == "banking" && (
          <View>
            {errorFields.includes("paymentDetails") && (
              <Text style={[styles.warning, { marginLeft: width * 0.05 }]}>
                {errorMessages["paymentDetails"]}
              </Text>
            )}
            <View style={styles.listingTitleAndErrorContainer}>
              <View
                style={[
                  styles.inputBox,
                  {
                    borderColor: errorFields.includes("paymentDetails")
                      ? "red"
                      : "#B0C0F9",
                  },
                ]}
              >
                <TextInput
                  placeholder="Enter Payment Details"
                  value={paymentDetails}
                  onChangeText={(text) => setPaymentDetails(text)}
                  style={styles.input}
                />
              </View>
            </View>
            <Text
              style={{
                fontFamily: "raleway-regular",
                fontSize: 10,
                textAlign: "right",
                marginRight: width * 0.05,
                marginTop: -6,
              }}
            >
              (shown only when joiner has been approved)
            </Text>
          </View>
        )}
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
              borderColor: errorFields.includes("contact") ? "red" : "#B0C0F9",
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
        <Text
          style={{
            fontFamily: "raleway-regular",
            fontSize: 10,
            textAlign: "right",
            marginRight: width * 0.05,
            marginTop: -6,
          }}
        >
          (shown only when joiner has been approved)
        </Text>
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
        <View style={styles.buttonBottom}></View>
      </ScrollView>
      <View style={styles.footer}></View>
    </View>
  );
};

export default CreateListingScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
    flex: 1,
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
    flex: 1,
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
  warning: {
    fontFamily: "raleway-regular",
    fontSize: 12,
    marginRight: width * 0.05,
    color: "red",
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
    textAlign: "left",
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
