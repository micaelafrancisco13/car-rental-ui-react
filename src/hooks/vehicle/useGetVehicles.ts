import { AxiosRequestConfig } from "axios";
import useDatum from "../useDatum.ts"

export interface IVechiles {
	id: string,
	make: string,
	model: string,
	year: string,
	licensePlate: string,
	dailyRate: number,

}

const useGetVehicles = () => {
	const endpoint = "/vehicles"
	const queryKey = ["vehicles"]
	const requestConfig: AxiosRequestConfig = {
		headers: {
		  Authorization: `${localStorage.getItem("authToken")}`,
		},
	  };
	return useDatum<IVechiles[]>(queryKey, endpoint, requestConfig)
}

export default useGetVehicles
