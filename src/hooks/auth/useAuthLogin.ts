import useMutationDatum from "../useMutationDatum";

const useAuthLogin = () => {
    const endpoint = "/auth/login";
  
    return useMutationDatum<string>(endpoint);
  };
  
export default useAuthLogin;