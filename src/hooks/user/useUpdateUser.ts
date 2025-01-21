import { IUsersDetails } from "../../interfaces/shared";
import useMutationPut from "../useMutationPut";

const useUpdateUser = () => {
  return useMutationPut<IUsersDetails>("/users");
};

export default useUpdateUser;
