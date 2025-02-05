import { getDatabase, ref, get } from "firebase/database";

export const getProfilePicture = async (userID) => {
    const db = getDatabase();
    const profilePicRef = ref(db, `${userID}/profilePicture`);

    try {
        const snapshot = await get(profilePicRef);
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error("Error fetching profile picture:", error);
        return null;
    }
};
