import "react-native-gesture-handler"; 
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { DefaultScreenPosts } from "./nestedScreens/DefaultScreenPosts";
import { CommentsScreen } from "./nestedScreens/CommentsScreen";
import { MapScreen } from "./nestedScreens/MapScreen";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { authSignOutUser } from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";

const NestedStack = createStackNavigator();

export const PostsScreen = () => {
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(authSignOutUser());
  };
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen
        options={{
          headerTitle: "Posts",
          headerTitleAlign: "center",
          headerRight: (focused, size, color) => (
            <TouchableOpacity style={{ marginRight: 10 }} onPress={signOut}>
              <Feather
                name="log-out"
                size={24}
                color="rgba(189, 189, 189, 1)"
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#FFFFFF",
            height: 88,
            shadowColor: "rgba(0, 0, 0, 0.3)",
            shadowOffset: { width: 0, height: 0.5 },
            shadowRadius: 1.35914,
          },
          headerTitleStyle: {
            fontSize: 17,

            fontFamily: "Roboto-Medium",
            fontStyle: "normal",
            lineHeight: 22,
          },
          headerTintColor: "#212121",
        }}
        name="DefaultScreenPosts"
        component={DefaultScreenPosts}
      />
      <NestedStack.Screen name="Comments" component={CommentsScreen} />
      <NestedStack.Screen name="Map" component={MapScreen} />
    </NestedStack.Navigator>
  );
};