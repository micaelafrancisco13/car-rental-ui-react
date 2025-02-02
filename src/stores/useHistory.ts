import { create } from 'zustand';
import { ITripHistory } from '../interfaces/shared';

interface HistoryStore {
    history: ITripHistory[];

    setHistory: (history: ITripHistory[]) => void;
}

const useHistoryStore = create<HistoryStore>((set) => ({
    history: [],

    setHistory: (history) => set(() => ({ history})),

}))

export default useHistoryStore;