import { StrictMode } from "react";
import ReactDOM from 'react-dom/client';
import {WsClientProvider} from "ws-request-hook";
import App from "@app/App";

import "@assets/css/index.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <WsClientProvider url={`${import.meta.env.VITE_API_URL}`}>
          <App />
        </WsClientProvider>
    </StrictMode>
)