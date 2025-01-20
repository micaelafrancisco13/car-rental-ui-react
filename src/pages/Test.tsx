import useTest from "../hooks/useTest.ts"

function Test() {

	const { data, isLoading, error } = useTest()

	if (error) return null

	if (isLoading) return <h1>Loading...</h1>

	return (
		<>
			<h1>{data?.message}</h1>
		</>
	)
}

export default Test