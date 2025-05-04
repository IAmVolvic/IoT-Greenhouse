import { useCookies } from 'react-cookie';
import { Api, UserLoginDto } from '@Api';
import { ErrorToast } from '@components/errorToast';
import useAuthStore from '@store/Authentication/auth.store';

export const useLogin = (data: UserLoginDto) => {
	const api = new Api();
	const { setUser, setIsLoggedIn } = useAuthStore();

	const login = () => {
		api.auth.userLoginCreate(data, { withCredentials: true })
		.then(() => {
			return api.auth.userList({ withCredentials: true });
		})
		.then((res) => {
			setUser(res.data);
			setIsLoggedIn(true);
			window.localStorage.setItem('user', JSON.stringify(res.data));
		})
		.catch((err) => {
			ErrorToast(err);
		});
	};

	return login;
};