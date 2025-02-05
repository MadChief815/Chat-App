import { db } from '../firebaseConfig';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import useStore from '../../Src/ZustandStore';

// FireStore Add New User Data
export const addNewUserData = async (newUser, customId) => {
  try {
    const docRef = doc(db, "DB01", "Credentials", "USERS", customId);

    // Set the document with the user data
    await setDoc(docRef, newUser);

    return customId;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// FireStore Data Updater
export const dataUpdater = async (updatedFields) => {
  try {
    const { userID } = useStore.getState();
    const adRef = doc(db, "DB01", "Credentials", "USERS", userID);

    // Run the updates
    await updateDoc(adRef, updatedFields);

  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};