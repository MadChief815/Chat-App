import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import { createTextStyles } from '../Styles/TextStyles';
import useStore from '../../Src/ZustandStore';
import { Colors } from '../Styles/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const Button01 = ({ text, email, password, confirmpass = '', firstname = '', lastname = '' }) => {

    // Styles
    const { darkTheme } = useStore();
    const TextStyles = createTextStyles(darkTheme);

    // Email & Password Check
    const endsWithDotCom = () => email.toLowerCase().endsWith('@gmail.com');
    const emailLength = () => email.length >= 12;
    const passLength = () => password.length >= 8;
    const firstnameCheck = () => firstname ? firstname.length >= 3 : true;
    const lastnameCheck = () => lastname ? lastname.length >= 3 : true;
    const passCheck = () => firstname && password ? password === confirmpass : true;

    // All Value Check
    const AllValue = emailLength() && passLength() && endsWithDotCom() && firstnameCheck() && lastnameCheck() && passCheck();

    return (
        // Button
        <>
            {AllValue ? (
                <LinearGradient
                    colors={['#A80F2A', '#DC143C', '#DC143C', '#A80F2A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={Styles.gradientButton}
                >
                    <View
                        style={Styles.ButtonContainer01}
                    >
                        <View style={{ width: hp(8.2), height: hp(3.1), alignItems: "center" }}>
                            <Text style={[TextStyles.regular16grayscale400, { color: Colors.AdditionalWhite }]}>
                                {text}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            ) : (
                <LinearGradient
                    colors={['#6E6E6E', '#6E6E6E', '#6E6E6E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={Styles.gradientButton}
                >
                    <View
                        style={[Styles.ButtonContainer02]}
                    >
                        <View style={{ width: hp(8.2), height: hp(3.1), alignItems: "center" }}>
                            <Text style={[TextStyles.regular16grayscale400, { color: Colors.AdditionalWhite }]}>
                                {text}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            )}
        </>
    );
};

const Styles = StyleSheet.create({
    ButtonContainer01: {
        height: hp(7.2),
        borderRadius: hp(3.2),
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    gradientButton: {
        borderRadius: hp(3.2),
        alignItems: 'center',
    },
    ButtonContainer02: {
        height: hp(7.2),
        borderRadius: hp(3.2),
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
});

export default Button01;