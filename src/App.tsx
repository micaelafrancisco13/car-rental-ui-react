import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Test from "./components/pages/Test.tsx"

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Test />
		}
	])
	return (
		<>
			<RouterProvider router={router} />
		</>
	)
}

export default App
