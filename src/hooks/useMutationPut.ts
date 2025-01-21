import { AxiosRequestConfig } from "axios"; 
import { useMutation, UseMutationOptions } from "@tanstack/react-query"; 
import apiClient from "../services/api-client.ts"; 

const useMutationPut = <T>(
    endpoint: string, 
    requestConfig?: AxiosRequestConfig, 
    options?: UseMutationOptions<T, Error, any> 
) => { 
    const mutation = useMutation<T, Error, { id: string | number; data: any }>({
        mutationFn: ({ id, data }) =>
          apiClient
            .put(`${endpoint}/${id}`, data, requestConfig)
            .then((res) => res.data),
        ...options,
      });
    
    return mutation; }; 

export default useMutationPut;