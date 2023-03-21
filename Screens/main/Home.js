import "react-native-gesture-handler"; 
import React from "react";
import { useDispatch } from "react-redux";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { PostsScreen } from "./PostsScreen";
import { CreatePostsScreen } from "./CreatePostsScreen";
import { ProfileScreen } from "./ProfileScreen";
import { Feather } from "@expo/vector-icons";
import { authSignOutUser } from "../../redux/auth/authOperations";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const MainTab = createBottomTabNavigator();

export const Home = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(33, 33, 33, 0.8)",
      })}
    >
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";

            if (routeName === "Comments" || routeName === "Map") {
              return { display: "none" };
            }
            return;
          })(route),

          headerShown: false,
          tabBarIcon: ({ focused, size, color }) => (
            <View
              style={
                focused
                  ? { ...styles.btnAddPost, backgroundColor: "#FF6C00" }
                  : styles.btnAddPost
              }
            >
              <Feather name="grid" size={24} color={color} />
            </View>
          ),
        })}
      />
      <MainTab.Screen
        name="Create Post"
        component={CreatePostsScreen}
        options={({ route }) => ({
          tabBarStyle: { display: "none" },
          tabBarButton: (props) => <TouchableOpacity {...props} />,
          tabBarIcon: ({ focused, size, color }) => {
            return (
              <View
                style={
                  focused
                    ? { ...styles.btnAddPost, backgroundColor: "#FF6C00" }
                    : styles.btnAddPost
                }
              >
                <Feather name="plus" size={24} color={color} />
              </View>
            );
          },
          headerTitle: "Create Post",
          headerTitleAlign: "center",
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
          
          headerLeft: (focused, size, color) => (
            <TouchableOpacity
              style={{ marginLeft: 16, width: 20, height: 20 }}
              onPress={() => navigation.navigate("DefaultScreenPosts")}
             
            >
              <Feather
                name="arrow-left"
                size={24}
                color="rgba(33, 33, 33, 0.8)"
              />
            </TouchableOpacity>
          ),
        })}
      />

      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarItemStyle: {
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 5,
          },
          headerShown: false,

          tabBarButton: (props) => <TouchableOpacity {...props} />,
          tabBarIcon: ({ focused, size, color }) => {
            return (
              <View
                style={
                  focused
                    ? { ...styles.btnAddPost, backgroundColor: "#FF6C00" }
                    : styles.btnAddPost
                }
              >
                <Feather
                  name="user"
                  size={24}
                  color={color}
                  focused={focused}
                />
              </View>
            );
          },
        }}
      />
    </MainTab.Navigator>
  );
};

const styles = StyleSheet.create({
  btnAddPost: {
    height: 40,
    width: 70,

    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
});