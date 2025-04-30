import { RouteObject } from "react-router-dom";
import { Home } from "./components";
import { RootOutlet } from "@app/components/outlet";

const ROUTES: RouteObject[] = [
	{
		path: '/',
		element: <RootOutlet isRootContent={false} showWhileAuthenticated={false} failedAuthPath="/editor"  />,
		children: [
			{ index: true, element: <Home /> },
		]
	}
]

export default ROUTES;