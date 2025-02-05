import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Custom Components
import useStore from '../../Src/ZustandStore';
import { firebaseApp } from '../../Firebase/firebaseConfig';

const PushNotificationHandler = () => {

  // Zustand Store
  const { userID } = useStore();

  const [pushToken, setPushToken] = useState(null);

  useEffect(() => {
    // Ask for permission to receive notifications
    const getPushToken = async () => {
      // Request permission to send notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      // Get the push token
      const token = await Notifications.getExpoPushTokenAsync();
      setPushToken(token.data);

      // Save the push token to Firestore under the user's document
      const db = getFirestore(firebaseApp);
      const userRef = doc(db, 'DB01', 'Credentials', 'USERS', userID);
      await setDoc(userRef, { pushToken: token.data }, { merge: true });
    };

    // Fetch the push token when the component mounts
    getPushToken();

    // Handle notifications received when the app is in the foreground
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      // Show the notification when the app is in the foreground
      // You can update state or perform any logic based on the notification data here
    });

    return () => {
      foregroundSubscription.remove();
    };
  }, [userID]);

  return (
    <View>
      {/* {console.log("Push Token IS: ", pushToken)} */}
    </View>
  );
};

export default PushNotificationHandler;
