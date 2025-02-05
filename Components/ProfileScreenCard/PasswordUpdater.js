import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Pressable
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import { Colors } from '../Styles/Colors';
import useStore from '../../Src/ZustandStore';

// SVGs
import VisibleIcon from "../../assets/SVG/visible.svg";
import InvisibleIcon from "../../assets/SVG/invisible.svg";

const PassrodUpdateModal = ({ visible, onClose, onSave }) => {

    // Theme
    const { darkTheme } = useStore();
    const styles = createStyles(darkTheme);

    // Consts
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const [CurrentPassTyping, setCurrentPassTyping] = useState(false);
    const [NewPassTyping, setNewPassTyping] = useState(false);
    const [ConfirmPassTyping, setConfirmPassTyping] = useState(false);


    const handleCurrentPassTyping = (text) => {
        setCurrentPass(text);
        setCurrentPassTyping(text.length > 0);
    };
    const handleNewPassTyping = (text) => {
        setNewPass(text);
        setNewPassTyping(text.length > 0);
    };
    const handleConfirmPassTyping = (text) => {
        setConfirmPass(text);
        setConfirmPassTyping(text.length > 0);
    };

    // Password Visibilities
    const [CurrentPassIsVisible, setCurrentPassIsVisible] = useState(false);
    const [NewPassIsVisible, setNewPassIsVisible] = useState(false);
    const [ConfirmPassIsVisible, setConfirmPassIsVisible] = useState(false);

    const toggleCurrentPasswordVisibility = () => {
        setCurrentPassIsVisible((prev) => !prev);
    };

    const toggleNewPassVisibility = () => {
        setNewPassIsVisible((prev) => !prev);
    };

    const toggleConfirmPassVisibility = () => {
        setConfirmPassIsVisible((prev) => !prev);
    };

    // Check Passwords
    const { userPassword } = useStore();

    const CpassLength = () => currentPass.length >= 8;
    const CurrentPassCheck = () => currentPass === userPassword;
    const NpassLength = () => newPass.length >= 8;
    const CNpassLength = () => confirmPass.length >= 8;
    const newPassCheck = () => newPass === confirmPass;
    const AllValue = CpassLength() && NpassLength() && CNpassLength() && newPassCheck() && CurrentPassCheck();

    // Save New Password
    const handleSave = () => {
        if (AllValue) {
            onSave(confirmPass, currentPass);
            onClose();
        } else {
            Alert.alert("Invalid Input", "Please Check The Inputs Again.");
        }
    };

    // Cleaner
    useEffect(() => {
        if (visible) {
            setCurrentPass('');
            setNewPass('');
            setConfirmPass('');
            setCurrentPassTyping(false);
            setNewPassTyping(false);
            setConfirmPassTyping(false);
            setCurrentPassIsVisible(false);
            setNewPassIsVisible(false);
            setConfirmPassIsVisible(false);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Title */}
                    <Text style={styles.modalTitle}>Update Password</Text>
                    {/* Current Pass */}
                    <View style={{ flexDirection: "row" }}>
                        <TextInput
                            placeholder="Current Password"
                            placeholderTextColor={darkTheme ? Colors.Grayscale600 : Colors.Grayscale300}
                            value={currentPass}
                            onChangeText={(text) => {
                                const filteredText = text.replace(/[ ,:*]/g, '').slice(0, 20);
                                handleCurrentPassTyping(filteredText);
                            }}
                            style={[styles.input, CurrentPassTyping && styles.boldText]}
                            secureTextEntry={!CurrentPassIsVisible}
                        />
                        {/* Password Visible Icon */}
                        <View style={styles.PassIcon}>
                            <View style={{ height: hp(2.6), width: hp(2.6) }}>
                                {CurrentPassTyping && (
                                    <Pressable onPress={toggleCurrentPasswordVisibility}>
                                        {CurrentPassIsVisible ? (
                                            <InvisibleIcon width={hp(2.6)} height={hp(2.6)} />
                                        ) : (
                                            <VisibleIcon width={hp(2.6)} height={hp(2.6)} />
                                        )}
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    </View>
                    {/* New Pass */}
                    <View style={{ flexDirection: "row" }}>
                        <TextInput
                            placeholder="New Password"
                            placeholderTextColor={darkTheme ? Colors.Grayscale600 : Colors.Grayscale300}
                            value={newPass}
                            onChangeText={(text) => {
                                const filteredText = text.replace(/[ ,:*]/g, '');
                                handleNewPassTyping(filteredText);
                            }}
                            style={[styles.input, NewPassTyping && styles.boldText]}
                            secureTextEntry={!NewPassIsVisible}
                        />
                        {/* Password Visible Icon */}
                        <View style={styles.PassIcon}>
                            <View style={{ height: hp(2.6), width: hp(2.6) }}>
                                {NewPassTyping && (
                                    <Pressable onPress={toggleNewPassVisibility}>
                                        {NewPassIsVisible ? (
                                            <InvisibleIcon width={hp(2.6)} height={hp(2.6)} />
                                        ) : (
                                            <VisibleIcon width={hp(2.6)} height={hp(2.6)} />
                                        )}
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    </View>
                    {/* Confirm New Pass */}
                    <View style={{ flexDirection: "row" }}>
                        <TextInput
                            placeholder="Confirm New Password"
                            placeholderTextColor={darkTheme ? Colors.Grayscale600 : Colors.Grayscale300}
                            value={confirmPass}
                            onChangeText={(text) => {
                                const filteredText = text.replace(/[ ,:*]/g, '');
                                handleConfirmPassTyping(filteredText);
                            }}
                            style={[styles.input, ConfirmPassTyping && styles.boldText]}
                            secureTextEntry={!ConfirmPassIsVisible}
                        />
                        {/* Password Visible Icon */}
                        <View style={styles.PassIcon}>
                            <View style={{ height: hp(2.6), width: hp(2.6) }}>
                                {ConfirmPassTyping && (
                                    <Pressable onPress={toggleConfirmPassVisibility}>
                                        {ConfirmPassIsVisible ? (
                                            <InvisibleIcon width={hp(2.6)} height={hp(2.6)} />
                                        ) : (
                                            <VisibleIcon width={hp(2.6)} height={hp(2.6)} />
                                        )}
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    </View>
                    {/* Cancel & Save Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={styles.cancelButton} activeOpacity={0.8}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <View style={{ width: hp(2.6) }} />
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton} activeOpacity={0.8}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (darkTheme) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: darkTheme ? 'white' : Colors.Grayscale900,
        padding: hp(2.6),
        borderRadius: hp(1.3),
    },
    modalTitle: {
        fontSize: hp(3.1),
        color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale100,
        fontWeight: '800',
        marginBottom: hp(1.3),
    },
    input: {
        borderBottomWidth: 1,
        borderColor: Colors.Grayscale500,
        padding: hp(1.3),
        marginVertical: hp(1.3),
        width: wp(60),
        fontSize: hp(1.8)
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(2.6)
    },
    cancelButton: {
        backgroundColor: Colors.Grayscale600,
        height: hp(5.1),
        width: hp(15.4),
        borderRadius: hp(1),
        justifyContent: "center",
        alignItems: "center"

    },
    saveButton: {
        backgroundColor: Colors.Grayscale800,
        height: hp(5.1),
        width: hp(15.4),
        borderRadius: hp(1),
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: hp(1.8)
    },
    boldText: {
        borderBottomWidth: 1,
        borderColor: Colors.Grayscale500,
        padding: hp(1.3),
        marginVertical: hp(1.3),
        width: wp(60),
        color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale100,
        fontWeight: "700",
        fontSize: hp(2.05)
    },
    PassIcon: {
        position: "absolute",
        alignSelf: "center",
        right: hp(1)
    }
});

export default PassrodUpdateModal;
