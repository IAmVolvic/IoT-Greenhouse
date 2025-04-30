import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@store/Authentication/auth.store";

interface ProtectedComponentProps {
	showWhileAuthenticated: boolean;
	redirect: string;
	children: React.ReactNode;
}

export const ProtectedComponent = ({ showWhileAuthenticated, redirect, children }: ProtectedComponentProps) => {
	const { isLoggedIn, user } = useAuthStore();
	const navigate = useNavigate();

	const unauthorized = showWhileAuthenticated ? !isLoggedIn : !!user;

	useEffect(() => {
		if (unauthorized) {
			navigate(redirect, { replace: true });
		}
	}, [unauthorized, navigate, redirect]);

	return children;
};