import { IVehicle } from "../../interfaces/shared";
import useVehicleStore from "../../stores/useVehicles";
import usePatchData from "../usePatchData";

const useUpdateStatus = () => {
  const { selectedVehicle } = useVehicleStore();
  return usePatchData<IVehicle>(`/vehicles/${selectedVehicle?.id || ""}/availability`);
};

export default useUpdateStatus;
