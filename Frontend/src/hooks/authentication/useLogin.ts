import { useCookies } from 'react-cookie';
import { Api, UserLoginDto } from '@Api';
import { ErrorToast } from '@components/errorToast';
import useAuthStore from '@store/Authentication/auth.store';

export const useLogin = (data: UserLoginDto) => {
	const api = new Api();
	const [, setCookie] = useCookies(['Authentication']);
	const { setUser, setIsLoggedIn } = useAuthStore();

	const login = () => {
		api.auth.userLoginCreate(data).then((res) => { 
			setCookie('Authentication', res.data.jwtToken, { path: '/', expires: new Date(Date.now() + 1000*60*60*24*7) });

			api.auth.userList({
				withCredentials: true
			}).then((res) => {
				setUser(res.data);
				setIsLoggedIn(true);
				window.localStorage.setItem('user', JSON.stringify(res.data));
			}
			).catch((err) => {
				ErrorToast(err);
			});
		}).catch((err) => {
			ErrorToast(err);
		});
	};

	return login;
};