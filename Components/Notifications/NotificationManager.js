import { getFirestore, doc, getDoc } from 'firebase/firestore';

export const getUserPushToken = async (userID) => {
  const db = getFirestore();
  const userRef = doc(db, 'DB01', 'Credentials', 'USERS', userID);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data().pushToken;
  } else {
    console.error('User not found');
    return null;
  }
};

export const sendPushNotification = async (expoPushToken, messageData) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: messageData.title,
    body: messageData.body,
    data: messageData.data,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

