import ROUTES from "./routes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createBrowserRouter, RouterProvider } from "react-router-dom"


export const QUERY_CLIENT = new QueryClient();


const App = () => {
	const router = createBrowserRouter(ROUTES)
    return (
        <>
            <QueryClientProvider client={QUERY_CLIENT}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </>
    )
}

export default App;

