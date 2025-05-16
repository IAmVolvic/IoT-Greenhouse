import useAuthStore from '@store/Authentication/auth.store';
import { useCookies } from 'react-cookie';

export const useLogout = () => {
	const [, setCookie] = useCookies(['Authentication']);
	const { setUser, setIsLoggedIn } = useAuthStore();

	const logout = () => {
		setCookie('Authentication', '', { path: '/', expires: new Date(0) });
		window.localStorage.removeItem('user');
		window.localStorage.removeItem('WsClientId');
		setUser(null);
		setIsLoggedIn(false);
	};

	return logout;
};