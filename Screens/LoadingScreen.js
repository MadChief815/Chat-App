import React, { useState } from 'react'
import {
    View,
    StyleSheet,
    StatusBar,
    Dimensions,
    Image,
    ActivityIndicator
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import useStore from '../Src/ZustandStore';
import { useProfileStore } from "../Src/ZustandStore";
import { useProfilePictureListener } from "../Firebase/Realtime_DataBase/ProfilePictureListener";
import { Colors } from "../Components/Styles/Colors";
import { findUserDataByEmail } from "../Firebase/FireStore/firestoreQueries";

// Images
import LogoHeart from "../assets/Logos/heart2.png"

// Dimensions
const { width, height } = Dimensions.get('window');

const LoadingScreen = () => {

    // Authentication Check
    const { loadUserLogged, loadUserEmail, loadDarkTheme } = useStore.getState();
    const [loading, setLoading] = useState(true);

    // Navigation
    const navigation = useNavigation();

    // Zustand Consts
    const { userID } = useStore();

    // Profile Picture Loader
    useProfilePictureListener(userID);
    const profilePicture = useProfileStore((state) => state.profilePicture);

    useFocusEffect(
        React.useCallback(() => {
            const checkUserLogged = async () => {
                try {
                    setLoading(true);

                    // Load necessary data
                    await loadUserLogged();
                    await loadUserEmail();
                    await loadDarkTheme();
                    const { userLogged, userEmail } = useStore.getState();

                    // Simulate a short delay for loading
                    await new Promise(resolve => setTimeout(resolve, 100));

                    if (userLogged && userEmail) {
                        // Fetch UserData
                        const userData = await findUserDataByEmail(userEmail);

                        // Check if userData Available
                        if (userData && userData.userID && userData.fullName) {
                            const { userID, fullName, useremail, userpassword, userName } = userData;

                            // Store the user data in the Zustand store
                            const {
                                setUserID,
                                setFullName,
                                setUserLogged,
                                setUserEmail,
                                setUserPassword,
                                setUserName,
                            } = useStore.getState();
                            setUserID(userID);
                            setFullName(fullName);
                            setUserEmail(useremail);
                            setUserPassword(userpassword);
                            setUserName(userName);
                            setUserLogged(true);

                            // Navigate to the next screen with the retrieved user data
                            navigation.replace('TabStack', { userID, fullName, userEmail, userpassword, profilePicture });
                        } else {
                            // console.log('User data not found in Firestore');
                            alert("User data retrieval failed. Please try again.");
                        }
                    } else {
                        // console.log('User is not logged in. Please log in.');
                        navigation.replace('SignIn');
                    }
                } catch (error) {
                    console.error('Error during user data retrieval:', error);
                    alert('An error occurred. Please try again later.');
                } finally {
                    setLoading(false);
                }
            };

            checkUserLogged();

            return () => {
                setLoading(false);
            };
        }, [navigation, setLoading, loadUserLogged, loadUserEmail])
    );

    return (
        <View style={Styles.MainCont}>
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'light-content'} />
            {/* Linear Component */}
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: Colors.WhiteF4 }}>
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
                            viewBox="0 0 1440 0.1"
                        >
                            <Path
                                fill={Colors.WhiteF4}
                                d="M0,224L48,218.7C96,213,192,203,288,186.7C384,171,480,149,576,138.7C672,128,768,128,864,154.7C960,181,1056,235,1152,245.3C1248,256,1344,224,1392,208L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                            />
                        </Svg>
                    </View>
                </View>
            </View>
            {/* Logo */}
            <View style={Styles.SecondCont}>
                <View style={Styles.LogoCont}>
                    <Image
                        source={LogoHeart}
                        style={Styles.logo}
                    />
                    {loading && (
                        <ActivityIndicator
                            size={hp(23.1)}
                            color="#A80F2A"
                            style={Styles.activityIndicator}
                        />
                    )}
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
        flex: 1
    },
    SecondCont: {
        flex: 1,
        backgroundColor: Colors.WhiteF4,
        justifyContent: "center",
        alignItems: "center",
    },
    ThirdCont: {
        flex: 1,
        backgroundColor: Colors.WhiteF4,
    },
    svgContainer: {
        position: 'absolute',
        bottom: 0,
        width: width,
        height: height * 0.2,
    },
    SecsvgContainer: {
        position: 'absolute',
        top: 0,
        width: width,
        height: height * 0.2,
    },
    LogoCont: {
        backgroundColor: Colors.AdditionalWhite,
        borderRadius: hp(9.6),
        width: hp(19.2),
        height: hp(19.2),
    },
    logo: {
        width: hp(19.2),
        height: hp(19.2),
    },
    activityIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingScreen;