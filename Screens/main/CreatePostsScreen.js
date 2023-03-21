import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export const CreatePostsScreen = ({ navigation }) => {
 
  const [adress, setAdress] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  const [description, setDescription] = useState("");
  const [hasPermission, setHasPermission] = useState(null); 
  const [hasCameraPermission, requestPermission] =
    Camera.useCameraPermissions(); 
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [picture, setPicture] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { userId, login, avatar } = useSelector((state) => state.auth);

  useEffect(() => {
    getLocation();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
 
  };
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");

        return;
      } else {
        const locationRes = await Location.getCurrentPositionAsync({});
        if (!locationRes) {
          return;
        }
        const loc = {
          latitude: locationRes.coords.latitude,
          longitude: locationRes.coords.longitude,
        };
        setCoordinates(loc);

        const place = await Location.reverseGeocodeAsync({
          latitude: locationRes.coords.latitude,
          longitude: locationRes.coords.longitude,
        });
        const adrText = `${place[0].country}  ${place[0].city} `; 

        setAdress(adrText);
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("err", error.message);
      
    }
  };

  const takePicture = async () => {
    try {
      if (cameraRef) {
        const options = { quality: 0.5, base64: true, skipProcessing: true };
        const picture = await cameraRef.takePictureAsync(options);
        setPicture(picture.uri);
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("err", error.message);
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  
  const storage = getStorage();

  const uploadPhotoToServer = async () => {
    const response = await fetch(picture);
    const file = await response.blob();

    const uniquePostId = Date.now().toString();
    const storageRef = ref(storage, `images/${uniquePostId}`);
    const data = await uploadBytes(storageRef, file);
    const urlPhoto = await getDownloadURL(
      ref(storage, `images/${uniquePostId}`)
    );
    return urlPhoto;
  };

  const uploadPostToServer = async () => {
    try {
      const date = new Date();
      const photo = await uploadPhotoToServer();

      await addDoc(collection(db, "posts"), {
        photo,
        description,
        location: coordinates,
        userId,
        login,
        adress,
        date,
        avatar,
        likes: 0,
      });
    } catch (error) {
      const errorMessage = error.message;
      console.log("err", error.message);
     
    }
  };
  
  const sendPhoto = () => {
    uploadPostToServer();
    navigation.navigate("DefaultScreenPosts");
    setPicture("");
    setDescription("");
    setAdress("");
  };
  const deletePhoto = () => {
    setPicture("");
    setDescription("");
    setAdress("");
    getLocation();
  };

  return (
    <View style={styles.container}>
      <View>
        {/* //////1 */}
        {picture ? (
          <View style={styles.takenPictureContainer}>
            <Image
              source={{ uri: picture }}
              style={{ width: "100%", height: 240, borderRadius: 8 }}
            />
          </View>
        ) : (
          <Camera
            onCameraReady={onCameraReady}
            style={styles.camera}
            type={type}
            ref={(ref) => {
              setCameraRef(ref); 
            }}
          >
            <TouchableOpacity
              onPress={() => takePicture()}
              style={styles.button}
            >
              <FontAwesome name="camera" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </Camera>
        )}
        <Text style={styles.loadPhotoText}>
          {picture ? "Add information" : "Make photo"}
        </Text>

        <TextInput
          style={{ ...styles.input, marginBottom: 16 }}
          placeholder="Image description"
          placeholderTextColor="#BDBDBD"
          value={description}
          onChangeText={setDescription}
        />

        {/* <View style={{ marginBottom: 32 }}> */}
        <TextInput
          style={{ ...styles.input, paddingLeft: 28 }}
          placeholder="Location"
          placeholderTextColor="#BDBDBD"
          value={adress ? adress : "Wait...We are trying to find the location"}
          
        />
        <Feather
          name="map-pin"
          size={24}
          color="#BDBDBD"
          style={{ position: "absolute", bottom: 13 }}
        />
        {/* </View> */}
      </View>
      <View>
        {/* //3 */}
        <TouchableOpacity
          style={
            picture ? { ...styles.btn, backgroundColor: "#FF6C00" } : styles.btn
          }
          activeOpacity={0.8}
          onPress={sendPhoto}
        >
          <Text
            style={
              picture ? { ...styles.btnTitle, color: "#fff" } : styles.btnTitle
            }
          >
            Send
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deletePhoto()} style={styles.trash}>
          <Feather name="trash-2" size={24} color="#BDBDBD" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  camera: {
    height: 240,
    marginTop: 32,
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    overflow: "hidden",
    borderRadius: 8,
    marginBottom: 8,
  },
  loadPhotoText: {
    marginBottom: 32,
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 18.75,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "#FFFFFF",
    alignSelf: "center",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 18.75,
    borderWidth: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E8E8E8",
    borderStyle: "solid",
  },

  btn: {
    justifyContent: "center",
    height: 51,
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
    marginBottom: 16,
  },
  trash: {
    alignSelf: "center",
    marginBottom: 22,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  btnTitle: {
    color: "#f0f8ff",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#BDBDBD",
  },
  takenPictureContainer: {
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    height: 240,
  },
});