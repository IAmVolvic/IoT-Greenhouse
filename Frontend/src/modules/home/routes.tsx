import { RouteObject } from "react-router-dom";
import { Home } from "./components";

const ROUTES: RouteObject[] = [
	{
		path: '/',
		element: <Home />,
	}
]

export default ROUTES;