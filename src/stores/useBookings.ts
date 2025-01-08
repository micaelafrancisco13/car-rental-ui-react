import { create } from 'zustand';
import { IBooking } from '../interfaces/shared';

interface BookingStore {
    bookings: IBooking[];
    track: IBooking | null;

    currentPage: number;
    itemsPerPage: number;
    paginated: IBooking[];


    setBookings: (bookings: IBooking[]) => void;
    setBooking: (booking: IBooking) => void;

    requestBooking: (booking: IBooking) => void;

    setPage: (page: number) => void;
    setItemsPerPage: (itemsPerPage: number) => void;
    getPaginatedBookings: () => IBooking[];
    setPaginatedBookings: () => void
}

const useBookingStore = create<BookingStore>((set, get) => ({
    bookings: [],
    track: null,

    currentPage: 1,
    itemsPerPage: 10,
    paginated: [],

    setBookings: (bookings) => set(() => ({ bookings})),
    setBooking: (track) => set(() => ({ track })),

    requestBooking: (booking) => set((state) => ({ 
        bookings: [...state.bookings, booking],
    })),

    setPage: (page) => set(() => ({ currentPage: page })),
    setItemsPerPage: (itemsPerPage) => set(() => ({ itemsPerPage })),
    
    getPaginatedBookings: () => {
      const { bookings, currentPage, itemsPerPage } = get();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      return bookings.slice(startIndex, endIndex);
    },
    
    setPaginatedBookings: () => {
      set(() => ({ paginated: get().getPaginatedBookings() }));
    },
}))

export default useBookingStore;