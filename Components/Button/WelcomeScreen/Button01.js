import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import { createTextStyles } from '../../Styles/TextStyles';
import { Colors } from '../../Styles/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import useStore from '../../../Src/ZustandStore';

// Dimensions
const { width } = Dimensions.get('window');

const Button01 = ({ text }) => {

    // Styles
    const { darkTheme } = useStore();
    const TextStyles = createTextStyles(darkTheme);

    return (
        <LinearGradient
            colors={['#A80F2A', '#DC143C', '#DC143C', '#A80F2A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={Styles.gradientButton}
        >
            <View
                style={Styles.ButtonContainer01}
            >
                <View style={{ width: hp(10.3), height: hp(3.1), alignItems: "center" }}>
                    <Text style={[TextStyles.regular16grayscale400, { color: Colors.AdditionalWhite }]}>
                        {text}
                    </Text>
                </View>
            </View>
        </LinearGradient>
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