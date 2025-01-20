import useMutationDatum from "../useMutationDatum";
import { IVehicle } from "../../interfaces/shared";

const useUpdateVehicle = () => {
  return useMutationDatum<IVehicle[]>("/vehicles/update");
};

export default useUpdateVehicle;
