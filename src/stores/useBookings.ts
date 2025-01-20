import { create } from 'zustand';
import { IBooking } from '../interfaces/shared';

interface BookingStore {
    bookings: IBooking[];
    inProgressBookings: IBooking | null,
    cancelledBookings: IBooking[],
    completedBookings: IBooking[],
    track: IBooking | null;
    selectedBooker: IBooking | null,
    currentPage: number;
    itemsPerPage: number;
    paginated: IBooking[];

    setMyBookings: (bookings: IBooking[]) => void;
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
    selectedBooker: null,
    track: null,

    inProgressBookings: null,
    cancelledBookings: [],
    completedBookings: [],


    currentPage: 1,
    itemsPerPage: 10,
    paginated: [],

    setMyBookings: (bookings) => set(() => ({ 
      bookings,
      inProgressBookings: bookings.filter((item) => !["COMPLETED", "CANCELLED"].includes(item.status))[0],
      completedBookings: bookings.filter((item) => item.status == "COMPLETED"),
      cancelledBookings: bookings.filter((item) => item.status == "CANCELLED")
    })),
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