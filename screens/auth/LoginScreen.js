import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";

import { authLogIn } from "../../redux/auth/authOperations";

export const LoginScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);

  const dispatch = useDispatch();
  const handleEmail = (value) => setEmail(value.trim());
  const handlePassword = (value) => setPassword(value.trim());

  const onSubmitPress = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Please, fill all the fields");
    } else {
      setIsShowKeyboard(false);
      Keyboard.dismiss();
      dispatch(authLogIn({ email, password }));
      setEmail("");
      setPassword("");
    }
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
            <Text style={styles.title}>Log In</Text>
            <View style={styles.form}>
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
                <Text style={styles.btnTitle}>Log In</Text>
              </TouchableOpacity>
              <Text
                style={styles.text}
                onPress={() => navigation.navigate("Registr")}
              >
                Have no account? Sign Up
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
    paddingTop: 32,
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
    outlineWidth: 1,
    outlineStyle: "solid",
    marginBottom: 144,
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
