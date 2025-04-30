// store/loadingStore.ts
import {create} from 'zustand';

// Define the type for the store
interface LoadingStore {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

// Create the store
const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export default useLoadingStore;