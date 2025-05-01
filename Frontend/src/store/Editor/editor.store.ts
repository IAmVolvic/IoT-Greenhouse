import {create} from 'zustand';

// Define the type for the store
interface EditorStore {
    selectedGH: string | null;
    setSelectedGH: (selectedGH: string | null) => void;
}

// Create the store
const useEditorStore = create<EditorStore>((set) => ({
    selectedGH: null,
    setSelectedGH: (gh) => set({ selectedGH: gh }),
}));

export default useEditorStore;