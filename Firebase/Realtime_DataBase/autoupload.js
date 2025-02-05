import { ref, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useProfileStore } from '../../Src/ZustandStore';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import UploadImage from "../../assets/Images/upload.png";

export async function uploadDefaultImage(userID) {
  try {
    // Preload the asset
    const asset = await Asset.fromModule(UploadImage).downloadAsync();

    // Get the file URI from the cached location
    const fileUri = asset.localUri || asset.uri;

    // Read the image as a base64 string
    const imageBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create a reference in the Realtime Database
    const imageRef = ref(database, `${userID}/profilePicture`);

    // Upload to Firebase
    await set(imageRef, imageBase64);
    console.log("Default image uploaded to Realtime Database!");

    // Save to Zustand
    useProfileStore.getState().setProfilePicture(imageBase64);
    console.log("Default image saved to Zustand store");
  } catch (error) {
    console.error("Error uploading default image:", error);
  }
};