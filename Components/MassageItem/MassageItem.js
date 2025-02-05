import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Custom Components
import useStore from '../../Src/ZustandStore';
import { Colors } from '../Styles/Colors';
import { createTextStyles } from '../Styles/TextStyles';

export default function MassageItem({ massages, currentUser, isNextUserDifferent }) {

    // Theme
    const { darkTheme } = useStore();
    const Styles = createStyles(darkTheme);
    const TextStyles = createTextStyles(darkTheme);

    if(currentUser==massages?.UserID){
        // My Massages
        return (
            <View style={[Styles.User01MsgMainCont, isNextUserDifferent && Styles.ExtraPadding]}>
                <View style={Styles.User01MsgWidthCont}>
                    <View style={Styles.User01MsgCont}>
                        <Text style={[TextStyles.regular17White, {textAlign: "right"}]}>
                            {massages?.text}
                        </Text>
                    </View>
                </View>
            </View>
        )
    } else {
        return (
            <View style={[Styles.User02MsgMainCont, isNextUserDifferent && Styles.ExtraPadding]}>
                <View style={Styles.User02MsgWidthCont}>
                    <View style={Styles.User02MsgCont}>
                        <Text style={[TextStyles.regular17grayscale900, {textAlign: "left"}]}>
                            {massages?.text}
                        </Text>
                    </View>
                </View>
            </View>
       )
    }
};

const createStyles = (darkTheme) => StyleSheet.create({
    User01MsgMainCont: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingBottom: hp(0.25),
        paddingRight: hp(1),
    },
    User01MsgWidthCont: {
        width: wp(80),
        alignItems: "flex-end",
        backgroundColor: "transparent",
    },
    User01MsgCont: {
        backgroundColor: darkTheme ? Colors.RedD3 : Colors.RedD2,
        paddingHorizontal: hp(1.5),
        paddingVertical: hp(1),
        borderRadius: hp(2.3),
    },
    User02MsgMainCont: {
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingBottom: hp(0.25),
        paddingLeft: hp(1)
    },
    User02MsgWidthCont: {
        width: wp(80),
        alignItems: "flex-start",
        backgroundColor: "transparent",
    },
    User02MsgCont: {
        backgroundColor: darkTheme ? Colors.Grayscale100 : Colors.Grayscale800,
        paddingHorizontal: hp(1.5),
        paddingVertical: hp(1),
        borderRadius: hp(2.3),
    },
    ExtraPadding: {
        paddingBottom: hp(1.5)
    }
});