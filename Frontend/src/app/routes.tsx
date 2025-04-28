import { RouteObject } from "react-router-dom";

import HomeRoutes from "@modules/home/routes";
import EditorRoutes from "@modules/editor/routes";
import LoginRoutes from "@modules/login/routes";
import ErrorsRoutes from "@modules/errors/routes";


const ROUTES: RouteObject[] = [
	...HomeRoutes,
	...EditorRoutes,
	...LoginRoutes,
	...ErrorsRoutes,
]

export default ROUTES;