import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const TextFieldStyles = StyleSheet.create({
    TFContainer: {
        paddingHorizontal: hp(3.8)
    },
    TextContainer: {
        flexDirection: "row",
        height: hp(6.7),
        borderWidth: 1.1,
        borderColor: Colors.Grayscale400,
        borderRadius: hp(1.9)
    },
    TextInputCont: {
        paddingVertical: hp(1.5),
        paddingHorizontal: hp(2),
        flex: 1,
        justifyContent: "center"
    },
    NormalText: {
        fontSize: hp(2.05),
        height: hp(6.7),
        fontWeight: "500",
        color: Colors.Grayscale900,
    },
    boldText: {
        fontSize: hp(2.05),
        height: hp(6.7),
        fontWeight: '800',
        color: Colors.Grayscale700,
    },
  });

export const createTextStyles = (darkTheme) => StyleSheet.create({

    // Regular 14
    regular14grayscale400: {
        fontSize: hp(1.8),
        color: Colors.Grayscale400,
        fontWeight: "400"
    },
    regular14grayscale500: {
        fontSize: hp(1.8),
        color: Colors.Grayscale500,
        fontWeight: "400"
    },
    regular14grayscale800: {
        color: Colors.Grayscale800,
        fontWeight: "400"
    },
    regular14DefaultGS400: {
        fontSize: hp(1.8),
        color: Colors.DefaultGS,
        fontWeight: "400"
    },
    regular14DefaultBlue400: {
        fontSize: hp(1.8),
        color: Colors.DefaultBlue,
        fontWeight: "400"
    },
    regular14grayscale700: {
        fontSize: hp(1.8),
        color: darkTheme ? Colors.Grayscale700 : Colors.Grayscale400,
        fontWeight: "600"
    },
    regular14grayscale600: {
        fontSize: hp(1.8),
        color: darkTheme ? Colors.Grayscale600 : Colors.Grayscale400,
        fontWeight: "400"
    },

    // FontSize 14 & Weight 500
    regular14redD3w500: {
        fontSize: hp(1.8),
        color: Colors.RedD3,
        fontWeight: "500"
    },
	
	// FontSize 14 & Weight 700
	regular14grayscale100w700: {
		fontSize: hp(1.8),
        color: darkTheme ? Colors.Grayscale100 : Colors.Grayscale300,
        fontWeight: "700"
	},

    // Regular 16
    regular16grayscale400: {
        fontSize: hp(2.05),
        color: Colors.Grayscale100,
        fontWeight: "400"
    },
    regular16grayscale800: {
        fontSize: hp(2.05),
        color: Colors.Grayscale700,
        fontWeight: "400"
    },
    regular16DefaultGS: {
        fontSize: hp(2.05),
        color: Colors.DefaultGS,
        fontWeight: "400"
    },
    regular16DefaultBlue: {
        fontSize: hp(2.05),
        color: Colors.DefaultBlue,
        fontWeight: "400"
    },
 
    // FontSize 16 & Weight 600
    regular16grayscale900w600: {
        fontSize: hp(2.2),
        color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale300,
        fontWeight: "600"
    },

    // FontSize 16 & Weight 700
    regular16AdditionalWhitew700: {
        fontSize: hp(2.05),
        color: Colors.AdditionalWhite,
        fontWeight: "700"
    },
    regular16Red3W700: {
        fontSize: hp(2.05),
        color: Colors.RedD3,
        fontWeight: "700"
    },

    // Regular 17
    regular17grayscale900: {
        fontSize: hp(2.2),
        color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale100,
        fontWeight: "400"
    },
    regular17White: {
        fontSize: hp(2.2),
        color: Colors.AdditionalWhite,
        fontWeight: "400"
    },
    regular17Black: {
        fontSize: hp(2.2),
        color: darkTheme ? Colors.AdditionalBlack : Colors.AdditionalWhite,
        fontWeight: "400"
    },

    // FontSize 17 & Weight 500
    regular17grayscale900w500: {
        fontSize: hp(2.2),
        color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale100,
        fontWeight: "500"
    },

    // FontSize 18 & Weight 500
    regular18redD3w500: {
        fontSize: hp(2.3),
        color: Colors.RedD3,
        fontWeight: "500",
    },

    // Regular 20
    regular20grayscale800: {
        fontSize: hp(2.6),
        color: Colors.Grayscale800,
        fontWeight: "700"
    },

    // FontSize 20 & Weight 500
    FS20grayscale900w500: {
        fontSize: hp(2.6),
        color: darkTheme ? Colors.Grayscale800 : Colors.Grayscale200,
        fontWeight: "700"
    },
    FS20Red2w500: {
        fontSize: hp(2.6),
        color: Colors.RedD2,
        fontWeight: "700"
    },

    // Regular 22
    regular22grayscale900: {
        fontSize: hp(2.8),
        color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale50,
        fontWeight: "600"
    },

    // Regular 24
    regular24grayscale600: {
        fontSize: hp(3.1),
        color: Colors.Grayscale600,
        fontWeight: "400"
    },


    // Regular 28 & Weight 600
    regular28grayscale900: {
        fontSize: hp(3.6),
        color: Colors.Grayscale900,
        fontWeight: "700"
    },

    // Medium 17
    medium17grayscale900: {
        fontSize: hp(2.2),
        color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale200,
        fontWeight: "600"
    },

    // Bold 28
    bold28DefaultGS: {
        fontSize: hp(3.6),
        color: Colors.DefaultGS,
        fontWeight: "700"
    },
    bold28grayscale900: {
        fontSize: hp(3.6),
        color: Colors.Grayscale900,
        fontWeight: "700"
    },

    // Bold 32
    bold32grayscale900: {
        fontSize: hp(4.1),
        color: Colors.Grayscale900,
        fontWeight: "700"
    },

    bold32grayscale900w900: {
        fontSize: hp(4.1),
        color: Colors.Grayscale800,
        fontWeight: "900"
    },
});