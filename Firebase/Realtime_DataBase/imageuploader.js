import * as ImagePicker from 'expo-image-picker';
import { ref, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useProfileStore } from '../../Src/ZustandStore';

export async function uploadImage(userID) {
  try {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true, 
      aspect: [1, 1],
      base64: true, 
    });

    if (!result.canceled) {
      const imageBase64 = result.assets[0].base64;
      const imageRef = ref(database, `${userID}/profilePicture`);

      // Upload image to Firebase
      await set(imageRef, imageBase64);
      console.log('Image uploaded to Realtime Database!');

      // Save to Zustand store
      useProfileStore.getState().setProfilePicture(imageBase64);
      console.log('Image saved to Zustand store');
    } else {
      console.log('Image selection was canceled.');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};