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
import { auth, db, cloudStorage } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IconButton } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import Loader from "react-native-modal-loader";

// Variable width of current window
var width = Dimensions.get("window").width;

// Variable height of current window
var height = Dimensions.get("window").height;

const JoinerDetailsScreen = ({ route, navigation }) => {
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
  const [totalCost, setTotalCost] = useState("");
  const [joinerName, setJoinerName] = useState("");
  const [joinerId, setJoinerId] = useState("");
  const [paid, setPaid] = useState(false);
  const [approved, setApproved] = useState(false);
  const [collected, setCollected] = useState(false);
  const [paymentProof, setPaymentProof] = useState("");
  const [hasPaymentProof, setHasPaymentProof] = useState(false);
  const [deliveryProof, setDeliveryProof] = useState("");
  const [hasDeliveryProof, setHasDeliveryProof] = useState(false);
  const [image, setImage] = useState(null);
  const [paymentImage, setPaymentImage] = useState(null);
  const [deliveryImage, setDeliveryImage] = useState(null);
  const [collectionMethod, setCollectionMethod] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [posting, setPosting] = useState(false);

  const getPaymentImage = () => {
    cloudStorage
      .ref("paymentProof/" + joinedId + ".jpg")
      .getDownloadURL()
      .then((url) => {
        setPaymentImage(url);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getDeliveryImage = () => {
    cloudStorage
      .ref("deliveryProof/" + joinedId + ".jpg")
      .getDownloadURL()
      .then((url) => {
        setDeliveryImage(url);
      })
      .catch((e) => {
        console.log(e);
      });
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

  const uploadImage = async (uri, path) => {
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
    var ref = cloudStorage.ref(path);
    return ref.put(blob).then(() => {
      blob.close();
      setImage(null);
      setPosting(false);
    });
  };

  const handleApproveButton = () =>
    Alert.alert("Approve joiner?", "This action cannot be reversed.", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Confirm", onPress: markAsApproved },
    ]);

  const markAsApproved = () => {
    db.collection("joined")
      .doc(joinedId)
      .update({
        approved: true,
        completed: approved && paid && collected,
      })
      .then(() => {
        console.log("Joiner approved!");
      });
  };

  const handlePaidButton = () =>
    Alert.alert(
      "Confirm that joiner has made payment?",
      "This action cannot be reversed.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Confirm", onPress: markAsPaid },
      ]
    );

  const markAsPaid = () => {
    db.collection("joined")
      .doc(joinedId)
      .update({
        paid: true,
        completed: approved && paid && collected,
      })
      .then(() => {
        console.log("paid!");
      });
  };

  const handlePaymentProofButton = () => {
    if (!image) {
      Alert.alert("Please select an image", "", [
        {
          text: "Ok",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
    } else {
      Alert.alert("Confirm submission?", "This action cannot be reversed.", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            setPosting(true);
            setPaymentImage(image);
            uploadImage(image, "paymentProof/" + joinedId + ".jpg");
            addPaymentProofText();
          },
        },
      ]);
    }
  };

  const addPaymentProofText = () => {
    db.collection("joined")
      .doc(joinedId)
      .update({
        paymentProof: paymentProof == "" ? "-" : paymentProof,
      })
      .then(() => {
        console.log("added payment proof!");
        setHasPaymentProof(true);
        setPosting(false);
      });
  };

  const handleDeliveryProofButton = () => {
    if (!image) {
      Alert.alert("Please select an image", "", [
        {
          text: "Ok",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]);
    } else {
      Alert.alert("Confirm submission?", "This action cannot be reversed.", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            setPosting(true);
            setDeliveryImage(image);
            uploadImage(image, "deliveryProof/" + joinedId + ".jpg");
            addDeliveryProofText();
          },
        },
      ]);
    }
  };

  const addDeliveryProofText = () => {
    db.collection("joined")
      .doc(joinedId)
      .update({
        deliveryProof: deliveryProof == "" ? "-" : deliveryProof,
      })
      .then(() => {
        console.log("added delivery proof!");
        setHasDeliveryProof(true);
        setPosting(false);
      });
  };

  const handleCollectedButton = () =>
    Alert.alert(
      "Confirm that you have collected all items?",
      "This action cannot be reversed.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Confirm", onPress: markAsCollected },
      ]
    );

  const markAsCollected = () => {
    db.collection("joined")
      .doc(joinedId)
      .update({
        collected: true,
        completed: approved && paid && collected,
      })
      .then(() => {
        console.log("collected!");
      });
  };

  useEffect(() => {
    getPaymentImage();
    getDeliveryImage();
    const subscriberJoiner = db
      .collection("joined")
      .doc(joinedId)
      .onSnapshot((documentSnapshot) => {
        const joinerData = documentSnapshot.data();
        setItemName(joinerData.itemName);
        setItemLink(joinerData.itemLink);
        setItemDescription(joinerData.itemDescription);
        setItemCost(joinerData.itemCost);
        setItemRequests(joinerData.otherRequests);
        setJoinerName(joinerData.username);
        setJoinerId(joinerData.userID);
        setCollected(joinerData.collected);
        setApproved(joinerData.approved);
        setPaid(joinerData.paid);
        setDeliveryProof(joinerData.deliveryProof);
        setPaymentProof(joinerData.paymentProof);
        setHasPaymentProof(joinerData.paymentProof != "");
        setHasDeliveryProof(joinerData.deliveryProof != "");
        setContact(joinerData.contact);
        setTotalCost(joinerData.totalCost);
        setCollectionMethod(joinerData.collectionMethod);
        setAddress(joinerData.address);
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

  const handleOpenURL = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Invalid Link", "", [
          {
            text: "Ok",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ]);
      }
    });
  };

  if (loadingJoinerInfo || loadingListingInfo) {
    return (
      <View>
        <Text style={styles.header}>"Loading..."</Text>
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
            onPress={() => navigation.goBack()}
          />
          <View>
            <Text style={styles.header}>
              <Text style={{ color: "#696969" }}>Track: </Text>
              {listingName}
            </Text>
            <Text style={styles.createdBy}>Joined by {joinerName}</Text>
          </View>
        </View>
        <ScrollView style={styles.listingContainer}>
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            {approved && (
              <IconButton
                icon="checkbox-outline"
                size={0.05 * width}
                style={{ marginLeft: width * 0.05, marginRight: width * -0.05 }}
              />
            )}
            {!approved && (
              <IconButton
                icon="checkbox-blank-outline"
                size={0.05 * width}
                style={{ marginLeft: width * 0.05, marginRight: width * -0.05 }}
              />
            )}
            <Text style={styles.info}>Approved</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            {paid && (
              <IconButton
                icon="checkbox-outline"
                size={0.05 * width}
                style={{ marginLeft: width * 0.05, marginRight: width * -0.05 }}
              />
            )}
            {!paid && (
              <IconButton
                icon="checkbox-blank-outline"
                size={0.05 * width}
                style={{ marginLeft: width * 0.05, marginRight: width * -0.05 }}
              />
            )}
            <Text style={styles.info}>Paid</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            {collected && (
              <IconButton
                icon="checkbox-outline"
                size={0.05 * width}
                style={{ marginLeft: width * 0.05, marginRight: width * -0.05 }}
              />
            )}
            {!collected && (
              <IconButton
                icon="checkbox-blank-outline"
                size={0.05 * width}
                style={{ marginLeft: width * 0.05, marginRight: width * -0.05 }}
              />
            )}
            <Text style={styles.info}>Collected</Text>
          </View>

          <Text style={styles.infoHeader}>Item Name</Text>
          <Text style={styles.info}>{itemName}</Text>
          <Text style={styles.infoHeader}>Item Link</Text>
          <Text
            style={styles.hyperlink}
            onPress={() => handleOpenURL(itemLink)}
          >
            Click to open link
          </Text>
          <Text style={styles.infoHeader}>Item Description</Text>
          <Text style={styles.info}>{itemDescription}</Text>
          <Text style={styles.infoHeader}>Item Cost</Text>
          <Text style={styles.info}>S$ {itemCost}</Text>
          <Text style={styles.info}>Total cost: S$ {totalCost}</Text>
          <Text style={styles.infoHeader}>Contact Details</Text>
          <Text style={styles.info}>{contact}</Text>
          <Text style={styles.infoHeader}>Collection Method</Text>
          {collectionMethod == "MeetUp" && (
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
              <Text style={styles.collectionInfo}>Meet-up</Text>
            </View>
          )}
          {collectionMethod == "Mailing" && (
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
              <Text style={styles.collectionInfo}>Mail to: {address}</Text>
            </View>
          )}
          <Text style={styles.infoHeader}>Other Requests</Text>
          <Text style={styles.info}>{otherRequests}</Text>
          {hasPaymentProof && (
            <View>
              <Text style={styles.infoHeader}>Payment Proof</Text>
              <Text style={styles.info}>{paymentProof}</Text>
              <Image
                source={{ uri: paymentImage }}
                style={{
                  width: 0.9 * width,
                  height: 0.9 * width,
                  alignSelf: "center",
                }}
              />
            </View>
          )}
          {hasDeliveryProof && (
            <View>
              <Text style={styles.infoHeader}>Collection Proof</Text>
              <Text style={styles.info}>{deliveryProof}</Text>
              <Image
                source={{ uri: deliveryImage }}
                style={{
                  width: 0.9 * width,
                  height: 0.9 * width,
                  alignSelf: "center",
                }}
              />
            </View>
          )}

          {user.uid == listingUserId && !approved && (
            <TouchableOpacity
              onPress={handleApproveButton}
              style={styles.updateButton}
            >
              <Text style={styles.buttonText}>Approve Order</Text>
            </TouchableOpacity>
          )}
          {user.uid == listingUserId && approved && !paid && (
            <TouchableOpacity
              onPress={handlePaidButton}
              style={styles.updateButton}
            >
              <Text style={styles.buttonText}>Mark as Paid</Text>
            </TouchableOpacity>
          )}
          {user.uid == listingUserId &&
            approved &&
            !collected &&
            !hasDeliveryProof && (
              <View>
                <View
                  style={{
                    borderColor: "black",
                    borderWidth: 1,
                    marginLeft: width * 0.02,
                    marginRight: width * 0.02,
                    marginTop: height * 0.02,
                    marginBottom: height * 0.02,
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.provideText}>
                    Provide Proof of Collection/ Mailing Proof to Joiner
                  </Text>
                  <View
                    style={{
                      marginTop: height * 0.05,
                      flexDirection: "row",
                      alignSelf: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <View style={styles.inputBox}>
                      <TextInput
                        multiline
                        placeholder="Comments"
                        value={deliveryProof}
                        onChangeText={(text) => setDeliveryProof(text)}
                        style={styles.input}
                      />
                    </View>
                    <IconButton
                      icon="camera"
                      mode="contained-tonal"
                      color="#B0C0F9"
                      size={(60 * width) / height}
                      onPress={takePhoto}
                    />
                    <IconButton
                      icon="camera-burst"
                      mode="contained-tonal"
                      color="#B0C0F9"
                      size={(60 * width) / height}
                      onPress={pickImage}
                    />
                  </View>
                  {image && (
                    <Image
                      source={{ uri: image }}
                      style={{ width: 200, height: 200 }}
                    />
                  )}
                  <TouchableOpacity
                    onPress={handleDeliveryProofButton}
                    style={styles.submitButton}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          {user.uid == joinerId && approved && !paid && !hasPaymentProof && (
            <View>
              <View
                style={{
                  borderColor: "black",
                  borderWidth: 1,
                  marginLeft: width * 0.02,
                  marginRight: width * 0.02,
                  marginTop: height * 0.02,
                  marginBottom: height * 0.02,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    marginTop: height * 0.05,
                    flexDirection: "row",
                    alignSelf: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <View style={styles.inputBox}>
                    <TextInput
                      multiline
                      placeholder="Comments"
                      value={paymentProof}
                      onChangeText={(text) => setPaymentProof(text)}
                      style={styles.input}
                    />
                  </View>
                  <IconButton
                    icon="camera"
                    mode="contained-tonal"
                    color="#B0C0F9"
                    size={(60 * width) / height}
                    onPress={takePhoto}
                  />
                  <IconButton
                    icon="camera-burst"
                    mode="contained-tonal"
                    color="#B0C0F9"
                    size={(60 * width) / height}
                    onPress={pickImage}
                  />
                </View>
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 200, height: 200 }}
                  />
                )}
                <TouchableOpacity
                  onPress={handlePaymentProofButton}
                  style={styles.updateButton}
                >
                  <Text style={styles.buttonText}>Provide Payment Proof</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {user.uid == joinerId && approved && !collected && (
            <TouchableOpacity
              onPress={handleCollectedButton}
              style={styles.updateButton}
            >
              <Text style={styles.buttonText}>Verify Collection</Text>
            </TouchableOpacity>
          )}
          <View style={styles.buttonBottom}></View>
        </ScrollView>
      </View>
    );
  }
};

export default JoinerDetailsScreen;

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
  listingContainer: {
    height: height * 0.87,
  },
  info: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
    marginBottom: 15,
  },
  inputBox: {
    borderColor: "#B0C0F9",
    borderWidth: 2,
    borderRadius: 10,
    width: width * 0.63,
    height: height * 0.08,
    marginBottom: 13,
    marginLeft: width * 0.05,
    marginRight: width * 0.05,
  },
  input: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    margin: 6,
  },
  hyperlink: {
    fontFamily: "raleway-bold",
    fontSize: 16,
    marginLeft: width * 0.05,
    marginBottom: 15,
    color: "#F898A3",
    textDecorationLine: "underline",
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
    width: width * 0.8,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: height * 0.02,
    borderRadius: 45,
  },
  submitButton: {
    backgroundColor: "#F898A3",
    height: 50,
    width: width * 0.3,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: height * 0.02,
    borderRadius: 45,
  },
  buttonText: {
    fontFamily: "raleway-bold",
    color: "#F9FAFE",
    fontSize: 20,
  },
  provideText: {
    fontFamily: "raleway-bold",
    color: "#262626",
    fontSize: 18,
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
  collectionInfo: {
    fontFamily: "raleway-regular",
    fontSize: 16,
    marginLeft: width * 0.05,
    marginBottom: 15,
    marginRight: width * 0.15,
  },
});
