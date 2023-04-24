import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useAssets } from "expo-asset";
import { useDispatch } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";
import {
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { authRegistration } from "../../redux/auth/authOperations";

export const RegistrationScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [statusImPic, requestPermissionImPic] =
    ImagePicker.useMediaLibraryPermissions();
  const [assets, error] = useAssets([
    require("../../assets/images/green_frog.png"),
  ]);
  const dispatch = useDispatch();

  const onSubmitPress = async () => {
    try {
      if (!login.trim() || !email.trim() || !password.trim()) {
        Alert.alert("Please, fill all the fields");
      } else {
        const avatarPhoto = await uploadPhotoToServer();
        dispatch(
          authRegistration({ login, email, password, avatar: avatarPhoto })
        );
        setLogin("");
        setEmail("");
        setPassword("");
        setIsShowKeyboard(false);
        Keyboard.dismiss();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleLogin = (value) => setLogin(value);
  const handleEmail = (value) => setEmail(value.trim());
  const handlePassword = (value) => setPassword(value.trim());
 
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("err", error.message);
    }
    
  };
  
  const storage = getStorage();
  const uploadPhotoToServer = async () => {
    let AvtUrl = avatar;
    if (!avatar) {
      AvtUrl = assets[0].localUri;
     
    }

    const response = await fetch(AvtUrl);
    const file = await response.blob();
    const uniquePostId = uuid.v4();
    const storageRef = ref(storage, `avatar/${uniquePostId}`);
    const data = await uploadBytes(storageRef, file);

    const urlAvatar = await getDownloadURL(
      ref(storage, `avatar/${uniquePostId}`)
    );
    return urlAvatar;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.containerMain}>
        <ImageBackground
          style={styles.imageBG}
          source={require("../../assets/images/photo-BG.jpg")}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS == "ios" ? "padding" : null} 
            style={styles.container}
          >
            <View style={styles.userPhoto}>
              <Image
                source={{ uri: avatar }}
                style={{ width: 120, height: 120, borderRadius: 16 }}
              />
              <TouchableOpacity style={styles.btnAddPhoto} onPress={pickImage}>
                <Ionicons name="add" size={24} color="#FF6C00" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Login"
                placeholderTextColor="#BDBDBD"
                value={login}
                onChangeText={handleLogin}
                onFocus={() => setIsShowKeyboard(true)}
              ></TextInput>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#BDBDBD"
                value={email}
                onChangeText={handleEmail}
                onFocus={() => setIsShowKeyboard(true)}
              />
              <View>
                <TextInput
                  style={styles.inputLast}
                  placeholder="Password"
                  placeholderTextColor="#BDBDBD"
                  secureTextEntry={passwordVisible}
                  value={password}
                  onChangeText={handlePassword}
                  onFocus={() => setIsShowKeyboard(true)}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.passwordShow}
                >
                  {passwordVisible ? (
                    <Text style={styles.passwordText}>Show</Text>
                  ) : (
                    <Text style={styles.passwordText}>Hide</Text>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.8}
                onPress={onSubmitPress}
              >
                <Text style={styles.btnTitle}>Sign Up</Text>
              </TouchableOpacity>
              <Text
                style={styles.text}
                onPress={() => navigation.navigate("Login")}
              >
                Already have an account? Sign In
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  imageBG: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    position: "relative",

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: "auto",
    backgroundColor: "#FFFFFF",
    paddingTop: 92,
  },

  userPhoto: {
    position: "absolute",

    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    top: -60,
    alignSelf: "center",
    marginHorizontal: "auto",
    width: 120,
    height: 120,
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
    borderColor: "#FF6C00",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginBottom: 33,

    fontFamily: "Roboto-Medium",
    fontStyle: "normal",
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#212121",
  },
  form: {
    marginHorizontal: 16,
    marginBottom: 78,
    outlineWidth: 1,
    outlineStyle: "solid",
  },

  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 40,
    borderWidth: 1,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    borderColor: "#E8E8E8",
    borderStyle: "solid",
    marginBottom: 16,
  },

  inputLast: {
    position: "relative",
    paddingHorizontal: 16,
    height: 40,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    borderColor: "#E8E8E8",
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 43,
  },
  passwordShow: {
    position: "absolute",
    right: 16,
    top: 10,
  },
  passwordText: {
    color: "#1B4371",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 19,
  },
  btn: {
    alignItems: "center",
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    marginBottom: 16,
  },
  btnTitle: {
    color: "#f0f8ff",
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#FFFFFF",
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontStyle: "normal",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#1B4371",
  },
});
