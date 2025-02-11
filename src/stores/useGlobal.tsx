import { create } from "zustand";

interface GlobalStore {
    isOpen: boolean;
    open: boolean;
    openDetails: boolean;
    activeReport: string;
    toggleView: () => void;
    toggleModal: () => void;
    toggleConfirmation: () => void
    toggleActiveReport: (active: string) => void
  }

export const useGlobalStore = create<GlobalStore>((set) => ({
    isOpen: false,
    open: false,
    openDetails: false,
    activeReport: "vehicles",
    toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
    toggleConfirmation: () => set((state) => ({ open: !state.open })),
    toggleView: () => set((state) => ({ openDetails: !state.openDetails })),
    toggleActiveReport: (active) => set(() => ({ activeReport: active })),
}));