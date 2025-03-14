import { AxiosRequestConfig } from "axios";
import { IBooking, ITripHistory } from "../../interfaces/shared";
import apiClient from "../../services/api-client";
import { useQuery } from "@tanstack/react-query";
import useBookingStore from "../../stores/useBookings";
import useDashboardStore from "../../stores/useDashboard";
import useVehicleStore from "../../stores/useVehicles";
import useHistoryStore from "../../stores/useHistory";

const useGetBookings = (customQuery?: string) => {
  let endpoint = "/bookings";

  if (customQuery) {
    endpoint += `?${customQuery}`
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

  const queryKey = ["mybookings"];
  const requestConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `${localStorage.getItem("authToken")}`,
    },
  };
  const {
    setVehicle
  } = useVehicleStore()

  const setMyBookings = useBookingStore((state) => state.setMyBookings);

  return useQuery({queryKey, 
	queryFn: async () => {
    const { data } = await apiClient.get<IBooking[]>(endpoint, requestConfig);
    setMyBookings(data);
    const inprogressData = data.filter(item => item.status == "IN_PROGRESS")
    if (inprogressData.length && inprogressData[0].vehicle) {
      setVehicle(inprogressData[0].vehicle)
    }
    return data
  },
});
};

const useGetBookingDetails = (id: string) => {
    let endpoint = `/bookings/${id}`;

    const queryKey = ["booking", id];
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `${localStorage.getItem("authToken")}`,
      },
    };
  
    const setBookingDetails = useBookingStore((state) => state.setBookingDetails);
    const { setVehicle } = useVehicleStore()
    return useQuery({queryKey, 
    queryFn: async () => {
      if (!id) return
      const { data } = await apiClient.get<IBooking[]>(endpoint, requestConfig);
      if (data.length){
        setBookingDetails(data[0]);
        data[0].vehicle && setVehicle(data[0].vehicle)
      }
      return data
    },
    enabled: !!id,
  });
}

const useBookingHistory = (id: string) => {
  let endpoint = `/history/${id}`;

    const queryKey = ["hisotry", id];
    const requestConfig: AxiosRequestConfig = {
      headers: {
        Authorization: `${localStorage.getItem("authToken")}`,
      },
    };
  
    const setHistory = useHistoryStore((state) => state.setHistory);
    return useQuery({queryKey, 
    queryFn: async () => {
      if (!id) return
      const { data } = await apiClient.get<ITripHistory[]>(endpoint, requestConfig);
      if (data.length){
        setHistory(data);
      }
      return data
    },
    enabled: !!id,
  });
}


const useGetDashboard = (fromDate?: string, toDate?: string) => {
  let endpoint = "/bookings/dashboard";
  if (fromDate || toDate) {
    endpoint += `?fromDate=${fromDate}&toDate=${toDate}`;
  }

  const queryKey = ["bookings", fromDate, toDate];
  const requestConfig: AxiosRequestConfig = {
    headers: {
      Authorization: `${localStorage.getItem("authToken")}`,
    },
  };

  const setCount = useDashboardStore((state) => state.setDashboardCount);
  return useQuery({queryKey, 
	queryFn: async () => {
    const { data } = await apiClient.get<IBooking[]>(endpoint, requestConfig);
    setCount(data);
  }});
};

export { 
  useGetBookings,
  useMyBookings,
  useGetDashboard,
  useGetBookingDetails,
  useBookingHistory
};
