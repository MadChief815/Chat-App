import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';

// Custom Components
import { createTextStyles } from '../Styles/TextStyles';
import useStore from '../../Src/ZustandStore';
import { Colors } from '../Styles/Colors';
import { formatDate, getRoomID } from '../../Utilities/ChatRoom';
import { db } from '../../Firebase/firebaseConfig';

// Images
import NoImage from "../../assets/Images/noimage5.png";

const ChatItemComponent = ({ item, noBorder }) => {

    // Styles
    const { darkTheme, userID } = useStore();
    const TextStyles = createTextStyles(darkTheme);
    const Styles = createStyles(darkTheme);

    // Chat Room Navigation
    const navigation = useNavigation();

    const handleChatRoom = () => {
        navigation.navigate("ChatRoom", { item })
    };

    // Last Massage And Time
    const [lastMassage, setLastMassage] = useState(undefined);

    useEffect(() => {

        let roomID = getRoomID(userID, item?.UserID);
        const docRef = doc(db, "Rooms", roomID);
        const massageRef = collection(docRef, "massages");
        const q = query(massageRef, orderBy('createdAt', 'desc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMassages = snapshot.docs.map(doc => {
                return doc.data();
            });
            setLastMassage(allMassages[0] ? allMassages[0] : null);
        });

        return () => unsub();
    }, [userID, item?.UserID]);

    // Render Time
    const renderTime = () => {
        if (lastMassage) {
            let date = lastMassage?.createdAt;
            return formatDate(new Date(date?.seconds * 1000));
        };
    };

    // Render Last Massage
    const renderLastMsg = () => {
        if (typeof lastMassage === 'undefined') return 'Loading...';
        if (lastMassage) {
            // Truncate the text to 15 characters and add "..." if needed
            const truncatedText = lastMassage?.text.length > 15
                ? lastMassage?.text.slice(0, 15) + "..."
                : lastMassage?.text;

            if (userID === lastMassage?.UserID) return "You: " + truncatedText;
            return truncatedText;
        } else {
            return 'Say Hi 👋';
        }
    };

    // Render Unread Massages Count
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread message count
    const fetchUnreadMessageCount = () => {
        let roomID = getRoomID(userID, item?.UserID);
        const messagesRef = collection(db, 'Rooms', roomID, 'massages');
        const q = query(messagesRef);

        // Listen for real-time changes in the messages collection
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let unreadCount = 0;

            snapshot.docs.forEach((doc) => {
                const message = doc.data();

                // Check if the message has not been read by the user
                if (message.readBy && message.readBy[userID] === false) {
                    unreadCount++;
                }
            });
            setUnreadCount(unreadCount);
        });

        return unsubscribe;
    };

    useEffect(() => {
        const unsubscribe = fetchUnreadMessageCount();

        // Clean up the listener when the component unmounts
        return () => {
            unsubscribe();
        };
    }, [userID, item?.UserID]);

    return (
        <View>
            <TouchableOpacity onPress={handleChatRoom} activeOpacity={0.7} style={Styles.MainCont}>

                {/* User Image */}
                <View style={{ paddingLeft: hp(2.05), paddingRight: hp(1.5) }}>
                    {item.profilepicture ? (
                        <Image
                            source={{ uri: `data:image/jpeg;base64,${item.profilepicture}` }}
                            style={{ width: hp(7.7), height: hp(7.7), borderRadius: hp(3.85) }}
                        />
                    ) : (
                        <Image
                            source={NoImage}
                            style={{ width: hp(7.7), height: hp(7.7), borderRadius: hp(3.85) }}
                        />
                    )}
                </View>

                {/* Text Container */}
                <View style={Styles.TextCont}>
                    <View style={{}}>
                        {/* User Name */}
                        <Text style={TextStyles.medium17grayscale900}>
                            {item.FullName}
                        </Text>
                        {/* Last Msg */}
                        <Text style={TextStyles.regular14grayscale500}>
                            {renderLastMsg()}
                        </Text>
                    </View>

                    {/* Time And Unread Massages Count */}
                    <View style={{ paddingRight: hp(2.05) }}>
                        {/* Unread Massages Count */}
                        {unreadCount > 0 && (
                            <View style={Styles.UnreadMSGCont}>
                                <Text style={[TextStyles.regular14grayscale100w700, { textAlign: "center" }]}>
                                    {unreadCount}
                                </Text>
                            </View>
                        )}
                        {/* Time */}
                        <Text style={TextStyles.regular14grayscale500}>
                            {renderTime()}
                        </Text>
                    </View>
                </View>



            </TouchableOpacity>
            {/* Border */}
            {noBorder ? (
                <View />
            ) : (
                <View style={{ paddingHorizontal: hp(2.05) }}>
                    <View style={Styles.BorderCont} />
                </View>
            )}

        </View>
    );
};

const createStyles = (darkTheme) => StyleSheet.create({
    MainCont: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: hp(1.025),
    },
    TextCont: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1
    },
    BorderCont: {
        height: 0.5,
        backgroundColor: darkTheme ? Colors.Grayscale400 : Colors.Grayscale800
    },
    UnreadMSGCont: {
        height: hp(2.5),
        width: hp(2.5),
        borderRadius: hp(1.25),
        backgroundColor: darkTheme ? Colors.RedD3 : Colors.RedD2,
        alignSelf: "center"
    }
});

export default ChatItemComponent;