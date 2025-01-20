import useMutationDatum from "../useMutationDatum";
import { IVehicle } from "../../interfaces/shared";

const useUpdateUser = () => {
  return useMutationDatum<IVehicle[]>("/users/update");
};

export default useUpdateUser;
