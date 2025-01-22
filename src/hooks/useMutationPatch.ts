import { AxiosRequestConfig } from "axios"; 
import { useMutation, UseMutationOptions } from "@tanstack/react-query"; 
import apiClient from "../services/api-client.ts"; 

const useMutationPatch = <T>(
    endpoint: string, 
    requestConfig?: AxiosRequestConfig, 
    options?: UseMutationOptions<T, Error, any> 
) => { 
    const mutation = useMutation<T, Error, { id: string | number; data: any, name?: string }>({
        mutationFn: ({ id, data, name }) =>
          apiClient
            .patch(`${endpoint}/${id}${name ? `/${name}` : ''}`, data, requestConfig)
            .then((res) => res.data),
        ...options,
      });
    
    return mutation; }; 

export default useMutationPatch;