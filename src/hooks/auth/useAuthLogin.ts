import { IUsersDetails } from "../../interfaces/shared";
import useMutationDatum from "../useMutationDatum";

const useAuthLogin = () => {
    const endpoint = "/auth/login";
  
    return useMutationDatum<string>(endpoint);
  };
  
const useAuthRegister = () => {
  const endpoint = "/users";

  return useMutationDatum<IUsersDetails>(endpoint);
};
  
export {
  useAuthLogin,
  useAuthRegister
};