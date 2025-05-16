import useWebsocketClientStore from "@store/Websocket/clientid.store";
import ROUTES from "./routes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {WsClientProvider} from "ws-request-hook";

export const QUERY_CLIENT = new QueryClient();


const App = () => {
	const router = createBrowserRouter(ROUTES)
    const { clientId } = useWebsocketClientStore();

    return (
        <WsClientProvider url={`${import.meta.env.VITE_WS_URI}?id=${clientId ?? ''}`}>
            <QueryClientProvider client={QUERY_CLIENT}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </WsClientProvider>
    )
}

export default App;

