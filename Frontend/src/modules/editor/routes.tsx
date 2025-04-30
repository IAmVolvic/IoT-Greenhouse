import { RouteObject } from "react-router-dom";
import { EditorPage } from "./components";
import { RootOutlet } from "@app/components/outlet";

const ROUTES: RouteObject[] = [
	{
		path: '/editor',
		element: <RootOutlet isRootContent={false} showWhileAuthenticated={true} failedAuthPath={"/"}/>,
		children: [
			{ index: true, element: <EditorPage /> },
		]
	}
]

export default ROUTES;