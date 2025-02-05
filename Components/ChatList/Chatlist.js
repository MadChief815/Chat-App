import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { useRouter } from "expo-router";
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Custom Components
import useStore from '../../Src/ZustandStore';
import ChatItem from "./ChatItem";
import { getRoomID } from '../../Utilities/ChatRoom';
import { db } from '../../Firebase/firebaseConfig';
import { createTextStyles } from '../Styles/TextStyles';

// SVGs
import SadIcon from "../../assets/SVG/ChatScreen/sad.svg";


const ChatListComponent = ({ users }) => {

    // Styles
    const { darkTheme } = useStore();
    const TextStyles = createTextStyles(darkTheme);

    // User Data
    const router = useRouter();

    // Filter out logged-in user
    const { userID } = useStore();
    const filteredUsers = users.filter(user => user.UserID !== userID);

    // Store last messages for each user
    const [lastMessages, setLastMessages] = useState({});

    useEffect(() => {
        // Store unsubscribe functions for all users
        const unsubscribes = [];

        // Set up listeners for each user
        filteredUsers.forEach((user) => {
            const roomID = getRoomID(userID, user?.UserID);
            const docRef = doc(db, "Rooms", roomID);
            const massageRef = collection(docRef, "massages");
            const q = query(massageRef, orderBy('createdAt', 'desc'));

            const unsub = onSnapshot(q, (snapshot) => {
                const allMassages = snapshot.docs.map(doc => doc.data());
                setLastMessages((prev) => ({
                    ...prev,
                    [user.UserID]: allMassages[0] || null,
                }));
            });

            unsubscribes.push(unsub);
        });

        // Cleanup on component unmount
        return () => unsubscribes.forEach(unsub => unsub());
    }, [users]);

    // Sort users by the latest message timestamp and filter ongoing chats
    const sortedAndFilteredUsers = filteredUsers.filter((user) => {
        const userLastMessage = lastMessages[user.UserID];
        return userLastMessage;
    }).sort((a, b) => {
        const aTimestamp = lastMessages[a.UserID]?.createdAt?.seconds || 0;
        const bTimestamp = lastMessages[b.UserID]?.createdAt?.seconds || 0;
        return bTimestamp - aTimestamp;
    });

    // Loading
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 0);

        return () => clearTimeout(timer); 
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {sortedAndFilteredUsers && sortedAndFilteredUsers.length > 0 ? (
                <FlatList
                    data={sortedAndFilteredUsers}
                    contentContainerStyle={{ flex: 1 }}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => <ChatItem
                        // noBorder={index + 1 === sortedAndFilteredUsers.length - 1}
                        noBorder={false}
                        router={router}
                        item={item}
                        index={index}
                    />}
                />
            ) : (
                <View style={Styles.NoFriendsCont}>
                    {loading ? (
                        <View style={{ alignItems: 'center' }}>
                            <ActivityIndicator
                                size="large"
                                color="#A80F2A"
                            />
                        </View>
                    ) : (
                        <View>
                            {/* Sad Icon */}
                            <View style={Styles.SadIconCont}>
                                <SadIcon width={hp(30)} height={hp(30)} />
                            </View>
                            {/* Text */}
                            <Text style={[TextStyles.FS20Red2w500, { textAlign: "center" }]}>
                                No Friends Available
                            </Text>
                            <Text style={[TextStyles.regular14grayscale600, { textAlign: "center" }]}>
                                Search To Find Friends!
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const Styles = StyleSheet.create({
    NoFriendsCont: {
        paddingTop: hp(1)
    },
    SadIconCont: {
        alignItems: "center"
    },
    NoUsersCont: {
        height: hp(6),
        justifyContent: "center",
    },
});

export default ChatListComponent;