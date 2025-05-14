import {create} from 'zustand';

// Define the type for the store
interface WebsocketClientStore {
    clientId: string | null;
    setClientId: (clientId: string | null) => void;
}

// Check for local storage and set initial state
const clientId = window.localStorage.getItem('WsClientId');

// Create the store
const useWebsocketClientStore = create<WebsocketClientStore>((set) => ({
    clientId: clientId ? clientId : null,
    setClientId: (clientId) => set({clientId}),
}));

export default useWebsocketClientStore;