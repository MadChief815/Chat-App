import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  ScrollView
} from 'react-native'
import { BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { collection, onSnapshot } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useFocusEffect } from '@react-navigation/native';

// Custom Components
import Chatlist from "../../Components/ChatList/Chatlist";
import useStore from '../../Src/ZustandStore';
import { Colors } from "../../Components/Styles/Colors";
import { createTextStyles, TextFieldStyles } from '../../Components/Styles/TextStyles';
import { db } from '../../Firebase/firebaseConfig';
import ChatItem from "../../Components/ChatList/ChatItem";

// Notification
import PushNotificationHandler from '../../Components/Notifications/NotificationToken';

// SVGs
import SearchIcon from "../../assets/SVG/ChatScreen/lightsearch.svg";
import DarkSearchIcon from "../../assets/SVG/ChatScreen/darksearch.svg";

const ChatsScreen = () => {

  // Styles
  const { darkTheme, userID } = useStore();
  const TextStyles = createTextStyles(darkTheme);
  const Styles = createStyles(darkTheme);

  // BackButton Exit
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      // Cleanup on unfocus
      return () => {
        backHandler.remove();
      };
    }, [])
  );

  // Navigation
  const navigation = useNavigation();

  // Search
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState(users);


  const [queryIsTyping, setQueryIsTyping] = useState(false);

  // Handle Search
  const handleSearch = (text) => {
    setQuery(text);
    setQueryIsTyping(text.length > 0);

    const excludedUserID = userID;  

    if (text === '') {
        const filteredUsers = users.filter(item => item.UserID !== excludedUserID);
        setFilteredData(filteredUsers);
    } else {
        const filtered = users.filter((item) =>
            item.FullName && 
            item.FullName.toLowerCase().includes(text.toLowerCase()) &&
            item.UserID !== excludedUserID
        );
        setFilteredData(filtered);
    }
};

  // Users
  const [users, setUsers] = useState([]);

  // Firestore collection reference
  const usersRef = collection(db, 'DB01', 'Credentials', 'USERS');

  useEffect(() => {
    const unsubscribeFirestore = onSnapshot(usersRef, (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        profilepicture: null,
      }));

      // Update state after Firestore fetch
      setUsers(fetchedUsers);

      // Fetch profile pictures for all users
      const listeners = fetchedUsers.map((user) => {
        const userID = user.UserID;
        const dbReference = ref(getDatabase(), `${userID}/profilePicture`);

        // Realtime listener for profile picture changes
        const unsubscribeRealtime = onValue(dbReference, (snapshot) => {
          const profilePicture = snapshot.exists() ? snapshot.val() : null;

          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.UserID === userID ? { ...u, profilepicture: profilePicture } : u
            )
          );
        });

        return unsubscribeRealtime;
      });

      // Cleanup listeners on unmount
      return () => {
        listeners.forEach((unsubscribe) => unsubscribe());
      };
    });

    // Cleanup Firestore listener on unmount
    return () => unsubscribeFirestore();
  }, []);

  // Clean Data
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      return () => {
        setQuery("");
        setQueryIsTyping(false);
      };
    }, [])
  );

  return (
    <SafeAreaView style={Styles.MainCont}>
      <StatusBar
        translucent={true}
        backgroundColor={darkTheme ? "#FFFFFF" : Colors.AdditionalBlack}
        barStyle={darkTheme ? 'dark-content' : 'light-content'}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={Styles.scrollViewCont}>
        {/* Notification */}
        <PushNotificationHandler />
        {/* Search Bar */}
        <View style={Styles.searchBarPadding}>
          <View style={Styles.searchBarCont}>
            {/* Search Icon */}
            <View style={Styles.searchIconPadding}>
              <View style={Styles.searchIconCont}>
                {darkTheme ? (
                  <SearchIcon width={hp(3)} height={hp(3)} />
                ) : (
                  <DarkSearchIcon width={hp(3)} height={hp(3)} />
                )}
              </View>
            </View>
            {/* Search TextInput */}
            <View style={Styles.searchInputCont}>
              <TextInput
                placeholder='Search'
                placeholderTextColor={Colors.Grayscale600}
                value={query}
                onChangeText={handleSearch}
                style={[Styles.NormalText, queryIsTyping && Styles.boldText]}
              />
            </View>
          </View>
        </View>
        {/* Search List */}
        {queryIsTyping ? (
          <View style={Styles.SearchResultMainCont}>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <ChatItem
                  key={item.id}
                  noBorder={true}
                  item={item}
                />
              ))
            ) : (
              <View style={Styles.NoResultCont}>
                <Text style={[TextStyles.FS20grayscale900w500, {textAlign: "center"}]}>
                  No Result Found
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            {/* Users */}
            <View style={{ paddingTop: hp(2.05), paddingBottom: hp(1.025), paddingHorizontal: hp(2.05) }}>
              <Text style={TextStyles.regular22grayscale900}>Friends</Text>
            </View>
            {
              users.length > 0 ? (
                <Chatlist users={users} />
              ) : (
                <View style={Styles.NoUsersCont}>
                  <ActivityIndicator
                    size={'large'}
                    color="#A80F2A"
                  />
                </View>
              )
            }
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (darkTheme) => StyleSheet.create({
  MainCont: {
    flex: 1,
    backgroundColor: darkTheme ? "#FFFFFF" : Colors.AdditionalBlack
  },
  scrollViewCont: {
    flex: 1
  },
  searchBarPadding: {
    paddingTop: hp(2.05),
    paddingHorizontal: hp(2.05)
  },
  searchBarCont: {
    backgroundColor: darkTheme ? Colors.Grayscale100 : Colors.Grayscale900,
    height: hp(5.1),
    borderRadius: hp(1.3),
    flexDirection: "row",
    alignItems: "center"
  },
  searchIconPadding: {
    paddingHorizontal: hp(1.5)
  },
  searchIconCont: {
    justifyContent: "center",
    alignItems: "center",
    width: hp(3.8),
    height: hp(3.8)
  },
  searchInputCont: {
    height: hp(3.1),
    width: "80%",
    justifyContent: "center"
  },
  item: {
    padding: hp(2.05),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  NormalText: {
    fontSize: hp(2.2),
    height: hp(6.7),
    fontWeight: "500",
    color: darkTheme ? Colors.Grayscale600 : Colors.Grayscale500,
  },
  boldText: {
    fontSize: hp(2.2),
    height: hp(6.7),
    fontWeight: '700',
    color: darkTheme ? Colors.Grayscale900 : Colors.Grayscale200,
  },
  NoUsersCont: {
    height: hp(6),
    justifyContent: "center",
  },
  SearchResultMainCont: {
    flex: 1
  },
  NoResultCont: {
    paddingTop: hp(5),
  }
});

export default ChatsScreen;