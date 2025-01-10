import { AxiosRequestConfig } from "axios";
import { IBooking } from "../../interfaces/shared";
import apiClient from "../../services/api-client";
import { useQuery } from "@tanstack/react-query";
import useBookingStore from "../../stores/useBookings";

const useGetBookings = () => {
  const endpoint = "/bookings";
  const queryKey = ["bookings"];
  const requestConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `${localStorage.getItem("authToken")}`,
    },
  };

  const setBookings = useBookingStore((state) => state.setBookings);
  return useQuery({queryKey, 
	queryFn: async () => {
    const { data } = await apiClient.get<IBooking[]>(endpoint, requestConfig);
    setBookings(data);
  }});
};

export default useGetBookings;
