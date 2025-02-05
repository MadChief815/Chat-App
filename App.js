import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Stack Screens
import LoadingScreen from './Screens/LoadingScreen';
import SignInScreen from './Screens/SignInScreen';
import ForgotPassScreen from './Screens/ForgotPassScreen';
import SignUpScreen from './Screens/SignUpScreen';
import WelcomeScreen from './Screens/WelcomeScreen';
import NewUserWelcomeScreen from './Screens/NewUserWelcomeScreen';
import ChatRoomScreen from './Screens/ChatRoomScreen';

// Tab Screens
import ChatsScreen from './Screens/TabsScreens/ChatsScreen';
import ProfileScreen from "./Screens/TabsScreens/ProfileScreen";

// useStore
import useStore from './Src/ZustandStore';

// Custom Components
import { Colors } from "./Components/Styles/Colors";

// SVG for Drawer Icon
import FocuseChatIcon from "./assets/SVG/newIcons/icon1.svg";
import FocuseProfileIcon from "./assets/SVG/newIcons/blackprofile.svg";
import ProfileIcon from "./assets/SVG/newIcons/profile.svg";
import ChatIcon from "./assets/SVG/newIcons/blackicon1.svg";
import DarkProfileIcon from "./assets/SVG/newIcons/darkprofile.svg";
import DarkChatIcon from "./assets/SVG/newIcons/darkchat.svg";

// Images
import LogoIcon from "./assets/heart1.png"

// Dimensions
const { width } = Dimensions.get('window');

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigation
function TabNavigation() {

  // Theme
  const { darkTheme } = useStore();
  const Styles = createStyles(darkTheme);

  return (
    <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        tabBarInactiveTintColor: Colors.Grayscale500,
        tabBarStyle: {
          backgroundColor: darkTheme ? Colors.AdditionalWhite : Colors.AdditionalBlack,
          height: hp(7.05),
          borderColor: darkTheme ? Colors.AdditionalWhite : Colors.AdditionalBlack,
        },
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: width > 375 ? 13 : 11,
                color: darkTheme
                  ? focused
                    ? Colors.RedD2
                    : Colors.Grayscale800
                  : focused
                    ? Colors.RedD2
                    : Colors.Grayscale600,
                fontWeight: "700",
              }}
            >
              Chats
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            darkTheme ? (
              focused ? (
                <FocuseChatIcon width={width > 375 ? 30 : 25} height={width > 375 ? 30 : 25} />
              ) : (
                <ChatIcon width={width > 375 ? 30 : 25} height={width > 375 ? 30 : 25} />
              )
            ) : (
              focused ? (
                <FocuseChatIcon width={width > 375 ? 30 : 25} height={width > 375 ? 30 : 25} />
              ) : (
                <DarkChatIcon width={width > 375 ? 30 : 25} height={width > 375 ? 30 : 25} />
              )
            )
          ),
          headerTitle: 'Massages',
          headerTitleStyle: {
            color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale100,
            fontSize: width > 375 ? 22 : 18,
            fontWeight: '700',
          },
          headerStyle: {
            backgroundColor: darkTheme ? Colors.AdditionalWhite : Colors.AdditionalBlack,
            height: width > 375 ? 90 : 60,
            shadowColor: 'transparent',
            elevation: 0
          },
          headerLeft: () => (
            <View style={Styles.headerLogo}>
              <View style={Styles.headerImage}>
                <Image
                  source={LogoIcon}
                  style={{ width: width > 375 ? 35 : 25, height: width > 375 ? 41 : 31 }}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: width > 375 ? 13 : 11,
                color: darkTheme
                  ? focused
                    ? Colors.RedD2
                    : Colors.Grayscale800
                  : focused
                    ? Colors.RedD2
                    : Colors.Grayscale600,
                fontWeight: "700",
              }}
            >
              Profile
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            darkTheme ? (
              focused ? (
                <FocuseProfileIcon width={width > 375 ? 26 : 21} height={width > 375 ? 26 : 21} />
              ) : (
                <ProfileIcon width={width > 375 ? 26 : 21} height={width > 375 ? 26 : 21} />
              )
            ) : (
              focused ? (
                <FocuseProfileIcon width={width > 375 ? 26 : 21} height={width > 375 ? 26 : 21} />
              ) : (
                <DarkProfileIcon width={width > 375 ? 26 : 21} height={width > 375 ? 26 : 21} />
              )
            )
          ),
          headerTitle: 'Profile',
          headerTitleStyle: {
            color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale100,
            fontSize: width > 375 ? 22 : 18,
            fontWeight: '800',
          },
          headerStyle: {
            backgroundColor: darkTheme ? Colors.AdditionalWhite : Colors.AdditionalBlack,
            height: width > 375 ? 90 : 60,
            shadowColor: 'transparent',
            elevation: 0
          },
          headerLeft: () => (
            <View style={Styles.headerLogo}>
              <View style={Styles.headerImage}>
                <Image
                  source={LogoIcon}
                  style={{ width: width > 375 ? 35 : 25, height: width > 375 ? 41 : 31 }}
                />
              </View>
            </View>
          ),
        }}
      />
    </Tab.Navigator >
  );
}

// Root Stack Navigation
export default function App() {

  useEffect(() => {
    const unsubscribe = useStore.getState().auth.initializeAuth();
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth Stack Screens */}
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ animation: "fade_from_bottom" }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ animation: "fade_from_bottom" }} />
        <Stack.Screen name="ForgotPass" component={ForgotPassScreen} options={{ animation: "fade_from_bottom" }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="NewUserWelcome" component={NewUserWelcomeScreen} />
        <Stack.Screen name="UserProfile" component={ProfileScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ animation: "fade" }} />
        <Stack.Screen
          name="TabStack"
          component={TabNavigation}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const createStyles = (darkTheme) => StyleSheet.create({
  headerLogo: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: width > 375 ? 12 : 8,
    paddingRight: width > 375 ? 8 : 6
  },
  headerImage: {
    backgroundColor: darkTheme ? Colors.Grayscale200 : Colors.AdditionalBlack,
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: "center",
    alignItems: "center",
  }
});
