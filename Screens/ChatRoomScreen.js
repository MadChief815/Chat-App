import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Alert,
    Keyboard
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { collection, doc, query, onSnapshot, orderBy, addDoc, serverTimestamp, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../Firebase/firebaseConfig';

// Custom Components
import useStore from '../Src/ZustandStore';
import { Colors } from '../Components/Styles/Colors';
import MassageList from '../Components/MassageList/MassageList';
import { getRoomID } from '../Utilities/ChatRoom';

// Notifications
import { getUserPushToken, sendPushNotification } from '../Components/Notifications/NotificationManager';

// Header
import Header from "../Components/Headers/ChatRoomScreen/header";

// SVGs
import SendIcon from "../assets/SVG/ChatRoomScreen/send1.svg"
import SendFocusedIcon from "../assets/SVG/ChatRoomScreen/sendfocused.svg"

// StatusBar Height
const statusBarHeight = StatusBar.currentHeight

const ChatRoomScreen = ({ route }) => {

    // Data
    const { item } = route.params;
    const { userID, userName, fullName } = useStore();

    // Theme
    const { darkTheme } = useStore();
    const Styles = createStyles(darkTheme);

    // Massages
    const [massages, setMassages] = useState([]);

    // Type Massage
    const textRef = useRef('');
    const inputRef = useRef(null);
    const [typedMSG, setTypedMSG] = useState('')
    const [typeMSGisTyping, setTypeMSGisTyping] = useState(false);

    const handleTypeMSGTyping = (text) => {
        setTypedMSG(text);
        setTypeMSGisTyping(text.length > 0);
        textRef.current = text;
    };

    // Send Message
    const handleSendMsg = async () => {
        setTypedMSG("");
        setTypeMSGisTyping(false);
        let massage = textRef.current.trim();
        if (!massage) return;

        try {
            // Get the Room ID
            let roomID = getRoomID(userID, item?.UserID);

            // Get the Firestore references
            const docRef = doc(db, "Rooms", roomID);
            const massageRef = collection(docRef, "massages");

            // Clear input
            textRef.current = "";
            if (inputRef) inputRef?.current?.clear();

            // Add the message to Firestore
            const newDoc = await addDoc(massageRef, {
                UserID: userID,
                text: massage,
                senderName: userName,
                createdAt: serverTimestamp(),
                isRead: false,
                readBy: {
                    [userID]: true,
                    [item?.UserID]: false
                }
            });

            // Send a push notification to the other user (only if they're not in the chat)
            await sendNotification(item?.UserID, roomID);
        } catch (err) {
            Alert.alert("Message", err.message);
        }
    };

    // Chat Rooms
    useEffect(() => {
        // Ensure the room exists
        createRoomifNotExist();

        // Get roomID based on user and other participant
        let roomID = getRoomID(userID, item?.UserID);
        const docRef = doc(db, "Rooms", roomID);
        const massageRef = collection(docRef, "massages");

        // Firestore query to fetch messages ordered by timestamp
        const q = query(massageRef, orderBy('createdAt', 'asc'));

        const unsub = onSnapshot(q, (snapshot) => {
            let allMassages = snapshot.docs.map(doc => doc.data());

            // Mark unread messages for the user
            allMassages = allMassages.map(msg => ({
                ...msg,
                isRead: msg.readBy?.[userID] || false,
            }));

            setMassages([...allMassages]);
        });

        // Keyboard listener
        const KeyBoardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScrollView
        );

        // Cleanup on unmount
        return () => {
            unsub();
            KeyBoardDidShowListener.remove();
        };

    }, [userID, item?.UserID]);

    // Create Room
    const createRoomifNotExist = async () => {
        let roomID = getRoomID(userID, item?.UserID);
        const roomDocRef = doc(db, "Rooms", roomID);
        const roomDocSnap = await getDoc(roomDocRef);

        if (!roomDocSnap.exists()) {
            await setDoc(roomDocRef, {
                roomID,
                createdAt: serverTimestamp(),
            });
        }
    };

    // Send Notification
    const sendNotification = async (receiverUserID, roomID) => {
        try {
            // Fetch the receiver's push token from Firestore
            const pushToken = await getUserPushToken(receiverUserID);

            // Send the push notification
            if (pushToken) {
                const messageData = {
                    title: `${fullName}`,
                    body: `${typedMSG}`,
                    data: { roomID },
                };

                await sendPushNotification(pushToken, messageData);
            }
        } catch (error) {
            console.error('Error sending message or notification:', error);
        }
    };

    // Mark messages as read
    useEffect(() => {
        let roomID = getRoomID(userID, item?.UserID);
        const markMessagesAsRead = async () => {
            const messagesRef = collection(db, 'Rooms', roomID, 'massages');
            const snapshot = await getDocs(query(messagesRef, where(`readBy.${userID}`, '==', false)));

            const batch = writeBatch(db);
            snapshot.docs.forEach((doc) => {
                batch.update(doc.ref, {
                    [`readBy.${userID}`]: true,
                    isRead: true,
                });
            });

            await batch.commit();
        };

        // Mark messages as read when the user opens the chat room
        if (roomID) {
            markMessagesAsRead();
        }
    }, [userID]);

    // Scroll View Fix
    const srollViewRef = useRef(null);

    useEffect(() => {
        updateScrollView();
    }, [massages]);

    const updateScrollView = () => {
        setTimeout(() => {
            srollViewRef.current?.scrollToEnd({ animated: true });
        }, 100)
    };

    return (
        <SafeAreaView style={Styles.MainCont}>
            <StatusBar
                translucent={true}
                backgroundColor={darkTheme ? Colors.AdditionalWhite : Colors.AdditionalBlack}
                barStyle={darkTheme ? 'dark-content' : 'light-content'}
            />
            {/* Header */}
            <Header item={item} />
            {/* Massages List */}
            <MassageList
                massages={massages}
                currentUser={userID}
                srollViewRef={srollViewRef}
            />
            {/* Send Massage */}
            <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
                <View style={{ paddingHorizontal: hp(2.05), paddingBottom: hp(1.5) }}>
                    <View style={Styles.SendMainMsgCont}>
                        {/* TextInput */}
                        <View style={Styles.SendMsgCont}>
                            <TextInput
                                ref={inputRef}
                                placeholder='Type a massage'
                                placeholderTextColor={darkTheme ? Colors.Grayscale500 : Colors.Grayscale600}
                                value={typedMSG}
                                onChangeText={(text) => {
                                    handleTypeMSGTyping(text);
                                }}
                                style={[Styles.NormalText, typeMSGisTyping && Styles.boldText]}
                            />
                        </View>
                        {/* Send Icon */}
                        <TouchableOpacity
                            onPress={handleSendMsg}
                            activeOpacity={0.2}
                            style={{ justifyContent: "center", paddingHorizontal: hp(2.05) }}
                        >
                            {typeMSGisTyping ? (
                                <SendFocusedIcon width={hp(3.6)} height={hp(3.6)} />
                            ) : (
                                <SendIcon width={hp(3.6)} height={hp(3.6)} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const createStyles = (darkTheme) => StyleSheet.create({
    MainCont: {
        flex: 1,
        paddingTop: statusBarHeight,
    },
    SendMainMsgCont: {
        height: hp(5.6),
        width: "100%",
        backgroundColor: darkTheme ? Colors.Grayscale200 : Colors.Grayscale800,
        borderRadius: hp(2.3),
        flexDirection: "row"
    },
    SendMsgCont: {
        paddingLeft: hp(1.5),
        justifyContent: "center",
        flex: 1,
    },
    NormalText: {
        fontSize: hp(2.2),
        justifyContent: "center",
        fontWeight: "400",
    },
    boldText: {
        fontSize: hp(2.2),
        fontWeight: '400',
        color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale200,
    },
});

export default ChatRoomScreen;