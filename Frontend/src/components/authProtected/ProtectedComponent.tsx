import { Navigate, To } from "react-router-dom";
import useAuthStore from "@store/Authentication/auth.store";

interface ProtectedComponentProps {
	showWhileAuthenticated: boolean;
	redirect: To;
	children: React.ReactNode;
}

export const ProtectedComponent = (props: ProtectedComponentProps) => {
	const { showWhileAuthenticated, redirect, children } = props;
	const { isLoggedIn, user } = useAuthStore();

	if (showWhileAuthenticated) {
		if (!isLoggedIn) {
			return <Navigate to={redirect} replace={true} />
		}
	} else {
		if (user) {
			return <Navigate to={redirect} replace={true} />
		}
	}

	return children;
}