import { AxiosRequestConfig } from "axios";
import useDatum from "../useDatum.ts"

export interface IUsers {
	id: string,
	firstName: string,
	lastName: string,
	email: string,
	phoneNumber: string,
	role: "ADMIN" | "EMPLOYEE" | "BOOKER",
	createdAt: string,
	updatedAt: string,
}

const useGetUsers = () => {
	const endpoint = "/users"
	const queryKey = ["users"]
	const requestConfig: AxiosRequestConfig = {
		headers: {
		  Authorization: `${localStorage.getItem("authToken")}`,
		},
	  };
	return useDatum<IUsers[]>(queryKey, endpoint, requestConfig)
}

export default useGetUsers
