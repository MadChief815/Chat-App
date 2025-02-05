import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Function to find a user by email and return FullName
export const findUserDataByEmail = async (email) => {
  try {

    const q = query(
      collection(db, "DB01", "Credentials", "USERS"),
      where("Email", "==", email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    let userData = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      userData = {
        userName: data.UserName || null,
        fullName: data.FullName || null,
        firstName: data.FirstName || null,
        lastName: data.LastName || null,
        userID: data.UserID || null,
        useremail: data.Email || null,
        userpassword: data.Password || null,
      };
    });

    if (userData) {
      return userData;
    } else {
      throw new Error("Required user data fields not found in the document");
    }
  } catch (error) {
    console.error("Error finding user data by email:", error);
    throw error;
  }
};