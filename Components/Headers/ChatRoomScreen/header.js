import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import { Colors } from '../../Styles/Colors';
import { createTextStyles } from '../../Styles/TextStyles';
import useStore from '../../../Src/ZustandStore';
import UserProfileViewModal from '../../Modals/ChatRoomScreen/ChatUserProfileModal';

// Icons
import LightBackIcon from "../../../assets/SVG/ChatRoomScreen/lightback.svg";
import DarkBackIcon from "../../../assets/SVG/ChatRoomScreen/darkback.svg";

// Images
import NoImage from "../../../assets/Images/noimage5.png";

const ChatRoomHeader = ({ item }) => {

    // Handle Navigate Back
    const navigation = useNavigation();
    const handleNavigateBack = () => {
        navigation.goBack();
    };

    // Chat User Profile Modal
    const [userProfileVisible, setUserProfileVisible] = useState(false);

    const handleUserProfileModal = () => {
        setUserProfileVisible(true);
    };

    // Theme
    const { darkTheme } = useStore();
    const Styles = createStyles(darkTheme);
    const TextStyles = createTextStyles(darkTheme);

    // StatusBar Color
    const statusBarNormalColor = darkTheme ? "#FFFFFF" : Colors.AdditionalBlack
    const statusBarColor = darkTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.9)'
    const statusBarContColor = !darkTheme;

    return (
        <View style={Styles.HeaderCont}>
            <StatusBar
                translucent={true}
                backgroundColor={userProfileVisible ? statusBarColor : statusBarNormalColor}
                barStyle={userProfileVisible || statusBarContColor ? 'light-content' : 'dark-content'}
            />
            {/* Back Icon */}
            <TouchableOpacity onPress={handleNavigateBack} style={Styles.backIconCont}>
                {darkTheme ? (
                    <LightBackIcon width={hp(5)} height={hp(5)} />
                ) : (
                    <DarkBackIcon width={hp(5)} height={hp(5)} />
                )}
            </TouchableOpacity>
            {/* User Details */}
            <TouchableOpacity
                onPress={handleUserProfileModal}
                activeOpacity={0.7}
                style={Styles.UserDetailsCont}
            >
                {/* User Profile Picture */}
                <View style={Styles.ProfileImgCont}>
                    {item.profilepicture ? (
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${item.profilepicture}` }}
                            style={{ width: hp(5), height: hp(5), borderRadius: hp(2.5) }}
                        />
                    ) : (
                        <Image
                            source={NoImage}
                            style={{ width: hp(5), height: hp(5), borderRadius: hp(2.5) }}
                        />
                    )}
                </View>
                {/* User Name */}
                <View>
                    <Text style={TextStyles.regular17grayscale900w500}>
                        {item.FullName}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Chat User Profile View Modal */}
            <UserProfileViewModal
                isModalVisible={userProfileVisible}
                setIsModalVisible={setUserProfileVisible}
                item={item}
            />
        </View>
    );
};

const createStyles = (darkTheme) => StyleSheet.create({
    HeaderCont: {
        height: hp(7.2),
        backgroundColor: darkTheme ? Colors.AdditionalWhite : Colors.AdditionalBlack,
        flexDirection: "row",
        alignItems: "center",
    },
    ProfileImgCont: {
        paddingLeft: hp(1),
        paddingRight: hp(1.2)
    },
    backIconCont: {
        paddingLeft: hp(1),
    },
    UserDetailsCont: {
        flexDirection: "row",
        alignItems: "center"
    }
});

export default ChatRoomHeader;