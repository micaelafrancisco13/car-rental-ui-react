import { AxiosRequestConfig } from "axios"
import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import apiClient from "../services/api-client.ts"

const useData = <T>(
	queryKey: (string | Record<string, never>)[], // Allow mixed types
	endpoint: string,
	requestConfig?: AxiosRequestConfig,
	options?: UseQueryOptions<T, Error, T[]>
) => {
	return useQuery({
		queryKey,
		queryFn: () =>
			apiClient
				.get(endpoint, requestConfig)
				.then((res) => res.data),
		...options
	})
}

export default useData