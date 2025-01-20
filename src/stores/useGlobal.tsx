import { create } from "zustand";

interface GlobalStore {
    isOpen: boolean;
    toggleModal: () => void;
  }

export const useGlobalStore = create<GlobalStore>((set) => ({
    isOpen: false,
    toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
}));