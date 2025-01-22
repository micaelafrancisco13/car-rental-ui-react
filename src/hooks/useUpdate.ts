import { IBooking } from "../interfaces/shared";
import useMutationPatch from "./useMutationPatch";

const patchBookingStatus = () => {
  return useMutationPatch<IBooking>("/bookings");
};

export {
    patchBookingStatus
};
