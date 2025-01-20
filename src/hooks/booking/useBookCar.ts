import useMutationDatum from "../useMutationDatum";
import { IBooking } from "../../interfaces/shared";

const useBookCar = () => {
  return useMutationDatum<IBooking[]>("/bookings");
};

export default useBookCar;
