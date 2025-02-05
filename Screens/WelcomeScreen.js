import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Component
import { Colors } from "../Components/Styles/Colors";
import useStore from '../Src/ZustandStore';
import { createTextStyles } from '../Components/Styles/TextStyles';
import { useProfileStore } from "../Src/ZustandStore";
import { useProfilePictureListener } from "../Firebase/Realtime_DataBase/ProfilePictureListener";
import CustomButton from "../Components/Button/WelcomeScreen/Button01";
import ImageViewModal from '../Components/ImageViewer/imageview';

// Images
import DefaultPicture from "../assets/Images/noimage5.png";

// Dimensions
const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ route, navigation }) => {

  // Styles
  const { darkTheme } = useStore();
  const TextStyles = createTextStyles(darkTheme);

  const { userID, fullName } = route.params;
  useProfilePictureListener(userID);
  const profilePicture = useProfileStore((state) => state.profilePicture);
  const [isImageViewVisible, setImageViewVisible] = useState(false);

  // Hanlde Navigate
  const handleNavigate = () => {
    navigation.replace('TabStack');
  };

  return (
    <View style={Styles.MainCont}>
      <StatusBar
        translucent={true}
        backgroundColor={isImageViewVisible ? '#1C1C1C' : 'transparent'}
        barStyle={'light-content'} />
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#8B0000', '#A80F2A', '#DC143C', '#DC143C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1, backgroundColor: 'blue' }}
        />
        <View style={Styles.svgContainer}>
          <Svg height="100%" width="100%" viewBox="0 0 1440 1">
            <Path
              fill={Colors.WhiteF4}
              d="M0,224L48,218.7C96,213,192,203,288,186.7C384,171,480,149,576,138.7C672,128,768,128,864,154.7C960,181,1056,235,1152,245.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </Svg>
        </View>
        {/* Profile Picture */}
        <View style={Styles.LogoCont}>
          <View style={Styles.LogoCover}>
            {/* Image Tap to Open in Full View */}
            <TouchableOpacity onPress={() => setImageViewVisible(true)}>
              <Image
                source={profilePicture ? { uri: `data:image/jpeg;base64,${profilePicture}` } : DefaultPicture}
                style={Styles.logo}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Second Container */}
      <View style={Styles.SecondCont}>
        {/* Welcome Text */}
        <View style={Styles.welcomeTextCont}>
          <Text
            style={[
              TextStyles.regular20grayscale800, {
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2
              }]
            }>Welcome Back,</Text>
          <Text style={[
            TextStyles.bold32grayscale900w900, {
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2
            }]
          }>{fullName}</Text>
        </View>
        {/* Continue Button */}
        <View style={Styles.continueButton}>
          <TouchableOpacity onPress={handleNavigate} activeOpacity={0.5}>
            <CustomButton text={"Continue"} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Modal to View Image Full-Screen */}
      <ImageViewModal
        isImageViewVisible={isImageViewVisible}
        setImageViewVisible={setImageViewVisible}
        profilePicture={profilePicture}
        DefaultPicture={DefaultPicture}
      />
    </View>
  );
};

const Styles = StyleSheet.create({
  MainCont: {
    flex: 1,
    backgroundColor: Colors.WhiteF4
  },
  gradientBox: {
    flex: 1,
  },
  SecondCont: {
    flex: 0.4,
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
    borderRadius: hp(12.8),
    width:  hp(25.6),
    height:  hp(25.6),
    bottom: 0,
    left: "50%",
    transform: [{ translateX: hp(-12.8) }],
    alignItems: "center",
    justifyContent: "center",
  },
  LogoCover: {
    width: hp(25.6),
    height:  hp(25.6),
    borderRadius:  hp(12.8),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.WhiteF4
  },
  logo: {
    width: hp(24.4),
    height: hp(24.4),
    borderRadius: hp(12.2)
  },
  welcomeTextCont: {
    paddingTop: hp(4.1),
    paddingLeft: hp(3.8)
  },
  continueButton: {
    paddingHorizontal: hp(3.8),
    paddingBottom: hp(4.1),
    width: width,
    position: "absolute",
    bottom: 0
  }
});

export default WelcomeScreen;
