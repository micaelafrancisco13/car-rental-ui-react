import { IBooking } from "../../interfaces/shared";
import useBookingStore from "../../stores/useBookings";
import usePatchData from "../usePatchData";

const useUpdateBookings = () => {
  const { selectedBooking } = useBookingStore();

  return usePatchData<IBooking>(`/bookings/${selectedBooking?.id || ""}`);
};

export default useUpdateBookings;
