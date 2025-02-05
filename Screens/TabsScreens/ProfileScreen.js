import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
  SafeAreaView
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import useStore from '../../Src/ZustandStore';
import { useProfileStore } from "../../Src/ZustandStore";
import { Colors } from "../../Components/Styles/Colors";
import { createTextStyles } from '../../Components/Styles/TextStyles';
import { useProfilePictureListener } from "../../Firebase/Realtime_DataBase/ProfilePictureListener";
import { uploadImage } from "../../Firebase/Realtime_DataBase/imageuploader";
import ImageViewModal from '../../Components/ImageViewer/imageview';
import Card from "../../Components/ProfileScreenCard/card";
import UserNameUpdater from '../../Components/ProfileScreenCard/nameUpdateModal';
import PasswordUpdater from "../../Components/ProfileScreenCard/PasswordUpdater";

// FireBase
import { dataUpdater } from '../../Firebase/FireStore/firestoreServices';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

// Images
import DefaultPicture from "../../assets/Images/noimage5.png";

// SVG
import UserIcon from "../../assets/SVG/ProfileScreen/user1.svg";
import EditIcon from "../../assets/SVG/ProfileScreen/edit2.svg";
import EmailIcon from "../../assets/SVG/ProfileScreen/email.svg";
import LockIcon from "../../assets/SVG/ProfileScreen/lock2.svg";
import DarkIcon from "../../assets/SVG/ProfileScreen/dark.svg";
import LightIcon from "../../assets/SVG/ProfileScreen/light.svg";
import DarkUserIcon from "../../assets/SVG/ProfileScreen/darkuser.svg";
import DarkEditIcon from "../../assets/SVG/ProfileScreen/darkedit.svg";
import DarkEmailIcon from "../../assets/SVG/ProfileScreen/darkemail.svg";
import DarkLockIcon from "../../assets/SVG/ProfileScreen/darklock.svg";

// Dimensions
const { width } = Dimensions.get('window');

const ProfileScreen = () => {

  // Navigation
  const navigation = useNavigation();

  // Zustand Consts
  const {
    loadUserID,
    userID,
    loadFullName,
    fullName,
    setFullName,
    userEmail,
    loadUserEmail,
    userPassword,
    setUserPassword,
    loadUserPassword,
    darkTheme,
    loadDarkTheme,
    setDarkTheme
  } = useStore();

  // Profile Picture
  const profilePicture = useProfileStore((state) => state.profilePicture);
  useProfilePictureListener(userID);

  // userID Loader & Full Name
  useEffect(() => {
    loadUserID();
    loadFullName();
    loadUserEmail();
    loadUserPassword();
    loadDarkTheme();
  }, [loadUserID, loadFullName, loadUserEmail, loadUserPassword, loadDarkTheme]);

  // Logout Function
  const logoutRef = useRef(useStore.getState().auth.logout);

  const handleLogout = async () => {
    try {
      // Use stable reference to logout
      await logoutRef.current();
      const { clearProfilePicture } = useProfileStore.getState();
      clearProfilePicture();
      navigation.replace('Loading');
    } catch (error) {
      console.error("Error during logout:", error.message);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  // Modals Visibilities
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [isNameModalVisible, setNameModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);

  // User Name Modal Visibility
  const handleOpenNameModal = () => {
    setNameModalVisible(true);
  };
  const handleCloseNameModal = () => {
    setNameModalVisible(false);
  };

  // User Name Modal Visibility
  const handleOpenPasswordModal = () => {
    setPasswordModalVisible(true);
  };
  const handleClosePasswordModal = () => {
    setPasswordModalVisible(false);
  };

  // FullName Function
  const getFullName = (firstName, lastName) => {
    const cleanedFirstName = firstName.trim();
    const cleanedLastName = lastName.trim();
    return `${cleanedFirstName} ${cleanedLastName}`;
  };

  // Password
  const maskPassword = (password) => {
    return password ? '*'.repeat(password.length) : '';
  };

  // Handle FullName Updater
  const handleSaveName = async (firstName, lastName) => {
    if (firstName && lastName) {
      // Prepare the fields to update
      const trimmedFullName = getFullName(firstName, lastName);
      const updatedFields = {
        FirstName: firstName,
        LastName: lastName,
        FullName: trimmedFullName,
      };
      setFullName(trimmedFullName);

      try {
        await dataUpdater(updatedFields);
      } catch (error) {
        Alert.alert("Error", "Failed to update the name. Please try again.");
      }
    } else {
      Alert.alert("Invalid Input", "Please fill in both first and last names.");
    }
  };

  // Handle Password Updater
  const handleSavePassword = async (newPassword, currentPass) => {
    if (newPassword && currentPass) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        // Ensure the user is signed in
        if (!user || !user.email) {
          console.error("No user is signed in.");
          Alert.alert("Error", "Please sign in again.");
          return;
        }

        // Create the credential for reauthentication
        const credential = EmailAuthProvider.credential(user.email, currentPass);

        // Reauthenticate with the provided credential
        await reauthenticateWithCredential(user, credential);

        // Update the user's password
        await updatePassword(user, newPassword);

        // Update the password in your database
        const updatedField = { Password: newPassword };
        await dataUpdater(updatedField);
        setUserPassword(newPassword);

      } catch (error) {
        console.error("Failed to update password:", error);

        if (error.code === 'auth/wrong-password') {
          Alert.alert("Reauthentication Failed", "The current password is incorrect.");
        } else if (error.code === 'auth/requires-recent-login') {
          Alert.alert("Error", "Please log in again to change your password.");
        } else {
          Alert.alert("Error", "An unexpected error occurred. Please try again.");
        }
      }
    } else {
      Alert.alert("Invalid Input", "Please fill in the current and new password.");
    }
  };

  // Theme
  const handleTheme = () => {
    const newTheme = !darkTheme;
    setDarkTheme(newTheme);
  };

  // Styles
  const TextStyles = createTextStyles(darkTheme);
  const Styles = createStyles(darkTheme);

  // StatusBar Color
  const statusBarColor = darkTheme ? "#FFFFFF" : Colors.AdditionalBlack
  const statusBarColorImageModal = isImageViewVisible ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)';
  const statusBarContColor = !darkTheme;

  return (
    <SafeAreaView style={Styles.MainCont}>
      <StatusBar
        translucent={true}
        backgroundColor={isImageViewVisible || isNameModalVisible || isPasswordModalVisible ? statusBarColorImageModal : statusBarColor}
        barStyle={isImageViewVisible || isNameModalVisible || isPasswordModalVisible || statusBarContColor ? 'light-content' : 'dark-content'}
      />
      {/* Profile Picture */}
      <View style={Styles.ContPadding}>
        <View style={Styles.ImageCont}>
          {/* Image */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => setImageViewVisible(true)}>
            <View style={Styles.ImgShadow}>
              <Image
                source={profilePicture ? { uri: `data:image/jpeg;base64,${profilePicture}` } : DefaultPicture}
                style={Styles.image}
              />
            </View>
          </TouchableOpacity>
          {/* Edit Icon */}
          <TouchableOpacity
            style={Styles.imageEditIcon}
            activeOpacity={0.6}
            onPress={() => uploadImage(userID)}
          >
            {darkTheme ? <EditIcon width={hp(3.8)} height={hp(3.8)} /> : <DarkEditIcon width={hp(3.8)} height={hp(3.8)} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Spacing */}
      <View style={{ paddingBottom: hp(1) }} />

      {/* Email */}
      <Card
        label="Email"
        value={userEmail}
        iconLeft={darkTheme ? EmailIcon : DarkEmailIcon}
        iconLeftWidth={hp(3.1)}
        iconLeftHeight={hp(3.1)}
      />
      {/* UserName */}
      <Card
        label="Name"
        value={fullName}
        iconLeft={darkTheme ? UserIcon : DarkUserIcon}
        iconRight={darkTheme ? EditIcon : DarkEditIcon}
        iconLeftWidth={hp(3.1)}
        iconLeftHeight={hp(3.1)}
        iconRightWidth={hp(3.8)}
        iconRightHeight={hp(3.8)}
        onPress={handleOpenNameModal}
      />
      {/* Password */}
      <Card
        label="Password"
        value={maskPassword(userPassword)}
        iconLeft={darkTheme ? LockIcon : DarkLockIcon}
        iconRight={darkTheme ? EditIcon : DarkEditIcon}
        iconLeftWidth={hp(3.3)}
        iconLeftHeight={hp(3.3)}
        iconRightWidth={hp(3.8)}
        iconRightHeight={hp(3.8)}
        iconRightPadding={hp(0.25)}
        CustomFontWeight="900"
        onPress={handleOpenPasswordModal}
      />

      {/* Theme Changer */}
      <View style={[Styles.ThemeChangePadding, { paddingTop: hp(2.05) }]}>
        <TouchableOpacity
          onPress={handleTheme}
          activeOpacity={0.7}
          style={Styles.ThemeChangeCont}
        >
          {/* Icon */}
          {darkTheme ? (
            <View style={{ paddingLeft: hp(1.5), paddingRight: hp(0.5) }}>
              <DarkIcon width={hp(3.1)} height={hp(3.1)} />
            </View>
          ) : (
            <View style={{ paddingLeft: hp(1.5), paddingRight: hp(0.5) }}>
              <LightIcon width={hp(3.1)} height={hp(3.1)} />
            </View>
          )}

          {/* Text */}
          <Text style={[TextStyles.regular14grayscale700, { alignSelf: "center", paddingLeft: hp(1), }]}>
            Change Theme
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={{ flexGrow: 1 }} />
      <View style={[Styles.ContPadding, { paddingBottom: hp(2) }]}>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={Styles.logoutButton}>
            <Text style={TextStyles.regular16Red3W700}>LOGOUT</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      {/* Modal to View Image Full-Screen */}
      <ImageViewModal
        isImageViewVisible={isImageViewVisible}
        setImageViewVisible={setImageViewVisible}
        profilePicture={profilePicture}
        DefaultPicture={DefaultPicture}
      />
      {/* Modal to Edit User Name */}
      <UserNameUpdater
        visible={isNameModalVisible}
        onClose={handleCloseNameModal}
        onSave={handleSaveName}
      />
      {/* Modal to Edit User Password */}
      <PasswordUpdater
        visible={isPasswordModalVisible}
        onClose={handleClosePasswordModal}
        onSave={handleSavePassword}
      />
    </SafeAreaView>
  );
};

const createStyles = (darkTheme) => StyleSheet.create({
  MainCont: {
    flex: 1,
    backgroundColor: darkTheme ? Colors.AdditionalWhite : Colors.AdditionalBlack,
  },
  ContPadding: {
    paddingTop: hp(2.05),
    paddingHorizontal: hp(2.05)
  },
  contentCont: {
    backgroundColor: darkTheme ? Colors.AdditionalWhite : Colors.AdditionalBlack,
    borderRadius: hp(0.8),
    elevation: 5,
  },
  ImageCont: {
    backgroundColor: darkTheme ? Colors.Grayscale50 : Colors.Grayscale900,
    height: hp(28.2),
    borderRadius: hp(0.8),
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  image: {
    width: hp(20),
    height: hp(20),
    borderRadius: hp(10)
  },
  ImgShadow: {
    width: hp(20),
    height: hp(20),
    borderRadius: hp(10),
    elevation: width > 375 ? 15 : 5
  },
  logoutButton: {
    backgroundColor:darkTheme ? Colors.Grayscale100 : Colors.Grayscale900,
    height: hp(5.1),
    borderRadius: hp(0.8),
    justifyContent: "center",
    alignItems: "center",
    elevation: 2
  },
  imageEditIcon: {
    position: "absolute",
    right: hp(2.6),
    bottom: hp(2.6),
  },
  ThemeChangePadding: {
    paddingTop: hp(2.05),
    paddingHorizontal: hp(2.05),
  },
  ThemeChangeCont: {
    backgroundColor: darkTheme ? Colors.Grayscale50 : Colors.Grayscale900,
    paddingTop: hp(2.05),
    paddingBottom: hp(2.05),
    borderRadius: 6,
    elevation: 2,
    flexDirection: "row"
  }
});

export default ProfileScreen;