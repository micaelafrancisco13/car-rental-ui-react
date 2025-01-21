import { AxiosRequestConfig } from "axios"; 
import { useMutation, UseMutationOptions } from "@tanstack/react-query"; 
import apiClient from "../services/api-client.ts"; 

const useMutationDelete = <T>(
    endpoint: string, 
    requestConfig?: AxiosRequestConfig, 
    options?: UseMutationOptions<T, Error, any> 
) => { 
    const mutation = useMutation<T, Error, any>({ 
        mutationFn: (id: string | number) => apiClient 
        .delete(`${endpoint}/${id}`, requestConfig) 
        .then((res) => { return res.data; }), ...options, 
    }); return mutation; }; 

const useMutationDeleteQuery = <T>(
    endpoint: string,
    requestConfig?: AxiosRequestConfig,
    options?: UseMutationOptions<T, Error, any>
) => {
    const mutation = useMutation<T, Error, any>({
        mutationFn: (queryParams: Record<string, any>) =>
            apiClient
                .delete(endpoint, { ...requestConfig, params: queryParams })
                .then((res) => {
                    return res.data;
                }),
        ...options,
    });

    return mutation;
};


export {useMutationDelete, useMutationDeleteQuery};