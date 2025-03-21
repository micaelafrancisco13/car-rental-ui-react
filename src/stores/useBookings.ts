import { create } from 'zustand';
import { IBooking, IUsersDetails } from '../interfaces/shared';
import { jwtDecode } from 'jwt-decode';

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
    searchQuery: string;
    sortBy: string;
    sortOrder: string;

    setMyBookings: (bookings: IBooking[]) => void;
    setBookings: (bookings: IBooking[]) => void;
    setBooking: (booking: IBooking) => void;
    setBookingDetails: (booking: IBooking | null) => void
    setSearchQuery: (query: string) => void
    updateBalance: (id: string, balance: number) => void
    setSort: (sortBy:string, sortOrder: string) => void
    filterBooking: (status: string, paymentStatus: string) => void

    requestBooking: (booking: IBooking) => void;

    setPage: (page: number) => void;
    setItemsPerPage: (itemsPerPage: number) => void;
    getPaginatedBookings: () => IBooking[];
    setPaginatedBookings: () => void
}

const role = localStorage.getItem("role") || ""
const token = localStorage.getItem("authToken") || ""

const decode:IUsersDetails = token ? jwtDecode(token) : {
  createdAt:"",
  email:"",
  firstName:"",
  id:"",
  lastName:"",
  phoneNumber:"",
  role:"",
  updatedAt:"",
  city:"",
  otherAddress:"",
  validIdNumber:"",
  validIdType:"",
}

const useBookingStore = create<BookingStore>((set, get) => ({
    bookings: [],

    filteredBookings:[],
    selectedBooking: null,
    track: null,

    inProgressBookings: null,
    cancelledBookings: [],
    completedBookings: [],

    searchQuery: "",
    sortBy: "",
    sortOrder: "",

    setSearchQuery: (query) => {
      const { filteredBookings } = get();
      set((state) => {

        if (!query) {
          return {
            searchQuery: "", 
            paginated: filteredBookings
          }
        }
        const filtered = filteredBookings.filter((booking) =>
          booking.booker.firstName.toLowerCase().includes(query.toLowerCase()) ||
        booking.booker.lastName.toLowerCase().includes(query.toLowerCase()) ||
        booking.vehicle?.licensePlate.toLowerCase().includes(query.toLowerCase()) ||
        booking.booker.email.toLowerCase().includes(query.toLowerCase()) ||
        booking.vehicle?.make.toLowerCase().includes(query.toLowerCase()) ||
        booking.vehicle?.model.toLowerCase().includes(query.toLowerCase()) || 
        booking.vehicle?.type?.toLowerCase().includes(query.toLowerCase())
        );
        return { 
          searchQuery: query, 
          currentPage: 1, // Reset to first page when searching
          paginated: filtered.slice(0, state.itemsPerPage)
        };
    })
    },
    filterBooking: (status, paymentStatus) => {
      const { bookings, currentPage, itemsPerPage } = get();
      const filteredBookings = bookings.filter((booking) => {
        const matchesStatus = !status || booking.status === status;
        const matchesPaymentStatus = !paymentStatus || booking.paymentStatus === paymentStatus; 
        const matchesBooker = role !== "booker" || booking.bookerId === decode.id; 

        return matchesStatus && matchesPaymentStatus && matchesBooker;
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
    setBookings: (bookings) => {
      const filteredBookings = bookings.filter((booking) => {
        const matchesBooker = role !== "booker" || booking.bookerId === decode.id; 

        return  matchesBooker;
      });
      set(() => ({ bookings, filteredBookings}))
    },
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
      const { filteredBookings, currentPage, itemsPerPage, } = get();
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      return filteredBookings.slice(startIndex, endIndex);
    },
    
  setSort: (sortBy, order) =>{
    
    const { filteredBookings } = get();
    
    filteredBookings.sort((a, b) => {
      let valueA, valueB;
      switch (sortBy) {
        case 'Vehicle':
          valueA = a.vehicle?.make.toLowerCase() || "";
          valueB = b.vehicle?.make.toLowerCase() || "";
          break;
        case 'Booker':
          valueA = a.booker.firstName.toLowerCase() || "";
          valueB = b.booker.firstName.toLowerCase() || "";
          break;
        case 'type':
          valueA = (a.type || '').toLowerCase();
          valueB = (b.type || '').toLowerCase();
          break;
        case 'date':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
    });
    set(() => ({
      sortBy: sortBy,
      sortOrder: order,
      paginated: filteredBookings
    }));
  },

    setPaginatedBookings: () => {
      set(() => ({ paginated: get().getPaginatedBookings() }));
    },
}))

export default useBookingStore;