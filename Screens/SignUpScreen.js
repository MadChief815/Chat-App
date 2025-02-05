import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Pressable,
    ActivityIndicator
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Firebase & Authentication
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { addNewUserData } from '../Firebase/FireStore/firestoreServices';
import { auth } from '../Firebase/firebaseConfig';
import { findUserDataByEmail } from "../Firebase/FireStore/firestoreQueries";

// Custom Components
import { Colors } from "../Components/Styles/Colors";
import { TextFieldStyles, createTextStyles } from '../Components/Styles/TextStyles';
import useStore from '../Src/ZustandStore';
import { userProfileStore } from "../Src/ZustandStore";
import Button01 from "../Components/Button/Button01";

// SVGs
import VisibleIcon from "../assets/SVG/visible.svg";
import InvisibleIcon from "../assets/SVG/invisible.svg";

// Dimensions
const { width, height } = Dimensions.get('window');

// Helper function to generate a random string
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const SignInScreen = ({ navigation }) => {

    // Styles
    const { darkTheme } = useStore();
    const TextStyles = createTextStyles(darkTheme);

    // Data Inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpass, setConfrimPass] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');

    const [EmailIsTyping, setEmailIsTyping] = useState(false);
    const [PasswordTyping, setPasswordIsTyping] = useState(false);
    const [ConfirmPassTyping, setConfirmPassTyping] = useState(false);
    const [FirstNameTyping, setFirstNameTyping] = useState(false);
    const [LastNameTyping, setLastNameTyping] = useState(false);

    const [PasswordIsVisible, setPasswordIsVisible] = useState(false);
    const [ConfrimPassIsVisible, setConfrimPassIsVisible] = useState(false);
    const [error, setError] = useState('');

    const handleEmailTyping = (text) => {
        setEmail(text);
        setEmailIsTyping(text.length > 0);
    };

    const handlePasswordTyping = (text) => {
        setPassword(text);
        setPasswordIsTyping(text.length > 0);
    };

    const handleFirstNameTyping = (text) => {
        setFirstName(text);
        setFirstNameTyping(text.length > 0);
    };

    const handleLastNameTyping = (text) => {
        setLastName(text);
        setLastNameTyping(text.length > 0);
    };

    const handleConfirmPassTyping = (text) => {
        setConfrimPass(text);
        setConfirmPassTyping(text.length > 0);
    };

    const togglePasswordVisibility = () => {
        setPasswordIsVisible((prev) => !prev);
    };

    const toggleConfirmPassVisibility = () => {
        setConfrimPassIsVisible((prev) => !prev);
    };

    // Email & Password Check
    const endsWithDotCom = () => email.toLowerCase().endsWith('@gmail.com');
    const emailLength = () => email.length >= 12;
    const passLength = () => password.length >= 8;
    const firstnameCheck = () => firstname ? firstname.length >= 3 : true;
    const lastnameCheck = () => lastname ? lastname.length >= 3 : true;
    const passCheck = () => firstname && password ? password === confirmpass : true;

    // All Value Check
    const AllValue = emailLength() && passLength() && endsWithDotCom() && firstnameCheck() && lastnameCheck() && passCheck();

    // FullName Function
    const getFullName = () => {
        const cleanedFirstName = firstname.trim();
        const cleanedLastName = lastname.trim();
        return `${cleanedFirstName} ${cleanedLastName}`;
    };
    const TrimmedfullName = getFullName();

    // UserID Function
    const getUserID = () => {
        const cleanedFirstName = firstname.replace(/\s+/g, '');
        const cleanedLastName = lastname.replace(/\s+/g, '');
        return `${cleanedFirstName}${cleanedLastName}`;
    };
    const TrimmeduserID = getUserID();

    // Firestore SignUp
    const handleSignUp = async () => {
        if (!AllValue) {
            alert("Validation failed. Please check your inputs.");
            return;
        }

        try {
            setLoading(true);

            // Check if the email is already registered
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                alert("An account with this email already exists.");
                setLoading(false);
                return;
            }

            // Create user account with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user data in Firestore
            const customId = await handleNewUser(user.uid);

            if (!customId) {
                setLoading(false);
                alert("Failed to store user data. Please try again.");
                return;
            }

            // Fetch UserData
            const userData = await findUserDataByEmail(email);

            // Check if userData Available
            if (userData && userData.userID && userData.fullName) {
                const { userID, fullName, firstName, lastName, useremail, userpassword, userName } = userData;

                // Store the user data in the Zustand store
                const {
                    setUserID,
                    setFullName,
                    setUserLogged,
                    setFirstName,
                    setLastName,
                    setUserEmail,
                    setUserPassword,
                    setUserName,
                } = useStore.getState();
                setUserName(userName);
                setUserID(userID);
                setFullName(fullName);
                setFirstName(firstName);
                setLastName(lastName);
                setUserEmail(useremail);
                setUserPassword(userpassword);
                setUserLogged(true);

                // Navigate to the next screen with the retrieved user data
                navigation.replace('NewUserWelcome', { userID });
            } else {
                // console.log('User data not found in Firestore');
                alert("User data retrieval failed. Please try again.");
                setError('User data not found');
            }

            setLoading(false);
        } catch (error) {
            console.error("Error during signup:", error);
            setLoading(false);

            if (error.code === 'auth/email-already-in-use') {
                alert("An account with this email already exists.");
            } else {
                alert("Sign-up failed. Please try again.");
            }
            setError(error.message);
        }
    };

    const handleNewUser = async (uid) => {
        try {
            // Generate a unique string and create a custom ID
            const uniqueString = generateRandomString(20);
            const customId = `${TrimmeduserID}${uniqueString}`;

            // Create the new user object including UserID
            const newUser = {
                UserID: customId,
                UserUID: uid,
                FullName: TrimmedfullName,
                UserName: TrimmeduserID,
                FirstName: firstname,
                LastName: lastname,
                Email: email,
                Password: password,
            };

            // Add user data to Firestore with the custom ID
            await addNewUserData(newUser, customId);
            // console.log("New user added with custom ID: ", customId);
            return customId;
        } catch (error) {
            console.error("Error adding new user: ", error);
            throw error;
        }
    };

    // Loading
    const [loading, setLoading] = useState(false);

    // Reset All When Focuse
    useFocusEffect(
        React.useCallback(() => {
            const timer = setTimeout(() => setLoading(false), 500);
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
            setConfrimPass("");
            return () => {
                clearTimeout(timer);
            };
        }, [navigation])
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
            </View>
            {/* Other Components Will Write In This View Component */}
            <View style={Styles.SecondCont}>
                {/* Sign In Text */}
                <View style={Styles.SignInTextCont}>
                    <Text style={TextStyles.bold28grayscale900}>Sign Up</Text>
                </View>
                {/* TextInputs */}
                {/* Email Input*/}
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
                {/* First & Last Name */}
                <View style={{ paddingTop: hp(2.05) }} />
                <View style={{ flexDirection: "row" }}>
                    {/* First Name */}
                    <View style={[TextFieldStyles.TFContainer, { flex: 1, paddingHorizontal: 0, paddingLeft: hp(3.8) }]}>
                        <View style={TextFieldStyles.TextContainer}>
                            <View style={TextFieldStyles.TextInputCont}>
                                <TextInput
                                    style={[TextFieldStyles.NormalText, FirstNameTyping && TextFieldStyles.boldText]}
                                    placeholder="First Name"
                                    value={firstname}
                                    onChangeText={(text) => {
                                        const filteredText = text.replace(/[ ,:*]/g, '');
                                        handleFirstNameTyping(filteredText);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    {/* Last Name */}
                    <View style={{ paddingRight: hp(1.9) }} />
                    <View style={[TextFieldStyles.TFContainer, { flex: 1, paddingHorizontal: 0, paddingRight: hp(3.8) }]}>
                        <View style={TextFieldStyles.TextContainer}>
                            <View style={TextFieldStyles.TextInputCont}>
                                <TextInput
                                    style={[TextFieldStyles.NormalText, LastNameTyping && TextFieldStyles.boldText]}
                                    placeholder="Last Name"
                                    value={lastname}
                                    onChangeText={(text) => {
                                        const filteredText = text.replace(/[ ,:*]/g, '');
                                        handleLastNameTyping(filteredText);
                                    }}
                                />
                            </View>
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
                {/* Cofirm Password input*/}
                <View style={{ paddingTop: hp(2.05) }} />
                <View style={TextFieldStyles.TFContainer}>
                    <View style={[TextFieldStyles.TextContainer, { flexDirection: "row" }]}>
                        <View style={TextFieldStyles.TextInputCont}>
                            <TextInput
                                style={[TextFieldStyles.NormalText, ConfirmPassTyping && TextFieldStyles.boldText]}
                                placeholder="Confirm Password"
                                value={confirmpass}
                                onChangeText={(text) => {
                                    const filteredText = text.replace(/[ ,:*]/g, '');
                                    handleConfirmPassTyping(filteredText);
                                }}
                                secureTextEntry={!ConfrimPassIsVisible}
                            />
                        </View>
                        {/* Confirm Password Visible Icon */}
                        <View style={{ justifyContent: "center", paddingRight: hp(2.05) }}>
                            <View style={{ height: hp(2.6), width: hp(2.6) }}>
                                {ConfirmPassTyping && (
                                    <Pressable onPress={toggleConfirmPassVisibility}>
                                        {ConfrimPassIsVisible ? (
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
                {/* Button */}
                <View style={{ paddingHorizontal: hp(3.8), paddingTop: hp(3.2), paddingBottom: hp(4.1) }}>
                    <TouchableOpacity onPress={handleSignUp} activeOpacity={0.8}>
                        {loading ? (
                            <ActivityIndicator size={hp(5.9)} color="#DC143C" />
                        ) : (
                            <Button01
                                text={"Sign Up"}
                                email={email}
                                password={password}
                                firstname={firstname}
                                lastname={lastname}
                                confirmpass={confirmpass}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                {/* SignUp Component */}
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <Text style={TextStyles.regular14grayscale800}>Already have an account? </Text>
                    <TouchableOpacity
                        onPress={() => navigation.replace('SignIn')}
                        activeOpacity={0.8}
                    >
                        <Text style={TextStyles.regular14redD3w500}>Login!</Text>
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
    SignInTextCont: {
        alignItems: "center",
        paddingTop: hp(1.3)
    },
});

export default SignInScreen;