import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Custom Component
import { Colors } from "../Components/Styles/Colors";
import { createTextStyles } from '../Components/Styles/TextStyles';
import useStore from '../Src/ZustandStore';
import { useProfileStore } from "../Src/ZustandStore";
import { uploadImage } from "../Firebase/Realtime_DataBase/imageuploader";

// Images
import DefaultProfilePicture from "../assets/Images/upload.png";

// Dimensions
const { width, height } = Dimensions.get('window');

const NewUserWelcomeScreen = ({ route }) => {

  // Styles
  const { darkTheme } = useStore();
  const TextStyles = createTextStyles(darkTheme);

  const { userID } = route.params;
  const [error, setError] = useState("");
  // To Later Use
  const { profilePicture } = useProfileStore();

  // Check Status
  const profilepicStatus = !!profilePicture;

  // Clear Profile Picture
  const navigation = useNavigation();

  // Hanlde Navigate
  const handleNavigate = () => {
    try {
      if (profilepicStatus) {
        navigation.replace('TabStack');
      } else {
        setError('Navigation Failed');
      }
    } catch (error) {
      console.log("Error in uploading image:", error.message);
      alert("Please Select a Image First.");
      setError(error.message);
    }
  };

  // Local state to handle loading indicator
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Set a timer to hide the loading indicator after 1 second
    const timer = setTimeout(() => setIsLoading(false), 500);

    // Clean up timer if the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

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
      </View>
      {/* Profile Picture */}
      <View style={Styles.secondCont}>
        {/* Text */}
        <View style={{ paddingBottom: hp(2.56) }}>
          <Text style={TextStyles.regular20grayscale800}>Please Select a Profile Picture</Text>
        </View>
        {/* Profile Picture Uploader & View */}
        <View style={Styles.LogoCover}>
          {/* Image Tap to Open in Full View */}
          <TouchableOpacity onPress={() => uploadImage(userID)}>
            {(isLoading) ? (
              <ActivityIndicator size="large" color="#5B5B5B" />
            ) : (
              <Image
                source={profilePicture ? { uri: `data:image/jpeg;base64,${profilePicture}` } : DefaultProfilePicture}
                style={Styles.logo}
              />
            )}
          </TouchableOpacity>
        </View>
        {/* Continue Button */}
        <View style={Styles.continueButton}>
          <TouchableOpacity onPress={handleNavigate} activeOpacity={0.5}>
            <Text style={TextStyles.regular18redD3w500}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Second Linear Component */}
      <View style={Styles.ThirdCont}>
        {/* Gradient Background */}
        <LinearGradient
          colors={['#DC143C', '#DC143C', '#A80F2A', '#8B0000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        />
        {/* SVG Wave at the Top */}
        <View style={Styles.SecsvgContainer}>
          <Svg
            height="100%"
            width="100%"
            viewBox="0 75 1440 420"
          >
            <Path
              fill={Colors.WhiteF4}
              d="M0,96L48,101.3C96,106,192,117,288,133.3C384,149,480,171,576,181.3C672,192,768,192,864,165.3C960,139,1056,85,1152,74.7C1248,64,1344,96,1392,112L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            />
          </Svg>
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
    flex: 1,
  },
  svgContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.2,
  },
  secondCont: {
    height: hp(48.7),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  LogoCover: {
    backgroundColor: Colors.Grayscale400,
    width:  hp(33.3),
    height:  hp(33.3),
    borderRadius:  hp(16.7),
    justifyContent: "center",
    alignItems: "center",
    elevation: hp(2.56)
  },
  logo: {
    width: hp(32.05),
    height: hp(32.05),
    borderRadius: hp(16)
  },
  ThirdCont: {
    flex: 1,
    backgroundColor: Colors.WhiteF4,
  },
  SecsvgContainer: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height * 0.2,
  },
  continueButton: {
    paddingTop: hp(1.9)
  }
});

export default NewUserWelcomeScreen;
