import React, { useEffect, useState } from "react";
import {
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import {
  authSignOutUser,
  authChangeUserAvatar,
} from "../../redux/auth/authOperations";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAssets } from "expo-asset";
import {
  getBlob,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import uuid from "react-native-uuid";
import { AntDesign } from "@expo/vector-icons";
export const ProfileScreen = ({ navigation }) => {
  const { userId, login, avatar, email } = useSelector((state) => state.auth);
  const [loader, setLoader] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newAvatar, setNewAvatar] = useState(null);
  const [statusImPic, requestPermissionImPic] =
    ImagePicker.useMediaLibraryPermissions();
  const [assets, error] = useAssets([
    require("../../assets/images/green_frog.png"),
  ]);
  useEffect(() => {
    getAllPost();
  }, []);

  const getAllPost = async () => {
    setLoader(true);
    const q = query(collection(db, "posts"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const photoArr = [];
        querySnapshot.forEach((doc) => {
          photoArr.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setPosts(photoArr);
        setLoader(false);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubscribe();
    };
  };

  const updateLikes = async (likes, itemId) => {
    try {
      const likeRef = doc(db, "posts", itemId);
      await updateDoc(likeRef, {
        likes: likes,
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("err", error.message);
    }
  };
 
  const dispatch = useDispatch();
 
  const signOut = () => {
    dispatch(authSignOutUser());
  };

  const pickImage = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    if (!result.canceled) {
      setNewAvatar(result.assets[0].uri);
      Alert.alert("To confirm press green button");
    }
  };
  
  async function blobFromURL(url) {
    const blob = await fetch(url).then((r) => r.blob());
   
    return blob;
  }

  const storage = getStorage();

  const uploadPhotoToServer = async () => {
    let AvtUrl = newAvatar;

    if (!newAvatar) {
      AvtUrl = assets[0].localUri;
     
    }
    const blob = await blobFromURL(AvtUrl);
    

    const uniquePostId = uuid.v4();

    const storageRef = ref(storage, `avatar/${uniquePostId}`);

    const data = await uploadBytes(storageRef, blob);

    const urlAvatar = await getDownloadURL(
      ref(storage, `avatar/${uniquePostId}`)
    );

    return urlAvatar;
  };
  
  const handleSubmit = async () => {
    try {
      const avatarPhoto = await uploadPhotoToServer();

      dispatch(authChangeUserAvatar({ avatarPhoto })); 

      Alert.alert("Your avatar has been added");
      setNewAvatar(null);
    } catch (error) {
      console.log("error in Handle", error.message);
    }
  };
 
  return (
    <View style={styles.containerMain}>
      <ImageBackground
        style={styles.imageBG}
        source={require("../../assets/images/photo-BG.jpg")}
      >
        <View style={styles.container}>
          {/* //---------------------------- */}
          <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
            <Feather name="log-out" size={24} color="rgba(189, 189, 189, 1)" />
          </TouchableOpacity>
          {/* //-------------------------------------- */}

          {newAvatar ? (
            <View style={styles.userPhoto}>
              <Image
                source={{ uri: newAvatar }}
                style={{ width: 120, height: 120, borderRadius: 16 }}
              />
              <TouchableOpacity
                style={{
                  ...styles.btnAddPhoto,
                  borderColor: "#439A97",
                }}
                onPress={handleSubmit}
              >
                <AntDesign name="checkcircleo" size={24} color="#439A97" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.userPhoto}>
              <Image
                source={{ uri: avatar }}
                style={{ width: 120, height: 120, borderRadius: 16 }}
              />
              <TouchableOpacity
                style={{
                  ...styles.btnAddPhoto,

                  borderColor: "rgba(33, 33, 33, 0.8)",
                }}
                onPress={pickImage}
              >
                <Ionicons
                  name="add"
                  size={24}
                  color="rgba(33, 33, 33, 0.8)"
                  style={{ transform: [{ rotate: "45deg" }] }}
                />
              </TouchableOpacity>
            </View>
          )}

          <Text
            style={{
              fontFamily: "Roboto-Regular",
              fontStyle: "normal",
              fontSize: 30,
              lineHeight: 35,
              textAlign: "center",
              color: "#212121",
              marginBottom: 33,
            }}
          >
            {login}
          </Text>
          <ActivityIndicator animating={loader} size="small" color="#0000ff" />
          <FlatList
            style={{ marginBottom: 130 }}
            data={posts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View>
                <Image
                  source={{ uri: item.photo }}
                  style={{
                    width: "100%",
                    height: 240,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                />
                <Text
                  style={{
                    marginBottom: 11,
                    fontFamily: "Roboto-Medium",
                    fontStyle: "normal",
                    fontSize: 16,
                    lineHeight: 19,
                  }}
                >
                  {item.description}
                </Text>
                <View style={styles.description}>
                  <View style={styles.comments}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Comments", {
                          postId: item.id,
                          postPhoto: item.photo,
                          autorPostId: item.userId,
                        })
                      }
                    >
                      <Feather
                        name="message-circle"
                        size={24}
                        color={
                          item.commentsQuantity > 0 ? "#FF6C00" : "#BDBDBD"
                        }
                        style={{ marginRight: 9 }}
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 18.75,
                        color: "#212121",
                        fontFamily: "Roboto-Regular",
                      }}
                    >
                      {item.commentsQuantity ? item.commentsQuantity : ""}
                    </Text>
                  </View>
                  <View style={styles.likes}>
                    <TouchableOpacity
                      onPress={() => {
                        updateLikes(item.likes + 1, item.id);
                      }}
                    >
                      <Feather
                        name="thumbs-up"
                        size={24}
                        color={item.likes > 0 ? "#FF6C00" : "#BDBDBD"}
                        style={{ marginRight: 9 }}
                      />
                    </TouchableOpacity>
                    <Text>{item.likes ? item.likes : ""}</Text>
                  </View>

                  <View style={styles.location}>
                    <Feather
                      name="map-pin"
                      size={24}
                      color="#BDBDBD"
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      onPress={() => {
                        if (item.location) {
                          navigation.navigate("Map", {
                            location: item.location,
                            picture: item.photo,
                          });
                        } else {
                          Alert.alert("There is no location");
                        }
                      }}
                      style={{
                        fontSize: 16,
                        lineHeight: 19,
                        color: "#212121",
                        fontFamily: "Roboto-Regular",
                        textDecorationLine: "underline",
                      }}
                    >
                      {item.adress ? item.adress : "Somewhere in the World"}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageBG: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    paddingHorizontal: 16,
    position: "relative",

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 147,
    height: "100%",
    backgroundColor: "#FFFFFF",

    paddingTop: 92,
  },
  btnAddPhoto: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    bottom: 14,
    right: "-10%",
    width: 25,
    height: 25,
    borderRadius: 50,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",
  },
  logoutBtn: { position: "absolute", right: 16, top: 22 },
  userPhoto: {
    position: "absolute",
    marginBottom: 32,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    top: -60,
    alignSelf: "center",
    marginHorizontal: "auto",
    width: 120,
    height: 120,
  },
  description: {
    paddingBottom: 34,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  comments: {
    flexDirection: "row",
    alignItems: "center",
  },
  likes: { flexDirection: "row", alignItems: "center" },
  location: { flexDirection: "row", alignItems: "center" },
});