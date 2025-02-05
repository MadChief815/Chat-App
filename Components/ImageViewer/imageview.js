import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Dimensions
const { width, height } = Dimensions.get('window');

const ImageViewModal = ({ isImageViewVisible, setImageViewVisible, profilePicture, DefaultPicture }) => {
    return (
        <Modal
            visible={isImageViewVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setImageViewVisible(false)}
        >
            <View style={Styles.modalContainer}>
                <TouchableOpacity
                    style={Styles.closeButton}
                    onPress={() => setImageViewVisible(false)}
                >
                    <Text style={Styles.closeText}>✕</Text>
                </TouchableOpacity>
                <Image
                    source={profilePicture ? { uri: `data:image/jpeg;base64,${profilePicture}` } : DefaultPicture}
                    style={Styles.fullImage}
                />
            </View>
        </Modal>
    );
};

const Styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: width > 375 ? 20 : 15,
        left: width > 375 ? 20 : 15,
    },
    closeText: {
        color: 'white',
        fontSize: hp(3.8),
        fontWeight: "900"
    },
    fullImage: {
        width: width,
        height: height * 0.5,
        resizeMode: 'contain',
    },
});

export default ImageViewModal;