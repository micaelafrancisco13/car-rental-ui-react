import useVehicleStore from "../../stores/useVehicles";
import { IVehicle } from "../../interfaces/shared";
import apiClient from "../../services/api-client";
import { useQuery } from "@tanstack/react-query";


const useGetVehicles = () => {
  const endpoint = "/vehicles";
  const queryKey = ["vehicles"];

  const setVehicles = useVehicleStore((state) => state.setVehicles);
  return useQuery({queryKey, 
	queryFn: async () => {
    const { data } = await apiClient.get<IVehicle[]>(endpoint);
    setVehicles(data);
    return data
  }});
};

export default useGetVehicles;
