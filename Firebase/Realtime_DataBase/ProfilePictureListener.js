import { useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useProfileStore } from '../../Src/ZustandStore';

export function useProfilePictureListener(userID) {
  const profilePicture = useProfileStore((state) => state.profilePicture);
  const loadProfilePicture = useProfileStore((state) => state.loadProfilePicture);
  const setProfilePicture = useProfileStore((state) => state.setProfilePicture);

  useEffect(() => {
    const imageRef = ref(database, `${userID}/profilePicture`);

    // Load profile picture if not already in Zustand
    if (!profilePicture) {
      loadProfilePicture();
    }

    // Listen for Firebase updates
    const unsubscribe = onValue(imageRef, (snapshot) => {
      if (snapshot.exists()) {
        const imageBase64 = snapshot.val();
        setProfilePicture(imageBase64);
      } else {
        setProfilePicture(null);
      }
    });

    return () => unsubscribe();
  }, [userID]);
}