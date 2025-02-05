import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { LinearGradient } from 'expo-linear-gradient';

// Custom Components
import { createTextStyles } from '../../Styles/TextStyles';
import useStore from '../../../Src/ZustandStore';
import { Colors } from '../../Styles/Colors';

// Dimensions
const { width } = Dimensions.get('window');

const Button01 = ({ text, email }) => {

    // Styles
    const { darkTheme } = useStore();
    const TextStyles = createTextStyles(darkTheme);

    // Email & Password Check
    const endsWithDotCom = () => email.toLowerCase().endsWith('@gmail.com');
    const emailLength = () => email.length >= 12;

    // All Value Check
    const AllValue = emailLength() && endsWithDotCom();

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
                        <View style={{ width: hp(20), height: hp(3.1), alignItems: "center" }}>
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
                        <View style={{ width: hp(20), height: hp(3.1), alignItems: "center" }}>
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