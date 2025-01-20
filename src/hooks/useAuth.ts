import useDatum from "./useDatum.ts"

export interface IVehicle {
	status: boolean;
	message: string;
}

const useVehicle = () => {
	const queryKey = ["test"]
	const endpoint = "/vehicle"

	return useDatum<IVehicle>(queryKey, endpoint)
}

export default useVehicle
