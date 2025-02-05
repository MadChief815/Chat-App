import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import { Colors } from "../Styles/Colors";
import { createTextStyles } from '..//Styles/TextStyles';
import useStore from '../../Src/ZustandStore';

const { width } = Dimensions.get('window');

const CustomRowItem = ({
    label,
    value,
    iconLeft: IconLeft,
    iconRight: IconRight,
    iconLeftWidth = width > 375 ? 28 : 24,
    iconLeftHeight = width > 375 ? 28 : 24,
    iconRightWidth = width > 375 ? 30 : 26,
    iconRightHeight = width > 375 ? 30 : 26,
    iconRightPadding = width > 375 ? 4 : 2,
    CustomFontWeight = "600",
    onPress
}) => {

    // Styles
    const { darkTheme } = useStore();
    const TextStyles = createTextStyles(darkTheme);
    const styles = createStyles(darkTheme);


    return (
        <View style={[styles.ContPadding, { paddingTop: hp(2.05) }]}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.contentCont}>
                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between" }}>

                    {/* Left Section with Icon and Text */}
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {/* Icon Left */}
                        <View style={[styles.IconPadding, { paddingRight: iconRightPadding }]}>
                            {IconLeft && <IconLeft width={iconLeftWidth} height={iconLeftHeight} />}
                        </View>

                        {/* Label and Value Text */}
                        <View>
                            <Text style={[
                                TextStyles.regular14grayscale700, {
                                    paddingTop: hp(1.3),
                                    paddingLeft: hp(1),
                                    paddingBottom: 1,
                                }]}>
                                {label}
                            </Text>
                            <Text style={[
                                TextStyles.regular16grayscale900w600, {
                                    paddingLeft: hp(1),
                                    paddingBottom: hp(1.3),
                                    fontWeight: CustomFontWeight
                                }]}>
                                {value}
                            </Text>
                        </View>
                    </View>

                    {/* Icon Right */}
                    <View style={styles.Icon2Padding}>
                        {IconRight && <IconRight width={iconRightWidth} height={iconRightHeight} />}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (darkTheme) => StyleSheet.create({
    ContPadding: {
        paddingTop: hp(2.05),
        paddingHorizontal: hp(2.05),
    },
    contentCont: {
        backgroundColor: darkTheme ? Colors.Grayscale50 : Colors.Grayscale900,
        borderRadius: 6,
        elevation: 2,
    },
    IconPadding: {
        paddingLeft: hp(1.3),
        paddingRight: hp(0.5)
    },
    Icon2Padding: {
        paddingRight: hp(2.6),
    }
});

export default CustomRowItem;
