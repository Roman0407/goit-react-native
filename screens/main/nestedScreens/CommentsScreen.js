import React, { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import {
  Image,
  Alert,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import { db } from "../../../firebase/config";
import { Feather } from "@expo/vector-icons";

export const CommentsScreen = ({ route }) => {
  const { postId } = route.params;
  const { postPhoto } = route.params;
  const { autorPostId } = route.params;
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

  const { userId, login, avatar } = useSelector((state) => state.auth);
  useEffect(() => {
    getAllComments();
  }, []);

  
  const addComment = async () => {
    try {
      const date = new Date().toLocaleString();
      const docRef = await addDoc(collection(db, "posts", postId, "comments"), {
        comment: comment,
        login: login,
        date: date,
        autorCommentId: userId,
        avatar: avatar,
      });
      const cityRef = doc(db, "posts", postId);
      await setDoc(
        cityRef,
        { commentsQuantity: allComments.length + 1 },
        { merge: true }
      );
    } catch (error) {
      const errorMessage = error.message;
      console.log("err", error.message);
      Alert.alert(errorMessage);
    }
  };
  const sendComment = () => {
    addComment();
    setComment("");
    keyboardHide();
  };

  const getAllComments = async () => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const commentsArr = [];
        querySnapshot.forEach((doc) => {
          commentsArr.push({
            ...doc.data(),
            id: doc.id,
          });
        });

        setAllComments(commentsArr);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsubscribe();
    };
  };

  const keyboardHide = () => {
    Keyboard.dismiss();
  };

  
  return (
    <View style={styles.container}>
      <View>
        {/* style={styles.postsContainer} */}
        <TouchableWithoutFeedback onPress={keyboardHide}>
          <View>
            <Image
              source={{ uri: postPhoto }}
              style={{
                width: "100%",
                height: 240,
                borderRadius: 8,
                marginBottom: 32,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
        <FlatList
          data={allComments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <View
                style={
                  autorPostId === item.autorCommentId
                    ? styles.commentArreaReverse
                    : styles.commentArrea
                }
              >
                <View
                  style={
                    autorPostId === item.autorCommentId
                      ? { marginLeft: 16 }
                      : { marginRight: 16 }
                  }
                >
                  <Image
                    source={{ uri: item.avatar }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 100,
                      marginBottom: 32,
                    }}
                  />
                </View>
                <View
                  style={
                    autorPostId === item.autorCommentId
                      ? { ...styles.commentBox, borderTopRightRadius: 0 }
                      : { ...styles.commentBox, borderTopLeftRadius: 0 }
                  }
                >
                  <Text
                    style={{
                      marginBottom: 8,
                      fontFamily: "Roboto-Regular",
                      fontStyle: "normal",
                      fontSize: 13,
                      lineHeight: 18,
                    }}
                  >
                    {item.comment}
                  </Text>
                  <View>
                    <Text
                      style={{
                        fontFamily: "Roboto-Regular",
                        fontStyle: "normal",
                        fontSize: 10,
                        lineHeight: 12,
                        color: "#BDBDBD",

                        marginLeft: "auto",
                      }}
                    >
                      {item.date}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      <KeyboardAvoidingView 
        behavior={Platform.OS == "ios" ? "padding" : null} 
        keyboardVerticalOffset={100}
        style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}
      >
        <View style={{ marginBottom: 16 }}>
          <TextInput
            style={styles.lastInput}
            placeholder="Leave a comment..."
            placeholderTextColor="#BDBDBD"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendComment}>
            <Feather name="arrow-up" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 32,
  },

  commentArrea: { flexDirection: "row" },
  commentArreaReverse: { flexDirection: "row-reverse" },
  commentLogin: {
    marginRight: 16,
  },
  commentBox: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    marginBottom: 24,
    borderRadius: 6,
  },

  lastInput: {
    paddingRight: 60,
    position: "relative",

    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: " #BDBDBD",
    borderWidth: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderStyle: "solid",
    paddingLeft: 16,
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
   
  },
  sendBtn: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FF6C00",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
  },
});