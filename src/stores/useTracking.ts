// store.ts
import {create} from 'zustand';

interface Location {
  bookingId: string;
  latitude: number;
  longitude: number;
  speed: number;
}

interface TrackingState {
  locations: Record<string, Location>;
  updateLocation: (location: Location) => void;
}

export const useTrackingStore = create<TrackingState>((set) => ({
  locations: {},
  updateLocation: (location) => set((state) => ({
    locations: {
      ...state.locations,
      [location.bookingId]: location
    }
  }))
}));