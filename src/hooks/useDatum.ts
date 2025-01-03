import { AxiosRequestConfig } from "axios";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import apiClient from "../services/api-client.ts";

const useDatum = <T>(
	queryKey: (string | Record<string, never>)[], // Allow mixed types
	endpoint: string,
	requestConfig?: AxiosRequestConfig,
	options?: UseQueryOptions<T, Error>
) => {
	return useQuery<T>({
		queryKey,
		queryFn: () =>
			apiClient
				.get(endpoint, requestConfig)
				.then((res) => res.data), // Ensure res.data is the object, not an array
		...options,
	});
};

export default useDatum;
