import useMutationDatum from "../useMutationDatum";
import { IUsersDetails } from "../../interfaces/shared";

const useAddUser = () => {
  return useMutationDatum<IUsersDetails[]>("/users");
};

export default useAddUser;
