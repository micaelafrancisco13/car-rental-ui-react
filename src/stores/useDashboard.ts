import { create } from 'zustand';

interface DashboardStore {
  vehicleCount: { [key: string]: number };
  bookingsCount: { [key: string]: number };
  bookingsPaymentCount: { [key: string]: number };
  formattedData: any,
  setDashboardCount: (count:any) => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  vehicleCount: {},
  bookingsCount:{},
  bookingsPaymentCount: {},
  formattedData: [],
  setDashboardCount: (count) => set(() => ({ 
    vehicleCount: count.vehicleCount.reduce(
      (acc: any, item: { availabilityStatus: string; _count: { id: number } }) => {
        acc[item.availabilityStatus] = item._count.id;
        return acc;
      },
      {}
    ),
    bookingsCount: count.bookingStatusCount.reduce(
      (acc: any, item: { status: string; _count: { id: number } }) => {
        acc[item.status] = item._count.id;
        return acc;
      },
      {}
    ),
    bookingsPaymentCount: count.bookingPaymentStatusCount.reduce(
      (acc: any, item: { paymentStatus: string; _count: { id: number } }) => {
        acc[item.paymentStatus] = item._count.id;
        return acc;
      },
      {}
    ),
    formattedData: count.formattedData,
  })),
}))

export default useDashboardStore;