import useMutationDatum from "../useMutationDatum";
import { IUsersDetails } from "../../interfaces/shared";

const useAddUser = () => {
  return useMutationDatum<IUsersDetails[]>("/users");
};

const changePassword = () => {
  return useMutationDatum<IUsersDetails[]>("/auth/change-password");
};

export {
  useAddUser, 
  changePassword
};
