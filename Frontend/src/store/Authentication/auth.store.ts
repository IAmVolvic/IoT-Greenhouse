// store/loadingStore.ts
import { AuthorizedUserResponseDto } from '@Api';
import {create} from 'zustand';

// Define the type for the store
interface AuthStore {
	isLoggedIn: boolean;
	user: AuthorizedUserResponseDto | null;
	logoutPending: boolean;
	setIsLoggedIn: (loggedIn: boolean) => void;
	setUser: (user: AuthorizedUserResponseDto | null) => void;
	setLogoutPending: (val: boolean) => void;
}

// Check for local storage and set initial state
const localUser = window.localStorage.getItem('user');

// Create the store
const useAuthStore = create<AuthStore>((set) => ({
    isLoggedIn: (localUser !== null) && localUser !== undefined,
    user: localUser ? JSON.parse(localUser) : null,
    logoutPending: false,
    setIsLoggedIn: (loggedIn) => set({isLoggedIn: loggedIn}),
    setUser: (user) => set({user}),
    setLogoutPending: (val) => set({ logoutPending: val }),
}));

export default useAuthStore;