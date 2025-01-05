import useMutationDatum from "../useMutationDatum";

interface IUserAuth {
    email: string
    password: string
}

const useAuthLogin = () => {
    const endpoint = "/auth/login";
  
    return useMutationDatum<IUserAuth>(endpoint);
  };
  
  export default useAuthLogin;