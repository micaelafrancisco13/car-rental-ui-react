import useMutationDatum from "../useMutationDatum";
import { IVehicle } from "../../interfaces/shared";

const useAddVehicle = () => {
  return useMutationDatum<IVehicle[]>("/vehicles");
};

export default useAddVehicle;
