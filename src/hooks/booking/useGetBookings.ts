import { AxiosRequestConfig } from "axios";
import { IBooking } from "../../interfaces/shared";
import apiClient from "../../services/api-client";
import { useQuery } from "@tanstack/react-query";
import useBookingStore from "../../stores/useBookings";

const useGetBookings = () => {
  // const {query} = useBookingStore();
  const query = ""
  let endpoint = "/bookings";

  if (query) {
    endpoint += `?${query}`
  }
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

const useMyBookings = () => {
  // const {query} = useBookingStore();
  let endpoint = "/bookings/my";

  const queryKey = ["bookings"];
  const requestConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `${localStorage.getItem("authToken")}`,
    },
  };

  const setMyBookings = useBookingStore((state) => state.setMyBookings);
  return useQuery({queryKey, 
	queryFn: async () => {
    const { data } = await apiClient.get<IBooking[]>(endpoint, requestConfig);
    setMyBookings(data);
  }});
};
export { 
  useGetBookings,
  useMyBookings
};
