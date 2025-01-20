import useMutationDatum from "../useMutationDatum";

interface IAuth {
  token: string
  role: string
}

const useAuthLogin = () => {
    const endpoint = "/auth/login";
  
    return useMutationDatum<IAuth>(endpoint);
  };
  
const useAuthRegister = () => {
  const endpoint = "/auth/register";

  return useMutationDatum<IAuth>(endpoint);
};
  
export {
  useAuthLogin,
  useAuthRegister
};