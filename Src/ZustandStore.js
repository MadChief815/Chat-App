import { create } from 'zustand';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create((set) => ({
    // Authentication
    auth: {
        user: null,
        initializeAuth: () => {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                set((state) => ({ auth: { ...state.auth, user: currentUser } }));
            });
            return unsubscribe;
        },
        logout: async () => {
            try {
                // Sign out from Firebase
                await signOut(auth);

                // Clear all Zustand states and AsyncStorage
                await AsyncStorage.multiRemove(['userLogged', 'userID', 'userName', 'profilePicture']);
                set((state) => ({
                    auth: { ...state.auth, user: null, logout: state.auth.logout },
                    userLogged: false,
                    userID: null,
                    userName: null,
                }));

                // Reset profile picture state
                useProfileStore.getState().clearProfilePicture();

                console.log('Zustand Profile Pic Removed');
            } catch (error) {
                console.error('Error signing out: ', error);
            }
        },

        clearProfilePicture: () => {
            AsyncStorage.removeItem('profilePicture');
            set({ profilePicture: null });
            console.log("Profile picture cleared from state and AsyncStorage");
        }
    },

    // User Logged Status
    userLogged: false,
    setUserLogged: async (userLogged) => {
        await AsyncStorage.setItem('userLogged', JSON.stringify(userLogged));
        set({ userLogged });
    },
    loadUserLogged: async () => {
        const storedUserLogged = await AsyncStorage.getItem('userLogged');
        const userLogged = storedUserLogged === 'true';
        set({ userLogged });
    },

    // Theme Changer
    darkTheme: false,
    setDarkTheme: async (darkTheme) => {
        try {
            await AsyncStorage.setItem('darkTheme', JSON.stringify(darkTheme));
            set({ darkTheme });
        } catch (error) {
            console.error('Failed to save the dark theme:', error);
        }
    },
    loadDarkTheme: async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('darkTheme');
            if (savedTheme !== null) {
                set({ darkTheme: JSON.parse(savedTheme) });
            }
        } catch (error) {
            console.error('Failed to load the dark theme:', error);
        }
    },

    // UserID of Logged User
    userID: null,
    setUserID: async (userID) => {
        if (userID) {
            await AsyncStorage.setItem('userID', userID);
        }
        set({ userID });
    },
    loadUserID: async () => {
        const userID = await AsyncStorage.getItem('userID');
        set({ userID });
    },

    // UserName of Logged User
    userName: null,
    setUserName: async (userName) => {
        if (userName) {
            await AsyncStorage.setItem('userName', userName);
        }
        set({ userName });
    },
    loadUserName: async () => {
        const userName = await AsyncStorage.getItem('userName');
        set({ userName });
    },

    // FullName of Logged User
    fullName: null,
    setFullName: async (fullName) => {
        if (fullName) {
            await AsyncStorage.setItem('fullName', fullName);
        }
        set({ fullName });
    },
    loadFullName: async () => {
        const fullName = await AsyncStorage.getItem('fullName');
        set({ fullName });
    },

    // FirstName of Logged User
    firstName: null,
    setFirstName: async (firstName) => {
        if (firstName) {
            await AsyncStorage.setItem('firstName', firstName);
        }
        set({ firstName });
    },
    loadFirstName: async () => {
        const firstName = await AsyncStorage.getItem('firstName');
        set({ firstName });
    },

    // LastName of Logged User
    lastName: null,
    setLastName: async (lastName) => {
        if (lastName) {
            await AsyncStorage.setItem('lastName', lastName);
        }
        set({ lastName });
    },
    loadLastName: async () => {
        const lastName = await AsyncStorage.getItem('lastName');
        set({ lastName });
    },

    // Email of Logged User
    userEmail: null,
    setUserEmail: async (userEmail) => {
        if (userEmail) {
            await AsyncStorage.setItem('userEmail', userEmail);
        }
        set({ userEmail });
    },
    loadUserEmail: async () => {
        const userEmail = await AsyncStorage.getItem('userEmail');
        set({ userEmail });
    },

    // Password of Logged User
    userPassword: null,
    setUserPassword: async (userPassword) => {
        if (userPassword) {
            await AsyncStorage.setItem('userPassword', userPassword);
        }
        set({ userPassword });
    },
    loadUserPassword: async () => {
        const userPassword = await AsyncStorage.getItem('userPassword');
        set({ userPassword });
    },

    // Chat List
    users: [],
    setUsers: async (newUsers) => {
        await AsyncStorage.setItem('users', JSON.stringify(newUsers));
        set({ users: newUsers });
      },
      loadUsers: async () => {
        const users = await AsyncStorage.getItem('users');
        if (users) {
          set({ users: JSON.parse(users) });
        }
      },
}));

// Separate store for profile picture
export const useProfileStore = create((set) => ({
    profilePicture: null,
    setProfilePicture: (imageBase64) => set({ profilePicture: imageBase64 }),
    loadProfilePicture: async () => {
        const savedImage = await AsyncStorage.getItem('profilePicture');
        if (savedImage) {
            set({ profilePicture: savedImage });
            console.log("Profile Picture is loaded")
        }
    },
    clearProfilePicture: () => {
        AsyncStorage.removeItem('profilePicture');
        set({ profilePicture: null });
        console.log("Profile picture cleared from state and AsyncStorage");
    },
}));

// Chat List
export const useChatStore = create((set) => ({
    sortedAndFilteredUsers: [],
    setSortedAndFilteredUsers: (users) => set({ sortedAndFilteredUsers: users }),
}));

export default useStore;
