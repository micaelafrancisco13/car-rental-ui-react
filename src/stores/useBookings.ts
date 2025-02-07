import { create } from 'zustand';
import { IBooking } from '../interfaces/shared';

interface BookingStore {
    bookings: IBooking[];
    filteredBookings: IBooking[];
    inProgressBookings: IBooking | null,
    cancelledBookings: IBooking[],
    completedBookings: IBooking[],
    track: IBooking | null;
    selectedBooking: IBooking | null,
    currentPage: number;
    itemsPerPage: number;
    paginated: IBooking[];

    setMyBookings: (bookings: IBooking[]) => void;
    setBookings: (bookings: IBooking[]) => void;
    setBooking: (booking: IBooking) => void;
    setBookingDetails: (booking: IBooking | null) => void

    updateBalance: (id: string, balance: number) => void

    filterBooking: (status: string, paymentStatus: string) => void

    requestBooking: (booking: IBooking) => void;

    setPage: (page: number) => void;
    setItemsPerPage: (itemsPerPage: number) => void;
    getPaginatedBookings: () => IBooking[];
    setPaginatedBookings: () => void
}

const useBookingStore = create<BookingStore>((set, get) => ({
    bookings: [],

    filteredBookings:[],
    selectedBooking: null,
    track: null,

    inProgressBookings: null,
    cancelledBookings: [],
    completedBookings: [],

    filterBooking: (status, paymentStatus) => {
      const { bookings, currentPage, itemsPerPage } = get();
      const filteredBookings = bookings.filter((booking) => {
        const matchesStatus = !status || booking.status === status;
        const matchesPaymentStatus = !paymentStatus || booking.paymentStatus === paymentStatus; 
        return matchesStatus && matchesPaymentStatus;
      });

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginated = filteredBookings.slice(startIndex, endIndex);
  
      set(() => ({ filteredBookings, paginated }));
    },

    currentPage: 1,
    itemsPerPage: 10,
    paginated: [],

    setMyBookings: (bookings) => set(() => ({ 
      bookings,
      inProgressBookings: bookings.filter((item) => !["COMPLETED", "CANCELLED"].includes(item.status))[0],
      completedBookings: bookings.filter((item) => item.status == "COMPLETED"),
      cancelledBookings: bookings.filter((item) => item.status == "CANCELLED")
    })),
    setBookings: (bookings) => set(() => ({ bookings, filteredBookings:bookings})),
    setBooking: (track) => set(() => ({ track })),
    setBookingDetails: (selectedBooking) => set(() => ({ selectedBooking })),

    updateBalance: (id, balance) => set(
      (state) => ({
        filteredBookings: state.filteredBookings.map((booking) => 
          booking.id === id ? { ...booking, balance: booking.balance - balance, paymentStatus: booking.balance - balance === 0 ? "PAID": booking.paymentStatus } : booking
        ),
      })),

    requestBooking: (booking) => set((state) => ({ 
        bookings: [...state.bookings, booking],
    })),

    setPage: (page) =>
      set((state) => {
        const { filteredBookings, itemsPerPage } = state;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = filteredBookings.slice(startIndex, endIndex);
        return { currentPage: page, paginated };
      }),
    setItemsPerPage: (itemsPerPage) =>
      set((state) => {
        const { currentPage, filteredBookings } = state;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = filteredBookings.slice(startIndex, endIndex);
        return { itemsPerPage, paginated };
      }),

    getPaginatedBookings: () => {
      const { filteredBookings, currentPage, itemsPerPage } = get();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredBookings.slice(startIndex, endIndex);
    },

    setPaginatedBookings: () => {
      set(() => ({ paginated: get().getPaginatedBookings() }));
    },
}))

export default useBookingStore;