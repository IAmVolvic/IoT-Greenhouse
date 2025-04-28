import { RouteObject } from "react-router-dom";
import { LoginPage } from "./components";
import { RootOutlet } from "@app/components/outlet";

const ROUTES: RouteObject[] = [
	{
		path: '/login',
		element: <RootOutlet />,
		children: [
			{ index: true, element: <LoginPage /> },
		]
	}
]

export default ROUTES;