import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@Api";
import { AuthorizedUserResponseDto } from "@Api";
import useAuthStore from "@store/Authentication/auth.store";

const API = new Api();

const LOCAL_STORAGE_KEY_USER = "user";
const LOCAL_STORAGE_KEY_WS = "WsClientId"

const saveUserToLocalStorage = (user: AuthorizedUserResponseDto | null) => {
    if (user) {
        window.localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    } else {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    }
};

export const useAuth = () => {
    const { user, isLoggedIn, setUser, setIsLoggedIn } = useAuthStore();

    const { refetch, isFetching, data, isSuccess, isError } = useQuery({
        queryKey: ["auth-user"],
        
        queryFn: async () => {
            const res = await API.auth.userList({
                withCredentials: true
            });
            return res.data;
        },
        // Refetch the user data every 5 minutes
        refetchInterval: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: false,
        enabled: isLoggedIn,
    });

    // Handle success response
    useEffect(() => {
        if (isSuccess && data && !isFetching) {
            setUser(data);
            setIsLoggedIn(true);
            saveUserToLocalStorage(data);
        }
    }, [isSuccess, data, setUser, setIsLoggedIn, isFetching]);

    // Handle error response
    useEffect(() => {
        if (isError && !isFetching) {
            setUser(null);
            setIsLoggedIn(false);
            saveUserToLocalStorage(null);
            window.localStorage.removeItem(LOCAL_STORAGE_KEY_WS);
        }
    }, [isError, setUser, setIsLoggedIn, isFetching]);

    useEffect(() => {
        // Keep Zustand store in sync with localStorage at mount
        const localUser = window.localStorage.getItem(LOCAL_STORAGE_KEY_USER);
        if (localUser) {
            try {
                const parsedUser = JSON.parse(localUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch {
                // malformed localStorage, clear it
                setUser(null);
                setIsLoggedIn(false);
                saveUserToLocalStorage(null);
                window.localStorage.removeItem(LOCAL_STORAGE_KEY_WS);
            }
        }
    }, [setUser, setIsLoggedIn]);

    return {
        user,
        isLoggedIn,
        refresh: refetch,
        loading: isFetching,
    };
};