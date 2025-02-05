import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    StatusBar
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import { Colors } from '../../Styles/Colors';
import { createTextStyles } from '../../Styles/TextStyles';
import useStore from '../../../Src/ZustandStore';
import ImageViewModal from '../../ImageViewer/imageview';

// Images
import DefaultPicture from "../../../assets/Images/noimage5.png";

// Dimensions
const { width, height } = Dimensions.get('window');

const UserProfileViewModal = ({ isModalVisible, setIsModalVisible, item }) => {

    // Theme
    const { darkTheme } = useStore();
    const Styles = createStyles(darkTheme);
    const TextStyles = createTextStyles(darkTheme);

    // Image Modal Visibilities
    const [isImageViewVisible, setImageViewVisible] = useState(false);

    // StatusBar Color
    const statusBarNormalColor = darkTheme ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.9)';
    const statusBarColor = darkTheme ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.9)'
    const statusBarContColor = !darkTheme;

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsModalVisible(false)}
        >
            {/* StatusBar */}
            <StatusBar
                translucent={true}
                backgroundColor={isImageViewVisible ? statusBarColor : statusBarNormalColor}
                barStyle={isImageViewVisible || statusBarContColor ? 'light-content' : 'dark-content'}
            />
            <View style={Styles.modalContainer}>
                {/* Profile Picture */}
                <View style={Styles.ContPadding}>
                    <View style={Styles.ImageCont}>
                        {/* Close Button */}
                        <TouchableOpacity
                            style={Styles.closeButton}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={Styles.closeText}>✕</Text>
                        </TouchableOpacity>
                        {/* Image */}
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setImageViewVisible(true)}>
                            {item.profilepicture ? (
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${item.profilepicture}` }}
                                    style={{ width: hp(20), height: hp(20), borderRadius: hp(10) }}
                                />
                            ) : (
                                <Image
                                    source={DefaultPicture}
                                    style={{ width: hp(20), height: hp(20), borderRadius: hp(10) }}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
                {/* User Details */}
                <View style={Styles.ContPadding}>
                    <View style={Styles.ContentCont}>
                        {/* UserName */}
                        <View style={Styles.Card}>
                            {/* Label */}
                            <Text style={[
                                TextStyles.regular14grayscale700, {
                                    paddingTop: hp(1.3),
                                    paddingLeft: hp(1.3),
                                    paddingBottom: 1,
                                }]}>
                                User Name
                            </Text>
                            {/* Name */}
                            <Text style={[
                                TextStyles.regular16grayscale900w600, {
                                    paddingLeft: hp(1.3),
                                    paddingBottom: hp(1.3),
                                }]}>
                                {item.FullName}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Modal to View Image Full-Screen */}
                <ImageViewModal
                    isImageViewVisible={isImageViewVisible}
                    setImageViewVisible={setImageViewVisible}
                    profilePicture={item.profilepicture}
                    DefaultPicture={DefaultPicture}
                />
            </View>
        </Modal>
    );
};

const createStyles = (darkTheme) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: "center"
    },
    closeButton: {
        position: 'absolute',
        top: width > 375 ? 20 : 15,
        left: width > 375 ? 20 : 15,
    },
    closeText: {
        color: darkTheme ? 'black' : 'white',
        fontSize: hp(3.8),
        fontWeight: "900"
    },
    fullImage: {
        width: width,
        height: height * 0.5,
        resizeMode: 'contain',
    },
    ContPadding: {
        paddingHorizontal: hp(2.05),
    },
    ImageCont: {
        backgroundColor: darkTheme ? Colors.Grayscale100 : Colors.Grayscale900,
        height: hp(33),
        borderTopLeftRadius: hp(0.8),
        borderTopRightRadius: hp(0.8),
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
    },
    ContentCont: {
        backgroundColor: darkTheme ? Colors.Grayscale100 : Colors.Grayscale900,
        borderBottomRightRadius: hp(0.8),
        borderBottomLeftRadius: hp(0.8),
        elevation: 2
    },
    Card: {
        backgroundColor: darkTheme ? Colors.Grayscale50 : Colors.Grayscale800,
        marginHorizontal: hp(1.5),
        marginBottom: hp(2),
        elevation: 2,
        borderRadius: hp(0.8)
    },
});

export default UserProfileViewModal;