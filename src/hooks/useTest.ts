import useDatum from "./useDatum.ts"

export interface Test {
	status: boolean;
	message: string;
}

const useTest = () => {
	const queryKey = ["test"]
	const endpoint = "/test"

	return useDatum<Test>(queryKey, endpoint)
}

export default useTest
