import { AxiosRequestConfig } from "axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import apiClient from "../services/api-client.ts";

const usePatchData = <T>(
    endpoint: string,
    requestConfig?: AxiosRequestConfig,
    options?: UseMutationOptions<T, Error, any>
  ) => {
    const mutation = useMutation<T, Error, any>({
      mutationFn: (data) =>
        apiClient
          .patch(endpoint, data, requestConfig)
          .then((res) => {
            return res.data;
          }),
      ...options,
    });
  
    return mutation;
  };

export default usePatchData;