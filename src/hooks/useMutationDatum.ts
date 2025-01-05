import { AxiosRequestConfig } from "axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import apiClient from "../services/api-client.ts";

const saveToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

const useMutationDatum = <T>(
    endpoint: string,
    requestConfig?: AxiosRequestConfig,
    options?: UseMutationOptions<T, Error, any>
  ) => {
    const mutation = useMutation<T, Error, any>({
      mutationFn: (data) =>
        apiClient
          .post(endpoint, data, requestConfig)
          .then((res) => {
            if (res.data) {
              saveToken(res.data); 
            }
            return res.data;
          }),
      ...options,
    });
  
    return mutation;
  };

export default useMutationDatum;