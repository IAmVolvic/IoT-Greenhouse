import { RouteObject } from "react-router-dom";
import { ErrorPage } from "./components";
import { RootOutlet } from "@app/components/outlet";

const ROUTES: RouteObject[] = [
	{
		element: <RootOutlet isProtected={false} />,
		children: [
			{
				path: '*',
				element:  <ErrorPage />
			}
		]
	}
]

export default ROUTES;

