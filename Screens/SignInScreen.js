import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  ActivityIndicator
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { ref, get } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BackHandler } from 'react-native';

// Firebase & Authentication
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../Firebase/firebaseConfig';
import { findUserDataByEmail } from "../Firebase/FireStore/firestoreQueries";

// Custom Components
import { Colors } from "../Components/Styles/Colors";
import { TextFieldStyles, createTextStyles } from '../Components/Styles/TextStyles';
import useStore from '../Src/ZustandStore';
import { useProfileStore } from "../Src/ZustandStore";
import Button01 from "../Components/Button/Button01";

// Images
import LogoHeart from "../assets/Logos/heart2.png"

// SVGs
import FacebookIcon from "../assets/SVG/fbicon.svg";
import GoogleIcon from "../assets/SVG/googleicon.svg";
import VisibleIcon from "../assets/SVG/visible.svg";
import InvisibleIcon from "../assets/SVG/invisible.svg";

// Dimensions
const { width, height } = Dimensions.get('window');

const SignInScreen = () => {

  // Styles
  const { darkTheme } = useStore();
  const TextStyles = createTextStyles(darkTheme);

  // Data Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [EmailIsTyping, setEmailIsTyping] = useState(false);
  const [PasswordTyping, setPasswordIsTyping] = useState(false);

  const [PasswordIsVisible, setPasswordIsVisible] = useState(false);
  const [error, setError] = useState('');

  const handleEmailTyping = (text) => {
    setEmail(text);
    setEmailIsTyping(text.length > 0);
  };

  const handlePasswordTyping = (text) => {
    setPassword(text);
    setPasswordIsTyping(text.length > 0);
  };

  const togglePasswordVisibility = () => {
    setPasswordIsVisible((prev) => !prev);
  };

  // Loading
  const [loading, setLoading] = useState(false);

  // Firebase Normal Authentication
  const handleSignIn = async () => {
    // console.log("Sign In button pressed");

    // Validate inputs
    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      // Attempt Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Fetch User Data
      const userData = await findUserDataByEmail(email);
      if (!userData || !userData.userID || !userData.fullName) {
        throw new Error("User data incomplete or not found.");
      }

      const { userID, fullName, firstName, lastName, useremail, userpassword, userName } = userData;

      // Get Zustand store actions
      const userStoreActions = useStore.getState();

      // Update Zustand with user data
      userStoreActions.setUserName(userName);
      userStoreActions.setUserID(userID);
      userStoreActions.setFullName(fullName);
      userStoreActions.setFirstName(firstName);
      userStoreActions.setLastName(lastName);
      userStoreActions.setUserEmail(useremail);
      userStoreActions.setUserPassword(userpassword);
      userStoreActions.setUserLogged(true);

      // Fetch and store profile picture in Zustand
      const setProfilePicture = useProfileStore.getState().setProfilePicture;
      try {
        const imageRef = ref(database, `${userID}/profilePicture`);
        const snapshot = await get(imageRef);

        if (snapshot.exists()) {
          const imageBase64 = snapshot.val();
          setProfilePicture(imageBase64);
          // console.log("Profile picture loaded and stored in Zustand.");
        } else {
          // console.log("No profile picture found in Firebase.");
          setProfilePicture(null);
        }
      } catch (imageError) {
        console.error("Error fetching profile picture:", imageError.message);
        setProfilePicture(null);
      }

      // Navigate to Welcome screen
      navigation.replace('Welcome', { userID, fullName });
    } catch (error) {
      console.error("Error in sign-in process:", error.message);
      alert(error.message.includes("auth/") ? "Invalid email or password." : error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Screen Navigation
  const handleNavForgotPass = () => {
    navigation.navigate('ForgotPass');
  };

  // Reset All When Focused
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      setEmail("");
      setPassword("");

      return () => {
        // Optional cleanup here if needed
      };
    }, [navigation])
  );

  // BackButton Exit
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      // Cleanup on unfocus
      return () => {
        backHandler.remove();
      };
    }, [])
  );

  return (
    <View style={Styles.MainCont}>
      <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />
      {/* Linear Component */}
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#8B0000', '#A80F2A', '#DC143C', '#DC143C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={Styles.gradientBox}
        />
        {/* SVG Wave at the Bottom */}
        <View style={Styles.svgContainer}>
          <Svg
            height="100%"
            width="100%"
            viewBox="0 0 1440 1"
          >
            <Path
              fill={Colors.WhiteF4}
              d="M0,224L48,218.7C96,213,192,203,288,186.7C384,171,480,149,576,138.7C672,128,768,128,864,154.7C960,181,1056,235,1152,245.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </Svg>
        </View>
        {/* Logo */}
        <View style={Styles.LogoCont}>
          <Image
            source={LogoHeart}
            style={Styles.logo}
          />
        </View>
      </View>
      {/* Other Components Will Write In This View Component */}
      <View style={Styles.SecondCont}>
        {/* Sign In Text */}
        <View style={Styles.SignInTextCont}>
          <Text style={TextStyles.bold28grayscale900}>Sign In</Text>
        </View>
        {/* TextInputs */}
        {/* Email input*/}
        <View style={{ paddingTop: hp(4.1) }} />
        <View style={TextFieldStyles.TFContainer}>
          <View style={TextFieldStyles.TextContainer}>
            <View style={TextFieldStyles.TextInputCont}>
              <TextInput
                style={[TextFieldStyles.NormalText, EmailIsTyping && TextFieldStyles.boldText]}
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                  const filteredText = text.replace(/[ ,:*]/g, '');
                  handleEmailTyping(filteredText);
                }}
              />
            </View>
          </View>
        </View>
        {/* Password input*/}
        <View style={{ paddingTop: hp(2.05) }} />
        <View style={TextFieldStyles.TFContainer}>
          <View style={[TextFieldStyles.TextContainer, { flexDirection: "row" }]}>
            <View style={TextFieldStyles.TextInputCont}>
              <TextInput
                style={[TextFieldStyles.NormalText, PasswordTyping && TextFieldStyles.boldText]}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  const filteredText = text.replace(/[ ,:*]/g, '');
                  handlePasswordTyping(filteredText);
                }}
                secureTextEntry={!PasswordIsVisible}
              />
            </View>
            {/* Password Visible Icon */}
            <View style={{ justifyContent: "center", paddingRight: hp(2.05) }}>
              <View style={{ height: hp(2.6), width: hp(2.6) }}>
                {PasswordTyping && (
                  <Pressable onPress={togglePasswordVisibility}>
                    {PasswordIsVisible ? (
                      <InvisibleIcon width={hp(2.6)} height={hp(2.6)} />
                    ) : (
                      <VisibleIcon width={hp(2.6)} height={hp(2.6)} />
                    )}
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>
        {/* Forgot You Password */}
        <View style={Styles.ForgotPassCont}>
          <TouchableOpacity 
            onPress={handleNavForgotPass}
            activeOpacity={0.5}
          >
            <Text style={TextStyles.regular14grayscale800}>Forgot Your Password?</Text>
          </TouchableOpacity>
        </View>
        {/* Button */}
        <View style={{ paddingHorizontal: hp(3.8), paddingTop: hp(3.2), paddingBottom: hp(4.1) }}>
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator size={hp(5.9)} color="#DC143C" />
            ) : (
              <Button01 text="Sign In" email={email} password={password} onPress={handleSignIn} />
            )}
          </TouchableOpacity>
        </View>
        {/* TEXT - or component */}
        <View style={Styles.OrCont}>
          <View style={Styles.grayLine} />
          <Text style={[TextStyles.regular14grayscale800, { paddingHorizontal: hp(1) }]}>Or</Text>
          <View style={Styles.grayLine} />
        </View>
        {/* Other Sign In Methods */}
        <View style={{ justifyContent: "center", flexDirection: "row", paddingTop: hp(1.8), paddingBottom: hp(4.1) }}>
          {/* Google Sign In */}
          <TouchableOpacity
            activeOpacity={0.7}
          >
            <View style={Styles.IconCont}>
              <GoogleIcon width={hp(3.2)} height={hp(3.2)} />
            </View>
          </TouchableOpacity>
          <View style={{ paddingLeft: hp(1.5) }} />
          {/* Facebook Sign In */}
          <TouchableOpacity
            activeOpacity={0.7}
          >
            <View style={Styles.IconCont}>
              <FacebookIcon width={hp(3.8)} height={hp(3.8)} />
            </View>
          </TouchableOpacity>
        </View>
        {/* SignUp Component */}
        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
          <Text style={TextStyles.regular14grayscale800}>Don’t have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.8}
          >
            <Text style={TextStyles.regular14redD3w500}>Sign Up Now!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  MainCont: {
    flex: 1,
    backgroundColor: Colors.WhiteF4
  },
  gradientBox: {
    flex: 1
  },
  SecondCont: {
    flex: 2,
    backgroundColor: Colors.WhiteF4,
  },
  svgContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.2,
  },
  LogoCont: {
    position: "absolute",
    backgroundColor: Colors.AdditionalWhite,
    borderRadius: hp(9.6),
    width: hp(19.2),
    height: hp(19.2),
    bottom: 0,
    left: "50%",
    transform: [{ translateX: hp(-9.6) }],
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: hp(19.2),
    height: hp(19.2),
  },
  SignInTextCont: {
    alignItems: "center",
    paddingTop: hp(1.3)
  },
  ForgotPassCont: {
    flexDirection: "row-reverse",
    paddingRight: hp(3.8),
    paddingTop: hp(0.8)
  },
  OrCont: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: hp(5.4)
  },
  grayLine: {
    height: 1,
    backgroundColor: Colors.Grayscale800,
    flex: 1
  },
  IconCont: {
    width: hp(5.4),
    height: hp(5.4),
    backgroundColor: Colors.AdditionalWhite,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hp(1)
  }
});

export default SignInScreen;