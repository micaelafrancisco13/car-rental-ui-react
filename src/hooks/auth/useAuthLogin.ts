import useMutationDatum from "../useMutationDatum";

const useAuthLogin = () => {
    const endpoint = "/auth/login";
  
    return useMutationDatum<string>(endpoint);
  };
  
  const useAuthRegister = () => {
    const endpoint = "/auth/register";
  
    return useMutationDatum<string>(endpoint);
  };
  
export {
  useAuthLogin,
  useAuthRegister
};