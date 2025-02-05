import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import useStore from '../../Src/ZustandStore';
import { Colors } from '../Styles/Colors';
import MassageItem from '../MassageItem/MassageItem';
import { createTextStyles } from '../Styles/TextStyles';

// SVGs
import SmileIcon from "../../assets/SVG/ChatRoomScreen/smile.svg";

const MassageListComponent = ({ massages, currentUser, srollViewRef }) => {

    // Theme
    const { darkTheme } = useStore();
    const Styles = createStyles(darkTheme);
    const TextStyles = createTextStyles(darkTheme);

    return (
        <View style={Styles.MainCont}>
            <ScrollView
                ref={srollViewRef}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={Styles.ScrolCont}
            >
                <View style={{ paddingTop: hp(1) }} />
                <View style={Styles.LogoImageCont}>
                    <SmileIcon width={hp(30)} height={hp(30)} />
                    <Text style={TextStyles.regular14grayscale600}>
                        Say Hi 👋
                    </Text>
                </View>
                <View style={{ paddingBlock: hp(1) }} />
                {massages.map((message, index) => {
                    const isNextUserDifferent =
                        index === massages.length - 1 
                            ? false
                            : message?.UserID !== massages[index + 1]?.UserID;

                    return (
                        <MassageItem
                            massages={message}
                            key={index}
                            currentUser={currentUser}
                            isNextUserDifferent={isNextUserDifferent}
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
};

const createStyles = (darkTheme) => StyleSheet.create({
    MainCont: {
        paddingBottom: hp(8),
        backgroundColor: darkTheme ? Colors.AdditionalWhite : Colors.Grayscale900,
        flex: 1
    },
    ScrolCont: {
        flexGrow: 1,
        backgroundColor: darkTheme ? Colors.AdditionalWhite : Colors.Grayscale900,
        paddingTop: hp(0.25),
    },
    LogoImageCont: {
        alignItems: "center",
        alignSelf: "center",
    },
});

export default MassageListComponent;