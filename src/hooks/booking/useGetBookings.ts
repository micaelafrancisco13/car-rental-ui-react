import { AxiosRequestConfig } from "axios";
import useDatum from "../useDatum.ts"
import { IUsers } from "../user/useGetUsers.ts";
import { IVechiles } from "../vehicle/useGetVehicles.ts";

enum BookingStatus {
	PENDING,
	ACCEPTED,
	IN_PROGRESS,
	COMPLETED,
	CANCELLED,
  }
  
enum PaymentStatus {
	PENDING,
	PAID,
	FAILED,
  }
  
export interface IBookings {
	id: string,
	bookerId: string,
	bookingNumber: string,
	booker: IUsers
	vehicle: IVechiles
	vechileId: string,
	startLocation: string,
	endLocation: string,
	totalPrice: string,
	stauts: BookingStatus,
	paymentStatus: PaymentStatus,
	createdAt: string,
	updatedAt: string,
}

const useGetBookings = () => {
	const queryKey = ["bookings"]
	const endpoint = "/bookings"
	const query: (string | Record<string, never>)[] =[]
	const requestConfig: AxiosRequestConfig = {
		headers: {
		  Authorization: `${localStorage.getItem("authToken")}`,
		},
	  };
	return useDatum<IBookings[]>(queryKey, endpoint, requestConfig)
}

export default useGetBookings
