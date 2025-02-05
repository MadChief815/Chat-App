import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    TextInput,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Firebase & Authentication
import { auth } from '../Firebase/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

// Custom Components
import { Colors } from "../Components/Styles/Colors";
import { TextFieldStyles, createTextStyles } from '../Components/Styles/TextStyles';
import useStore from '../Src/ZustandStore';
import Button01 from "../Components/Button/ForgotPassScreens/Button1";

// Dimensions
const { width, height } = Dimensions.get('window');

const ForgotPassScreen = ({ navigation }) => {

    // Styles
    const { darkTheme } = useStore();
    const TextStyles = createTextStyles(darkTheme);

    // Data Inputs
    const [email, setEmail] = useState('');

    const [EmailIsTyping, setEmailIsTyping] = useState(false);
    const [error, setError] = useState('');

    const handleEmailTyping = (text) => {
        setEmail(text);
        setEmailIsTyping(text.length > 0);
    };


    // Email & Password Check
    const endsWithDotCom = () => email.toLowerCase().endsWith('@gmail.com');
    const emailLength = () => email.length >= 12;

    // All Value Check
    const AllValue = emailLength() && endsWithDotCom();

    // Loading
    const [loading, setLoading] = useState(false);

    // Firestore Forgot Password
    const handleForgotPass = async () => {
        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            console.log(email);
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent. Check your inbox.");
        } catch (error) {
            // Handle Errors
            if (error.code === 'auth/user-not-found') {
                setError("No user found with this email.");
            } else if (error.code === 'auth/invalid-email') {
                setError("Invalid email address.");
            } else {
                setError("Failed to send reset email. Please try again.");
            }
        } finally {
            setEmail('');
            setLoading(false);
        }
    };

    // Reset All When Focuse
    useFocusEffect(
        React.useCallback(() => {
            const timer = setTimeout(() => setLoading(false), 500);
            setEmail("");
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
                {/* Forgot Password Text */}
                <View style={Styles.SignInTextCont}>
                    <Text style={TextStyles.bold28grayscale900}>Forgot Password</Text>
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
                {/* Button */}
                <View style={{ paddingHorizontal: hp(3.8), paddingTop: hp(3.2), paddingBottom: hp(4.1) }}>
                    <TouchableOpacity onPress={handleForgotPass} activeOpacity={0.8}>
                        {loading ? (
                            <ActivityIndicator size={hp(5.9)} color="#DC143C" />
                        ) : (
                            <Button01
                                text={"Send OTP"}
                                email={email}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                {/* Go Back To Login Component */}
                <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                    <Text style={TextStyles.regular14grayscale800}>Go back to </Text>
                    <TouchableOpacity
                        onPress={() => navigation.replace('SignIn')}
                        activeOpacity={0.8}
                    >
                        <Text style={TextStyles.regular14redD3w500}>Login</Text>
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

export default ForgotPassScreen;