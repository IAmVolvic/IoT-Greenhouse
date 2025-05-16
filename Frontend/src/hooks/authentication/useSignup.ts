import { Api, UserSignupDto } from '@Api';
import { ErrorToast } from '@components/errorToast';
import useAuthStore from '@store/Authentication/auth.store';
import useWebsocketClientStore from '@store/Websocket/clientid.store';

export const useSignup = (data: UserSignupDto) => {
	const api = new Api();
	const { setUser, setIsLoggedIn } = useAuthStore();
	const clientWsId = crypto.randomUUID();
	const { setClientId } = useWebsocketClientStore();
	
	const signup = () => {
		api.auth.userSignupCreate(data, { withCredentials: true })
		.then(() => {
			return api.auth.userList({ withCredentials: true });
		})
		.then((res) => {
			setUser(res.data);
			setIsLoggedIn(true);
			window.localStorage.setItem('user', JSON.stringify(res.data));

			setClientId(clientWsId);
			window.localStorage.setItem('WsClientId', clientWsId);
		})
		.catch((err) => {
			ErrorToast(err);
		});
	};

	return signup;
};