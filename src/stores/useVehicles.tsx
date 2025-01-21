import { create } from 'zustand';
import { IVehicle } from '../interfaces/shared';

interface VehicleStore {
  vehicles: IVehicle[];
  selectedVehicle: IVehicle | null;
  currentPage: number;
  itemsPerPage: number;
  paginatedVehicles: IVehicle[];

  setVehicles: (vehicles: IVehicle[]) => void;
  setVehicle: (vehicle: IVehicle | null) => void;
  addVehicle: (vehicle: IVehicle) => void;
  addVehicles: (vehicle: IVehicle[]) => void;
  updateVehicle: (id: string, updatedVehicle: Partial<IVehicle>) => void; // Partial allows updating only some fields
  updateStatus: (id: string, status: string) => void;
  removeVehicle: (id: string) => void;

  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  getPaginatedVehicles: () => IVehicle[];
  setPaginatedVehicles: () => void
}

const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  selectedVehicle: null,

  currentPage: 1, // Default to the first page
  itemsPerPage: 10, // Default to 10 items per page
  paginatedVehicles: [],

  setVehicles: (vehicles) => set(() => ({ vehicles })),
  setVehicle: (selectedVehicle) => set(() => ({ selectedVehicle: selectedVehicle })),
  addVehicle: (vehicle) => set((state) => ({
    vehicles: [...state.vehicles, vehicle],
  })),
  addVehicles: (vehicles) => set((state) => ({
    vehicles: [...state.vehicles, ...vehicles],
  })),
  updateVehicle: (id, updatedVehicle) =>
    set((state) => ({
      vehicles: state.vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
      ),
    })),
  
  updateStatus: (id, status) => set(
    (state) => ({
      vehicles: state.vehicles.map((vehicle) => 
        vehicle.id === id ? { ...vehicle, availableStatus: status } : vehicle
      ),
    })),

    removeVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
    })),
    setPage: (page) => set(() => ({ currentPage: page })),
  setItemsPerPage: (itemsPerPage) => set(() => ({ itemsPerPage })),
  
  getPaginatedVehicles: () => {
    const { vehicles, currentPage, itemsPerPage } = get();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return vehicles.slice(startIndex, endIndex);
  },
  
  setPaginatedVehicles: () => {
    set(() => ({ paginatedVehicles: get().getPaginatedVehicles() }));
  },
}));

export default useVehicleStore;
