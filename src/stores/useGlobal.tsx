import { create } from "zustand";

interface GlobalStore {
    isOpen: boolean;
    open: boolean;
    openDetails: boolean;
    toggleView: () => void;
    toggleModal: () => void;
    toggleConfirmation: () => void
  }

export const useGlobalStore = create<GlobalStore>((set) => ({
    isOpen: false,
    open: false,
    openDetails: false,
    toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
    toggleConfirmation: () => set((state) => ({ open: !state.open })),
    toggleView: () => set((state) => ({ openDetails: !state.openDetails })),
}));