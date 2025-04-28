// store/loadingStore.ts
import {create} from 'zustand';

// Define the type for the store
interface NavStore {
    isOpen: boolean;
    setIsOpen: (loading: boolean) => void;
}

// Create the store
const useNavStore = create<NavStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));

export default useNavStore;